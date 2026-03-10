export interface Product {
  product_code: string;
  product_name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

export const products: Product[] = [
  // Thời trang nam
  { product_code: "SP001", product_name: "Áo sơ mi nam trắng", category: "Thời trang nam", price: 350000, stock: 50, description: "Áo sơ mi nam màu trắng, chất liệu cotton thoáng mát, form dáng slim-fit." },
  { product_code: "SP002", product_name: "Quần Jean nam xanh", category: "Thời trang nam", price: 550000, stock: 30, description: "Quần jean nam màu xanh cổ điển, co giãn tốt, bền màu." },
  { product_code: "SP031", product_name: "Áo thun nam cổ tròn", category: "Thời trang nam", price: 150000, stock: 100, description: "Áo thun cotton 100%, thấm hút mồ hôi, nhiều màu sắc lựa chọn." },
  { product_code: "SP032", product_name: "Áo khoác gió nam", category: "Thời trang nam", price: 450000, stock: 25, description: "Áo khoác gió 2 lớp chống nước nhẹ, phù hợp đi mưa bóng." },
  { product_code: "SP033", product_name: "Quần short kaki nam", category: "Thời trang nam", price: 250000, stock: 40, description: "Quần short kaki năng động, thoải mái cho các hoạt động ngoài trời." },

  // Giày dép
  { product_code: "SP003", product_name: "Giày Sneaker trắng", category: "Giày dép", price: 850000, stock: 20, description: "Giày sneaker phong cách trẻ trung, đế cao su chống trượt." },
  { product_code: "SP034", product_name: "Giày Tây da bò", category: "Giày dép", price: 1250000, stock: 15, description: "Giày tây nam da bò thật, thiết kế sang trọng cho quý ông công sở." },
  { product_code: "SP035", product_name: "Dép bánh mì unisex", category: "Giày dép", price: 180000, stock: 80, description: "Dép bánh mì siêu nhẹ, êm chân, thời trang." },
  { product_code: "SP036", product_name: "Sandal nữ quai mảnh", category: "Giày dép", price: 320000, stock: 30, description: "Sandal nữ thiết kế thanh lịch, dễ phối đồ." },

  // Thời trang nữ
  { product_code: "SP004", product_name: "Váy hoa nhí nữ", category: "Thời trang nữ", price: 420000, stock: 15, description: "Váy hoa nhí dịu dàng, chất liệu voan mềm mại, phù hợp đi chơi, dạo phố." },
  { product_code: "SP037", product_name: "Chân váy chữ A", category: "Thời trang nữ", price: 280000, stock: 45, description: "Chân váy chữ A tôn dáng, dễ kết hợp với áo thun hoặc sơ mi." },
  { product_code: "SP038", product_name: "Áo kiểu nữ tay phồng", category: "Thời trang nữ", price: 350000, stock: 20, description: "Áo kiểu nữ thiết kế điệu đà, chất liệu lụa satin." },
  { product_code: "SP039", product_name: "Quần ống rộng nữ", category: "Thời trang nữ", price: 380000, stock: 25, description: "Quần vải ống rộng thời thượng, che khuyết điểm chân tốt." },

  // Phụ kiện
  { product_code: "SP005", product_name: "Túi xách da nữ", category: "Phụ kiện", price: 1200000, stock: 10, description: "Túi xách da thật cao cấp, thiết kế sang trọng, nhiều ngăn tiện dụng." },
  { product_code: "SP015", product_name: "Balo laptop 15.6 inch", category: "Phụ kiện", price: 750000, stock: 35, description: "Balo chống nước, có ngăn chống sốc cho laptop, quai đeo êm ái." },
  { product_code: "SP030", product_name: "Ốp lưng iPhone 15", category: "Phụ kiện", price: 200000, stock: 150, description: "Ốp lưng silicon trong suốt, bảo vệ máy khỏi va đập, trầy xước." },
  { product_code: "SP040", product_name: "Thắt lưng da nam", category: "Phụ kiện", price: 450000, stock: 30, description: "Thắt lưng da bò nguyên tấm, khóa kim loại không gỉ." },
  { product_code: "SP041", product_name: "Kính mát thời trang", category: "Phụ kiện", price: 350000, stock: 50, description: "Kính mát chống tia UV, thiết kế hiện đại." },

  // Điện tử
  { product_code: "SP006", product_name: "Đồng hồ thông minh S1", category: "Điện tử", price: 2500000, stock: 25, description: "Đồng hồ thông minh hỗ trợ theo dõi sức khỏe, đo nhịp tim, thông báo tin nhắn." },
  { product_code: "SP007", product_name: "Tai nghe Bluetooth Pro", category: "Điện tử", price: 1500000, stock: 40, description: "Tai nghe không dây chống ồn chủ động, âm thanh sống động, pin lâu." },
  { product_code: "SP008", product_name: "Sạc dự phòng 20000mAh", category: "Điện tử", price: 600000, stock: 60, description: "Sạc dự phòng dung lượng lớn, hỗ trợ sạc nhanh, thiết kế nhỏ gọn." },
  { product_code: "SP016", product_name: "Chuột không dây Silent", category: "Điện tử", price: 250000, stock: 70, description: "Chuột không dây không gây tiếng ồn khi click, thiết kế công thái học." },
  { product_code: "SP017", product_name: "Bàn phím cơ RGB", category: "Điện tử", price: 1200000, stock: 18, description: "Bàn phím cơ blue switch, đèn LED RGB nhiều chế độ, độ bền cao." },
  { product_code: "SP029", product_name: "Loa Bluetooth Mini", category: "Điện tử", price: 450000, stock: 50, description: "Loa bluetooth nhỏ gọn, âm thanh bass mạnh, chống nước nhẹ." },
  { product_code: "SP042", product_name: "Laptop Office X1", category: "Điện tử", price: 15000000, stock: 5, description: "Laptop văn phòng mỏng nhẹ, chip Core i5, RAM 8GB, SSD 256GB." },
  { product_code: "SP043", product_name: "Màn hình 24 inch IPS", category: "Điện tử", price: 3500000, stock: 10, description: "Màn hình máy tính độ phân giải Full HD, tấm nền IPS cho góc nhìn rộng." },

  // Đồ gia dụng
  { product_code: "SP009", product_name: "Bình giữ nhiệt 500ml", category: "Đồ gia dụng", price: 250000, stock: 100, description: "Bình giữ nhiệt inox 304, giữ nóng 12h, giữ lạnh 24h." },
  { product_code: "SP010", product_name: "Bộ nồi inox 3 món", category: "Đồ gia dụng", price: 1800000, stock: 12, description: "Bộ nồi inox cao cấp, đáy 5 lớp, dùng được cho mọi loại bếp." },
  { product_code: "SP011", product_name: "Máy pha cà phê mini", category: "Đồ gia dụng", price: 3200000, stock: 5, description: "Máy pha cà phê gia đình, áp suất 15 bar, pha espresso cực ngon." },
  { product_code: "SP021", product_name: "Nồi chiên không dầu", category: "Đồ gia dụng", price: 2200000, stock: 8, description: "Nồi chiên không dầu dung tích 5L, công nghệ Rapid Air giảm 80% dầu mỡ." },
  { product_code: "SP022", product_name: "Máy hút bụi cầm tay", category: "Đồ gia dụng", price: 1500000, stock: 15, description: "Máy hút bụi không dây, lực hút mạnh, dễ dàng vệ sinh mọi ngóc ngách." },
  { product_code: "SP023", product_name: "Đèn bàn học LED", category: "Đồ gia dụng", price: 450000, stock: 30, description: "Đèn bàn bảo vệ thị lực, 3 chế độ ánh sáng, có thể điều chỉnh độ sáng." },
  { product_code: "SP044", product_name: "Ấm siêu tốc 1.8L", category: "Đồ gia dụng", price: 350000, stock: 40, description: "Ấm đun nước siêu tốc bằng inox, tự động ngắt khi nước sôi." },
  { product_code: "SP045", product_name: "Máy xay sinh tố đa năng", category: "Đồ gia dụng", price: 850000, stock: 20, description: "Máy xay sinh tố công suất lớn, xay được đá và các loại hạt." },

  // Mỹ phẩm
  { product_code: "SP012", product_name: "Kem chống nắng SPF50", category: "Mỹ phẩm", price: 350000, stock: 80, description: "Kem chống nắng bảo vệ da toàn diện, không gây nhờn rít." },
  { product_code: "SP013", product_name: "Son môi đỏ nhung", category: "Mỹ phẩm", price: 450000, stock: 45, description: "Son môi màu đỏ nhung quyến rũ, chất son lì mịn, lâu trôi." },
  { product_code: "SP014", product_name: "Sữa rửa mặt trà xanh", category: "Mỹ phẩm", price: 150000, stock: 120, description: "Sữa rửa mặt chiết xuất trà xanh, làm sạch sâu, ngừa mụn." },
  { product_code: "SP046", product_name: "Tẩy trang hoa hồng", category: "Mỹ phẩm", price: 220000, stock: 65, description: "Nước tẩy trang dịu nhẹ, làm sạch lớp trang điểm và bụi bẩn." },
  { product_code: "SP047", product_name: "Mặt nạ giấy dưỡng ẩm", category: "Mỹ phẩm", price: 25000, stock: 300, description: "Mặt nạ giấy cung cấp độ ẩm tức thì cho da." },

  // Thể thao
  { product_code: "SP018", product_name: "Thảm tập Yoga", category: "Thể thao", price: 300000, stock: 55, description: "Thảm tập yoga chống trượt, độ dày 6mm, chất liệu TPE an toàn." },
  { product_code: "SP019", product_name: "Tạ tay 5kg", category: "Thể thao", price: 200000, stock: 40, description: "Tạ tay bọc cao su, cầm nắm chắc chắn, phù hợp tập luyện tại nhà." },
  { product_code: "SP020", product_name: "Bình nước thể thao 1L", category: "Thể thao", price: 120000, stock: 90, description: "Bình nước nhựa Tritan cao cấp, không chứa BPA, có vạch chia dung tích." },
  { product_code: "SP048", product_name: "Dây nhảy thể lực", category: "Thể thao", price: 80000, stock: 120, description: "Dây nhảy có bộ đếm số vòng, tay cầm êm ái." },
  { product_code: "SP049", product_name: "Quần legging tập gym", category: "Thể thao", price: 280000, stock: 35, description: "Quần legging co giãn 4 chiều, thấm hút mồ hôi tốt." },

  // Văn phòng phẩm
  { product_code: "SP024", product_name: "Sổ tay bìa da A5", category: "Văn phòng phẩm", price: 150000, stock: 200, description: "Sổ tay bìa da sang trọng, giấy định lượng cao, không lem mực." },
  { product_code: "SP025", product_name: "Bút ký cao cấp", category: "Văn phòng phẩm", price: 500000, stock: 25, description: "Bút ký kim loại, thiết kế tinh tế, mực ra đều và mượt." },
  { product_code: "SP050", product_name: "Hộp bút đa năng", category: "Văn phòng phẩm", price: 65000, stock: 150, description: "Hộp đựng bút nhiều ngăn, chất liệu nhựa bền đẹp." },
  { product_code: "SP051", product_name: "Giấy in A4 70gsm", category: "Văn phòng phẩm", price: 75000, stock: 500, description: "Giấy in trắng đẹp, độ sắc nét cao, không kẹt giấy." },

  // Nội thất
  { product_code: "SP026", product_name: "Kệ sách gỗ 3 tầng", category: "Nội thất", price: 950000, stock: 7, description: "Kệ sách gỗ công nghiệp, thiết kế tối giản, dễ dàng lắp ráp." },
  { product_code: "SP027", product_name: "Ghế xoay văn phòng", category: "Nội thất", price: 1800000, stock: 12, description: "Ghế xoay có tựa lưng lưới thoáng mát, điều chỉnh được độ cao." },
  { product_code: "SP028", product_name: "Gối tựa lưng sofa", category: "Nội thất", price: 250000, stock: 45, description: "Gối tựa lưng mềm mại, vỏ gối có thể tháo rời để giặt." },
  { product_code: "SP052", product_name: "Bàn làm việc gỗ", category: "Nội thất", price: 2500000, stock: 4, description: "Bàn làm việc chất liệu gỗ tự nhiên, có hộc kéo tiện dụng." },
  { product_code: "SP053", product_name: "Đèn ngủ mặt trăng", category: "Nội thất", price: 350000, stock: 20, description: "Đèn ngủ thiết kế hình mặt trăng độc đáo, có nhiều màu sắc." },

  // Thực phẩm (Mới)
  { product_code: "SP054", product_name: "Cà phê hạt Arabica", category: "Thực phẩm", price: 280000, stock: 60, description: "Cà phê hạt Arabica nguyên chất, hương thơm nồng nàn." },
  { product_code: "SP055", product_name: "Trà xanh Thái Nguyên", category: "Thực phẩm", price: 150000, stock: 80, description: "Trà xanh đặc sản Thái Nguyên, vị chát dịu, hậu ngọt." },
  { product_code: "SP056", product_name: "Hạt điều rang muối", category: "Thực phẩm", price: 320000, stock: 40, description: "Hạt điều loại 1, rang muối giòn rụm, giàu dinh dưỡng." },
  { product_code: "SP057", product_name: "Mật ong nhãn nguyên chất", category: "Thực phẩm", price: 250000, stock: 30, description: "Mật ong hoa nhãn tự nhiên, không pha tạp chất." },
  { product_code: "SP058", product_name: "Bánh quy bơ Pháp", category: "Thực phẩm", price: 120000, stock: 100, description: "Bánh quy bơ thơm ngon, nhập khẩu từ Pháp." },
  { product_code: "SP059", product_name: "Socola đen 70%", category: "Thực phẩm", price: 85000, stock: 150, description: "Socola đen nguyên chất, ít đường, tốt cho sức khỏe." },
  { product_code: "SP060", product_name: "Nước ép cam nguyên chất", category: "Thực phẩm", price: 45000, stock: 200, description: "Nước ép cam tươi, không chất bảo quản." },
  
  // Thêm sản phẩm mới theo yêu cầu
  { product_code: "SP061", product_name: "Áo sơ mi nam caro", category: "Thời trang nam", price: 380000, stock: 45, description: "Áo sơ mi họa tiết caro trẻ trung, chất vải flannel mềm mại." },
  { product_code: "SP062", product_name: "Áo sơ mi nam Oxford", category: "Thời trang nam", price: 420000, stock: 35, description: "Áo sơ mi Oxford cao cấp, dày dặn, phù hợp mặc đi làm và đi tiệc." },
  { product_code: "SP063", product_name: "Quần Tây nam Slim Fit", category: "Thời trang nam", price: 480000, stock: 40, description: "Quần tây nam dáng ôm vừa vặn, chất vải không nhăn, giữ form tốt." },
  { product_code: "SP064", product_name: "Quần Jogger nam", category: "Thời trang nam", price: 320000, stock: 55, description: "Quần jogger thun năng động, phù hợp tập thể thao hoặc mặc nhà." },
  
  { product_code: "SP065", product_name: "Giày Sneaker cổ cao", category: "Giày dép", price: 950000, stock: 15, description: "Giày sneaker cổ cao phong cách cá tính, chất liệu vải canvas bền bỉ." },
  { product_code: "SP066", product_name: "Giày lười nam (Loafer)", category: "Giày dép", price: 1100000, stock: 20, description: "Giày lười da lộn sang trọng, dễ dàng phối đồ công sở hoặc dạo phố." },
  { product_code: "SP067", product_name: "Giày cao gót nữ 7cm", category: "Giày dép", price: 550000, stock: 25, description: "Giày cao gót mũi nhọn thanh lịch, gót chắc chắn, đi êm chân." },
  { product_code: "SP068", product_name: "Dép quai ngang nam", category: "Giày dép", price: 150000, stock: 100, description: "Dép quai ngang chất liệu cao su đúc nguyên khối, bền bỉ, chống nước." },

  { product_code: "SP069", product_name: "Váy Maxi đi biển", category: "Thời trang nữ", price: 580000, stock: 18, description: "Váy maxi dáng dài thướt tha, họa tiết nhiệt đới rực rỡ." },
  { product_code: "SP070", product_name: "Áo Blazer nữ", category: "Thời trang nữ", price: 650000, stock: 12, description: "Áo blazer form rộng hiện đại, chất vải tây cao cấp, có lớp lót." },
  { product_code: "SP071", product_name: "Quần Short nữ Jean", category: "Thời trang nữ", price: 250000, stock: 50, description: "Quần short jean nữ rách cá tính, lưng cao tôn dáng." },
  { product_code: "SP072", product_name: "Áo len nữ cổ lọ", category: "Thời trang nữ", price: 320000, stock: 30, description: "Áo len dệt kim mềm mại, giữ ấm tốt, nhiều màu pastel ngọt ngào." },

  { product_code: "SP073", product_name: "iPhone 15 Pro Max 256GB", category: "Điện tử", price: 32000000, stock: 10, description: "Điện thoại iPhone mới nhất với khung viền Titan, camera zoom 5x." },
  { product_code: "SP074", product_name: "Samsung Galaxy S24 Ultra", category: "Điện tử", price: 28000000, stock: 8, description: "Flagship Samsung với bút S-Pen quyền năng và tính năng AI thông minh." },
  { product_code: "SP075", product_name: "Tai nghe Gaming RGB", category: "Điện tử", price: 850000, stock: 25, description: "Tai nghe chụp tai có mic, âm thanh giả lập 7.1, đèn LED RGB." },
  { product_code: "SP076", product_name: "Máy tính bảng Tab S9", category: "Điện tử", price: 18500000, stock: 15, description: "Máy tính bảng màn hình AMOLED rực rỡ, hỗ trợ công việc và giải trí." },

  { product_code: "SP077", product_name: "Nồi cơm điện cao tần 1.8L", category: "Đồ gia dụng", price: 3500000, stock: 10, description: "Nồi cơm điện công nghệ IH giúp cơm chín đều, thơm ngon hơn." },
  { product_code: "SP078", product_name: "Máy lọc không khí H13", category: "Đồ gia dụng", price: 4200000, stock: 7, description: "Máy lọc không khí màng lọc HEPA H13, loại bỏ bụi mịn và vi khuẩn." },
  { product_code: "SP079", product_name: "Bàn là hơi nước đứng", category: "Đồ gia dụng", price: 1200000, stock: 20, description: "Bàn là hơi nước công suất lớn, ủi phẳng quần áo nhanh chóng." },
  { product_code: "SP080", product_name: "Máy sấy tóc ion âm", category: "Đồ gia dụng", price: 650000, stock: 35, description: "Máy sấy tóc bảo vệ tóc khỏi hư tổn, sấy nhanh khô." },

  { product_code: "SP081", product_name: "Serum Vitamin C sáng da", category: "Mỹ phẩm", price: 450000, stock: 50, description: "Serum chứa Vitamin C nguyên chất giúp mờ thâm, sáng da hiệu quả." },
  { product_code: "SP082", product_name: "Kem dưỡng ẩm ban đêm", category: "Mỹ phẩm", price: 380000, stock: 40, description: "Kem dưỡng phục hồi da vào ban đêm, cấp ẩm sâu." },

  { product_code: "SP083", product_name: "Vợt cầu lông chuyên nghiệp", category: "Thể thao", price: 1500000, stock: 12, description: "Vợt cầu lông carbon siêu nhẹ, sức căng lớn, trợ lực tốt." },
  { product_code: "SP084", product_name: "Quả bóng đá size 5", category: "Thể thao", price: 350000, stock: 30, description: "Bóng đá tiêu chuẩn thi đấu, độ nảy tốt, bền bỉ trên mọi mặt sân." },

  { product_code: "SP085", product_name: "Bút chì màu 24 màu", category: "Văn phòng phẩm", price: 85000, stock: 100, description: "Bộ bút chì màu chất lượng cao, màu sắc tươi sáng, dễ tô." },
  { product_code: "SP086", product_name: "Bảng vẽ điện tử Mini", category: "Văn phòng phẩm", price: 1200000, stock: 15, description: "Bảng vẽ cảm ứng dành cho họa sĩ và người thiết kế đồ họa." },

  { product_code: "SP087", product_name: "Ghế Gaming Ergonomic", category: "Nội thất", price: 3800000, stock: 5, description: "Ghế chơi game thiết kế công thái học, ngả lưng 180 độ, có gối đầu." },
  { product_code: "SP088", product_name: "Tủ quần áo vải 3 buồng", category: "Nội thất", price: 450000, stock: 25, description: "Tủ vải khung gỗ chắc chắn, sức chứa lớn, dễ dàng tháo lắp." },

  { product_code: "SP089", product_name: "Sữa hạt hạnh nhân 1L", category: "Thực phẩm", price: 75000, stock: 120, description: "Sữa hạt hạnh nhân nguyên chất, không đường, giàu canxi." },
  { product_code: "SP090", product_name: "Ngũ cốc yến mạch ăn kiêng", category: "Thực phẩm", price: 135000, stock: 85, description: "Ngũ cốc yến mạch mix hạt, phù hợp cho người giảm cân." }
];
