import { GoogleGenAI } from "@google/genai";
// 1. Import trực tiếp data sản phẩm (Thay vì gọi API)
import { products } from "../data/products";

// 2. Tạo một mảng kiến thức tĩnh (Vì SQLite server không tồn tại trên Vercel)
const knowledgeData =[
  { topic: "Chính sách đổi trả", content: "Hỗ trợ đổi trả trong 7 ngày nếu lỗi từ nhà sản xuất. Sản phẩm phải còn nguyên tem mác và hóa đơn." },
  { topic: "Chính sách vận chuyển", content: "Miễn phí vận chuyển cho đơn hàng từ 500k. Dưới 500k phí ship là 30k toàn quốc." },
  { topic: "Mẹo bán hàng thời trang", content: "Khuyến khích khách mua thêm phụ kiện như thắt lưng, túi xách để phối đồ. Luôn tư vấn size cẩn thận." },
  { topic: "Bảo hành đồ điện tử", content: "Bảo hành 12 tháng chính hãng. Khách cần giữ hóa đơn mua hàng trên KiotViet." },
  { topic: "Chính sách khách hàng thành viên", content: "Thành viên VIP (mua tích lũy trên 10 triệu) được giảm 5% cho mọi đơn hàng. Thành viên VVIP (trên 30 triệu) giảm 10%." }
];

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
(Liệt kê các sản phẩm phù hợp nhất. Định dạng: -[Mã SP] Tên SP - Giá: [Giá]đ - Tồn: [Số lượng]. Nếu thực sự không có sản phẩm nào liên quan, ghi "Không có sản phẩm liên quan").

### KIẾN THỨC BỔ TRỢ (Nội bộ)
(BẮT BUỘC: Trích dẫn các quy định, chính sách, quy trình hoặc mẹo bán hàng từ Context. Đây là phần quan trọng để giúp Sale hiểu rõ nghiệp vụ).

LƯU Ý:
- Tuyệt đối không bịa đặt thông tin. Chỉ sử dụng dữ liệu trong Context.
- Luôn ưu tiên độ chính xác tuyệt đối của Giá và Tồn kho.`;

export async function chatWithGemini(userMessage: string, isCustomerQuestion: boolean = false) {
  // 3. Lấy API Key từ biến môi trường của Vite (import.meta.env) hoặc fallback về cấu hình của vite.config.ts
  const apiKey = import.meta.env?.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("Lỗi: Không tìm thấy GEMINI_API_KEY. Vui lòng cấu hình Environment Variables.");
    return "Lỗi hệ thống: Chưa cấu hình GEMINI_API_KEY. Vui lòng báo cho quản trị viên.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  // 4. Tìm kiếm nội dung liên quan trực tiếp từ mảng tĩnh (Không dùng Fetch API nữa)
  const relevantContext = findRelevantContext(userMessage, products, knowledgeData);

  const modeText = isCustomerQuestion ? "CHẾ ĐỘ: HỖ TRỢ TRẢ LỜI KHÁCH HÀNG (Dual Chat)" : "CHẾ ĐỘ: TRUY XUẤT THÔNG TIN";
  const prompt = `${modeText}\n\nContext nội bộ:\n${relevantContext}\n\nYêu cầu từ nhân viên: ${userMessage}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Đã đổi sang bản ổn định
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.2, 
      },
    });

    return response.text || "Không có phản hồi từ hệ thống.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Lỗi kết nối AI. Vui lòng thử lại sau.";
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
    .slice(0, 25);

  const matchedKnowledge = knowledge
    .map(k => ({ ...k, score: scoreKnowledge(k) }))
    .filter(k => k.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);

  let finalKnowledge = matchedKnowledge;
  if (finalKnowledge.length === 0 && knowledge.length > 0) {
    finalKnowledge = knowledge.slice(0, 5);
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