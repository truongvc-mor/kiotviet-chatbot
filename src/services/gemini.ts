import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `Bạn là chuyên gia tư vấn bán hàng cao cấp và trợ lý tri thức nội bộ (AI Sales Hub). 
Nhiệm vụ của bạn là hỗ trợ nhân viên Sale truy xuất thông tin và trả lời khách hàng một cách thông minh, dựa trên HAI nguồn dữ liệu chính:
1. DANH MỤC SẢN PHẨM (từ KiotViet): Thông tin về mã SP, tên, giá, tồn kho và mô tả.
2. KHO KIẾN THỨC NỘI BỘ: Các quy định, chính sách, mẹo bán hàng, quy trình xử lý.

QUY TẮC BẮT BUỘC:
- LUÔN LUÔN kiểm tra cả hai nguồn dữ liệu trong Context được cung cấp.
- KHÔNG ĐƯỢC bỏ qua phần "KIẾN THỨC BỔ TRỢ". Nếu không có kiến thức khớp 100%, hãy trích dẫn các quy định chung hoặc mẹo bán hàng có sẵn trong Context để hỗ trợ Sale.
- CHỌN SẢN PHẨM CHÍNH XÁC: Phải ưu tiên các sản phẩm khớp nhất với nhu cầu khách hàng (về loại hàng, màu sắc, công dụng).

CẤU TRÚC PHẢN HỒI (PHẢI TUÂN THỦ):

### GỢI Ý TRẢ LỜI / THÔNG TIN TRUY XUẤT
(Nếu hỗ trợ khách: Viết đoạn trả lời lịch sự, chuyên nghiệp, lồng ghép khéo léo các sản phẩm. Nếu truy xuất nội bộ: Trình bày thông tin rõ ràng, súc tích).

### SẢN PHẨM LIÊN QUAN (KiotViet)
(Liệt kê các sản phẩm phù hợp nhất. Định dạng: - [Mã SP] Tên SP - Giá: [Giá]đ - Tồn: [Số lượng]. Nếu thực sự không có sản phẩm nào liên quan, ghi "Không có sản phẩm liên quan").

### KIẾN THỨC BỔ TRỢ (Nội bộ)
(BẮT BUỘC: Trích dẫn các quy định, chính sách, quy trình hoặc mẹo bán hàng từ Context. Đây là phần quan trọng để giúp Sale hiểu rõ nghiệp vụ).

LƯU Ý:
- Tuyệt đối không bịa đặt thông tin. Chỉ sử dụng dữ liệu trong Context.
- Luôn ưu tiên độ chính xác tuyệt đối của Giá và Tồn kho.`;

export async function chatWithGemini(userMessage: string, isCustomerQuestion: boolean = false) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // 1. Fetch data from local API
  const [products, knowledge] = await Promise.all([
    fetch("/api/products").then(res => res.json()),
    fetch("/api/knowledge").then(res => res.json())
  ]);

  // 2. Find relevant context (Broaden search for better AI matching)
  const relevantContext = findRelevantContext(userMessage, products, knowledge);

  const modeText = isCustomerQuestion ? "CHẾ ĐỘ: HỖ TRỢ TRẢ LỜI KHÁCH HÀNG (Dual Chat)" : "CHẾ ĐỘ: TRUY XUẤT THÔNG TIN";
  const prompt = `${modeText}\n\nContext nội bộ:\n${relevantContext}\n\nYêu cầu từ nhân viên: ${userMessage}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, 
      },
    });

    return response.text || "Không có phản hồi từ hệ thống.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Lỗi kết nối AI.";
  }
}

function findRelevantContext(query: string, products: any[], knowledge: any[]): string {
  const lowerQuery = query.toLowerCase();
  const words = lowerQuery.split(/\s+/).filter(w => w.length > 2);
  
  // Scoring function for products
  const scoreProduct = (p: any) => {
    const searchStr = `${p.product_name} ${p.product_code} ${p.category} ${p.description}`.toLowerCase();
    let score = 0;
    if (searchStr.includes(lowerQuery)) score += 10; // Exact phrase match
    words.forEach(word => {
      if (searchStr.includes(word)) score += 2; // Partial word match
    });
    return score;
  };

  // Scoring function for knowledge
  const scoreKnowledge = (k: any) => {
    const searchStr = `${k.topic} ${k.content}`.toLowerCase();
    let score = 0;
    if (searchStr.includes(lowerQuery)) score += 10;
    words.forEach(word => {
      if (searchStr.includes(word)) score += 2;
    });
    return score;
  };

  const matchedProducts = products
    .map(p => ({ ...p, score: scoreProduct(p) }))
    .filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 25); // Increase limit to 25

  const matchedKnowledge = knowledge
    .map(k => ({ ...k, score: scoreKnowledge(k) }))
    .filter(k => k.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15); // Increase limit to 15

  // If no knowledge matched but query is short, provide some general ones
  let finalKnowledge = matchedKnowledge;
  if (finalKnowledge.length === 0 && knowledge.length > 0) {
    finalKnowledge = knowledge.slice(0, 5); // Provide top 5 general items if no match
  }

  let context = "--- DỮ LIỆU SẢN PHẨM (KiotViet) ---\n";
  if (matchedProducts.length > 0) {
    context += matchedProducts.map(p => 
      `- [${p.product_code}] ${p.product_name} | Giá: ${p.price.toLocaleString()}đ | Kho: ${p.stock} | Mô tả: ${p.description}`
    ).join("\n");
  } else {
    context += "(Không tìm thấy sản phẩm khớp trực tiếp. Hãy gợi ý khách xem các mẫu khác hoặc hỏi thêm nhu cầu)\n";
  }

  context += "\n--- KHO KIẾN THỨC NỘI BỘ ---\n";
  if (finalKnowledge.length > 0) {
    context += finalKnowledge.map(k => 
      `* CHỦ ĐỀ: ${k.topic}\n  NỘI DUNG: ${k.content}`
    ).join("\n\n");
  } else {
    context += "(Không có dữ liệu kiến thức liên quan)\n";
  }

  return context;
}
