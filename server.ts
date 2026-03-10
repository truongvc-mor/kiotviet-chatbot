import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { products as initialProducts } from "./src/data/products";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("knowledge_base.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    product_code TEXT UNIQUE,
    product_name TEXT,
    category TEXT,
    price REAL,
    stock INTEGER,
    description TEXT,
    last_sync DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS knowledge (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    topic TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed Data
const seedData = () => {
  const productCount = db.prepare("SELECT COUNT(*) as count FROM products").get() as { count: number };
  
  // If we have fewer products than in our initial data, or none at all, seed/update them
  if (productCount.count < initialProducts.length) {
    const insertProduct = db.prepare(`
      INSERT INTO products (product_code, product_name, category, price, stock, description)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(product_code) DO UPDATE SET
        product_name=excluded.product_name,
        category=excluded.category,
        price=excluded.price,
        stock=excluded.stock,
        description=excluded.description
    `);
    
    initialProducts.forEach(p => {
      insertProduct.run(p.product_code, p.product_name, p.category, p.price, p.stock, p.description);
    });
    console.log(`Synced ${initialProducts.length} products to database.`);
  }

  const knowledgeCount = db.prepare("SELECT COUNT(*) as count FROM knowledge").get() as { count: number };
  if (knowledgeCount.count === 0) {
    const sampleKnowledge = [
      { topic: "Chính sách đổi trả", content: "Khách hàng được đổi trả sản phẩm trong vòng 7 ngày kể từ ngày nhận hàng. Sản phẩm phải còn nguyên tem mác, chưa qua sử dụng và không bị hư hỏng do tác động bên ngoài." },
      { topic: "Quy trình xử lý đơn hàng", content: "1. Tiếp nhận đơn hàng từ hệ thống. 2. Kiểm tra tồn kho. 3. Đóng gói sản phẩm. 4. Bàn giao cho đơn vị vận chuyển. 5. Cập nhật trạng thái đơn hàng trên KiotViet." },
      { topic: "Cách bảo quản giày da", content: "Tránh tiếp xúc trực tiếp với nước và ánh nắng gắt. Nên sử dụng xi đánh giày định kỳ để giữ độ bóng và mềm của da. Khi không sử dụng, nên nhét giấy báo vào bên trong để giữ form giày." },
      { topic: "Chương trình khách hàng thân thiết", content: "Khách hàng tích lũy điểm dựa trên giá trị hóa đơn (100.000đ = 1 điểm). Điểm có thể dùng để giảm giá cho các lần mua tiếp theo hoặc đổi quà tặng hấp dẫn." },
      { topic: "Kỹ năng tư vấn bán hàng", content: "Luôn mỉm cười và chào đón khách hàng. Lắng nghe nhu cầu của khách để đưa ra gợi ý phù hợp. Nắm vững thông tin sản phẩm để giải đáp thắc mắc của khách hàng một cách chuyên nghiệp." },
      { topic: "Xử lý khiếu nại khách hàng", content: "Lắng nghe khách hàng với thái độ cầu thị. Ghi nhận thông tin khiếu nại và cam kết thời gian phản hồi. Báo cáo cấp trên nếu khiếu nại vượt quá thẩm quyền xử lý." },
      { topic: "Thông tin về chất liệu Cotton", content: "Vải cotton có khả năng thấm hút mồ hôi tốt, thoáng mát, phù hợp với khí hậu Việt Nam. Tuy nhiên, vải dễ nhăn nên cần ủi ở nhiệt độ trung bình." },
      { topic: "Chính sách bảo hành đồng hồ", content: "Bảo hành 12 tháng cho các lỗi kỹ thuật từ nhà sản xuất (máy, pin). Không bảo hành cho các lỗi do người dùng (vỡ kính, trầy xước, vào nước vượt mức quy định)." },
      { topic: "Quy định đồng phục nhân viên", content: "Nhân viên phải mặc đồng phục của công ty trong suốt ca làm việc. Đồng phục phải sạch sẽ, chỉnh tề. Nam: Áo sơ mi trắng, quần tây đen. Nữ: Áo sơ mi trắng, chân váy đen hoặc quần tây đen." },
      { topic: "Hướng dẫn sử dụng máy POS", content: "1. Bật máy POS. 2. Đăng nhập tài khoản nhân viên. 3. Chọn phương thức thanh toán (Tiền mặt/Thẻ/Chuyển khoản). 4. Quẹt thẻ hoặc quét mã QR. 5. In hóa đơn và giao cho khách." },
      { topic: "Chính sách giảm giá nhân viên", content: "Nhân viên chính thức được hưởng mức giảm giá 20% khi mua sản phẩm của công ty (tối đa 2 sản phẩm/tháng). Không áp dụng đồng thời với các chương trình khuyến mãi khác." },
      { topic: "Quy trình kiểm kê kho định kỳ", content: "Kiểm kê kho được thực hiện vào ngày cuối cùng của mỗi tháng. Nhân viên đối chiếu số lượng thực tế với số lượng trên hệ thống KiotViet. Các sai lệch phải được báo cáo và giải trình cụ thể." },
      { topic: "An toàn phòng cháy chữa cháy", content: "Nhân viên phải nắm rõ vị trí các bình chữa cháy và lối thoát hiểm. Tuyệt đối không hút thuốc hoặc sử dụng vật liệu dễ cháy trong kho. Tham gia đầy đủ các buổi tập huấn PCCC định kỳ." },
      { topic: "Văn hóa ứng xử nội bộ", content: "Tôn trọng đồng nghiệp và cấp trên. Hỗ trợ lẫn nhau trong công việc. Giữ gìn vệ sinh chung tại nơi làm việc. Xây dựng môi trường làm việc tích cực và chuyên nghiệp." },
      { topic: "Chính sách vận chuyển", content: "Miễn phí vận chuyển cho đơn hàng từ 500.000đ trở lên trong nội thành. Đối với các tỉnh thành khác, phí vận chuyển được tính theo biểu phí của đơn vị vận chuyển đối tác." },
      { topic: "Hướng dẫn giặt áo sơ mi", content: "Nên giặt tay hoặc giặt máy ở chế độ nhẹ. Không sử dụng chất tẩy mạnh. Phơi ở nơi thoáng mát, tránh ánh nắng trực tiếp để giữ màu vải bền lâu." },
      { topic: "Chính sách thanh toán", content: "Cửa hàng chấp nhận thanh toán bằng tiền mặt, thẻ ngân hàng (ATM, Visa, Mastercard) và chuyển khoản qua mã QR. Đối với đơn hàng online, khách hàng có thể chọn hình thức COD (thanh toán khi nhận hàng)." },
      { topic: "Quy định về thời gian làm việc", content: "Ca sáng: 8:00 - 15:00. Ca chiều: 15:00 - 22:00. Nhân viên phải có mặt trước 15 phút để bàn giao ca và chuẩn bị khu vực làm việc." },
      { topic: "Hướng dẫn sử dụng phần mềm KiotViet", content: "1. Đăng nhập hệ thống. 2. Chọn mục Bán hàng. 3. Quét mã vạch sản phẩm. 4. Chọn khách hàng (nếu có). 5. Nhập số tiền khách đưa. 6. Nhấn Thanh toán và In hóa đơn." },
      { topic: "Quy trình đổi trả hàng lỗi", content: "Nếu sản phẩm bị lỗi do nhà sản xuất, khách hàng được đổi sản phẩm mới cùng loại hoặc hoàn tiền 100% trong vòng 30 ngày. Nhân viên cần chụp ảnh lỗi và lập biên bản xác nhận." },
      { topic: "Cách tư vấn size quần áo", content: "Size S: 45-55kg. Size M: 55-65kg. Size L: 65-75kg. Size XL: 75-85kg. Tuy nhiên, cần lưu ý đến chiều cao và form dáng (slimfit hay regular) để tư vấn chính xác nhất." },
      { topic: "Thông tin về chất liệu Vải Lanh (Linen)", content: "Vải lanh có nguồn gốc tự nhiên, cực kỳ thoáng mát và có độ bền cao. Đặc điểm của vải là dễ nhăn, tạo nên vẻ đẹp mộc mạc đặc trưng. Nên giặt bằng nước lạnh." },
      { topic: "Quy định về bảo mật thông tin", content: "Nhân viên tuyệt đối không được tiết lộ thông tin khách hàng, doanh thu cửa hàng hoặc các chiến lược kinh doanh nội bộ cho người ngoài. Vi phạm sẽ bị xử lý kỷ luật nghiêm khắc." },
      { topic: "Quy trình vệ sinh cửa hàng", content: "Vệ sinh sàn nhà, kệ trưng bày và gương soi vào đầu mỗi ca làm việc. Đảm bảo sản phẩm luôn được sắp xếp gọn gàng, đúng vị trí. Khu vực thử đồ phải luôn sạch sẽ." },
      { topic: "Kỹ năng xử lý từ chối của khách", content: "Khi khách chê giá cao, hãy nhấn mạnh vào chất lượng và chính sách hậu mãi. Khi khách phân vân, hãy đưa ra các lựa chọn thay thế hoặc gợi ý các sản phẩm đang bán chạy." },
    ];
    const insertKnowledge = db.prepare("INSERT INTO knowledge (topic, content) VALUES (?, ?)");
    sampleKnowledge.forEach(k => insertKnowledge.run(k.topic, k.content));
    console.log("Seeded sample knowledge.");
  }
};

seedData();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/products", (req, res) => {
    const products = db.prepare("SELECT * FROM products").all();
    res.json(products);
  });

  app.post("/api/products", (req, res) => {
    const { product_code, product_name, category, price, stock, description } = req.body;
    try {
      const stmt = db.prepare(`
        INSERT INTO products (product_code, product_name, category, price, stock, description)
        VALUES (?, ?, ?, ?, ?, ?)
        ON CONFLICT(product_code) DO UPDATE SET
          product_name=excluded.product_name,
          category=excluded.category,
          price=excluded.price,
          stock=excluded.stock,
          description=excluded.description,
          last_sync=CURRENT_TIMESTAMP
      `);
      stmt.run(product_code, product_name, category, price, stock, description);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  app.get("/api/knowledge", (req, res) => {
    const knowledge = db.prepare("SELECT * FROM knowledge").all();
    res.json(knowledge);
  });

  app.post("/api/knowledge", (req, res) => {
    const { topic, content } = req.body;
    try {
      const stmt = db.prepare("INSERT INTO knowledge (topic, content) VALUES (?, ?)");
      stmt.run(topic, content);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  });

  // Mock KiotViet Sync
  app.post("/api/sync-kiotviet", (req, res) => {
    // In a real app, you'd use KIOTVIET_CLIENT_ID etc to fetch from KiotViet API
    // Here we simulate a sync by adding/updating some items
    res.json({ message: "Sync initiated (Mock mode). In a real environment, this would call KiotViet APIs." });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
