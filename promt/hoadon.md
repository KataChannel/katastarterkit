model ext_listhoadon {
  id        String  @id @default(uuid())
  idServer  String? @unique // Basic Invoice Info
  brandname String? // Tên nhãn hàng
  nbmst     String? // Mã số thuế người bán
  khmshdon  String? // Ký hiệu mẫu số hóa đơn
  khhdon    String? // Ký hiệu hóa đơn
  shdon     String? // Số hóa đơn
  cqt       String? // Cơ quan thuế
  hdon      String? // Hóa đơn
  hthdon    String? // Hình thức hóa đơn
  htttoan   String? // Hình thức thanh toán
  idtbao    String? // ID thông báo
  khdon     String? // Khách hàng hóa đơn
  khhdgoc   String? // Ký hiệu hóa đơn gốc
  khmshdgoc String? // Ký hiệu mẫu số hóa đơn gốc
  lhdgoc    String? // Loại hóa đơn gốc
  mhdon     String? // Mã hóa đơn
  mtdiep    String? // Mã thông điệp
  mtdtchieu String? // Mã thông điệp tham chiếu

  // Seller Information
  nbdchi      String? // Địa chỉ người bán
  chma        String? // Chữ ký mã
  chten       String? // Chữ ký tên
  nbhdktngay  DateTime? // Ngày ký hợp đồng người bán
  nbhdktso    String? // Số ký hợp đồng người bán
  nbhdso      String? // Số hợp đồng người bán
  nblddnbo    String? // Người bán lãnh đạo đại diện bộ
  nbptvchuyen String? // Người bán phương thức vận chuyển
  nbstkhoan   String? // Số tài khoản người bán
  nbten       String? // Tên người bán
  nbtnhang    String? // Tên nhãn hàng người bán
  nbtnvchuyen String? // Tên nhà vận chuyển người bán

  // Other Codes
  ncma    String? // Mã người cung cấp
  ncnhat  DateTime? // Ngày cập nhật người cung cấp
  ngcnhat DateTime? // Ngày cập nhật
  nky     String? // Người ký

  // Buyer Information
  nmdchi    String? // Địa chỉ người mua
  nmmst     String? // Mã số thuế người mua
  nmstkhoan String? // Số tài khoản người mua
  nmten     String? // Tên người mua
  nmtnhang  String? // Tên nhãn hàng người mua
  nmtnmua   String? // Tên người mua thực tế
  nmttkhac  String? // Thông tin khác người mua

  // Process Information
  ntao   DateTime? // Ngày tạo
  ntnhan DateTime? // Ngày nhận
  pban   String? // Phiên bản
  ptgui  String? // Phương thức gửi
  shdgoc String? // Số hóa đơn gốc
  tchat  String? // Tính chất
  tdlap  DateTime? // Thời điểm lập
  tgia   Decimal? // Tiền gia

  // Amounts
  tgtcthue  Decimal? // Tổng giá trị chưa thuế
  tgtthue   Decimal? // Tổng giá trị thuế
  tgtttbchu String? // Tổng giá trị thanh toán bằng chữ
  tgtttbso  Decimal? // Tổng giá trị thanh toán bằng số

  // Status and Processing
  thdon      String? // Trạng thái hóa đơn
  thlap      String? // Thời điểm lập
  thttlphi   Decimal? // Thành tiền lệ phí
  tlhdon     String? // Loại hóa đơn
  ttcktmai   String? // Trạng thái chấp nhận mã
  tthai      String? // Trạng thái
  tttbao     String? // Trạng thái thông báo
  ttxly      String? // Trạng thái xử lý
  tvandnkntt String? // Thông tin vận đơn kiện nhận thông tin

  // Additional Fields
  mhso      String? // Mã hiệu số
  ladhddt   Boolean? // Là hóa đơn điện tử
  mkhang    String? // Mã khách hàng
  nbsdthoai String? // Số điện thoại người bán
  nbdctdtu  String? // Địa chỉ thư điện tử người bán
  nbfax     String? // Fax người bán
  nbwebsite String? // Website người bán
  nmsdthoai String? // Số điện thoại người mua
  nmdctdtu  String? // Địa chỉ thư điện tử người mua
  nmcmnd    String? // CMND người mua
  nmcks     String? // Chữ ký số người mua

  // Legal and Compliance
  bhphap        String? // Bảo hộ pháp lý
  hddunlap      String? // Hóa đơn dự án lập
  gchdgoc       String? // Ghi chú hóa đơn gốc
  tbhgtngay     DateTime? // Thông báo hạn giao thời gian
  bhpldo        String? // Bảo hộ pháp lý do
  bhpcbo        String? // Bảo hộ pháp lý cơ bộ
  bhpngay       DateTime? // Bảo hộ pháp lý ngày
  tdlhdgoc      DateTime? // Thời điểm lập hóa đơn gốc
  tgtphi        Decimal? // Tổng giá trị phí
  unhiem        String? // Ủy nhiệm
  mstdvnunlhdon String? // Mã số thuế đơn vị ủy nhiệm lập hóa đơn
  tdvnunlhdon   String? // Tên đơn vị ủy nhiệm lập hóa đơn

  // Regulatory Information
  nbmdvqhnsach String? // Người bán mã đơn vị quản hành sách
  nbsqdinh     String? // Người bán số quy định
  nbncqdinh    String? // Người bán ngày có quy định
  nbcqcqdinh   String? // Người bán cơ quan có quy định
  nbhtban      String? // Người bán hình thức bán
  nmmdvqhnsach String? // Người mua mã đơn vị quản hành sách
  nmddvchden   String? // Người mua địa điểm vận chuyển đến
  nmtgvchdtu   DateTime? // Người mua thời gian vận chuyển đầu
  nmtgvchdden  DateTime? // Người mua thời gian vận chuyển đến
  nbtnban      String? // Người bán tên nhân bán
  dcdvnunlhdon String? // Địa chỉ đơn vị ủy nhiệm lập hóa đơn

  // Processing Dates
  dksbke    DateTime? // Đăng ký sổ bán kê
  dknlbke   DateTime? // Đăng ký nhật lý bán kê
  thtttoan  String? // Trạng thái thanh toán
  msttcgp   String? // Mã số thuế TCGp
  gchu      String? // Ghi chú
  kqcht     String? // Kết quả chuyển hóa
  hdntgia   Decimal? // Hóa đơn nội tệ giá
  tgtkcthue Decimal? // Tổng giá trị không chính thuế
  tgtkhac   Decimal? // Tổng giá trị khác

  // Reference Information
  nmshchieu   String? // Người mua số hóa chiếu
  nmnchchieu  String? // Người mua ngân chứng chiếu
  nmnhhhchieu String? // Người mua nhà hàng hóa chiếu
  nmqtich     String? // Người mua quốc tịch
  ktkhthue    Decimal? // Kết toán khấu trừ thuế
  nmstttoan   String? // Người mua số tài khoản thanh toán
  nmttttoan   String? // Người mua thông tin thanh toán
  hdhhdvu     String? // Hóa đơn hàng hóa dịch vụ
  qrcode      String? // QR Code
  ttmstten    String? // Thông tin mã số tên
  ladhddtten  String? // Là hóa đơn điện tử tên

  // Export/Import
  hdxkhau     String? // Hóa đơn xuất khẩu
  hdxkptquan  String? // Hóa đơn xuất khẩu phương tiện quân
  hdgktkhthue Decimal? // Hóa đơn giá kê khai thuế
  hdonLquans  String? // Hóa đơn liên quan
  tthdclquan  String? // Thông tin hóa đơn chính liên quan
  pdndungs    String? // Phần dùng đúng số
  hdtbssrses  String? // Hóa đơn thông báo số sáng rộng ses

  // Duplicate Handling
  hdTrung    String? // Hóa đơn trùng
  isHDTrung  Boolean? // Có phải hóa đơn trùng
  hdcttchinh String? // Hóa đơn chính thức chính

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relationships
  details ext_detailhoadon[]

  @@unique([nbmst, khmshdon, shdon, khhdon])
  // Indexes for performance
  @@index([nbmst])
  @@index([khmshdon, shdon])
  @@index([tdlap])
  @@index([nmmst])
  @@index([tthai])
  @@index([createdAt])
}

model ext_detailhoadon {
  id String @id @default(uuid())

  // Reference to parent invoice
  idServer     String?  @unique // Basic Invoice Info
  idhdonServer String // Foreign key to ext_listhoadon.id
  // Item Information
  dgia         Decimal? // Đơn giá
  dvtinh       String? // Đơn vị tính
  ltsuat       Decimal? // Lũy tiến suất
  sluong       Decimal? // Số lượng
  stbchu       String? // Số thứ bằng chữ
  stckhau      Decimal? // Số tiền chiết khấu
  stt          Int? // Số thứ tự
  tchat        String? // Tính chất
  ten          String? // Tên hàng hóa/dịch vụ
  thtcthue     Decimal? // Thành tiền chưa thuế
  thtien       Decimal? // Thành tiền
  tlckhau      Decimal? // Tỷ lệ chiết khấu
  tsuat        Decimal? // Thuế suất
  tthue        Decimal? // Tiền thuế
  sxep         Int? // Sắp xếp
  dvtte        String? // Đơn vị tiền tệ
  tgia         Decimal? // Tiền gia
  tthhdtrung   String? // Thông tin hàng hóa trùng

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relationships
  invoice ext_listhoadon @relation(fields: [idhdonServer], references: [idServer], onDelete: Cascade)

  // Indexes
  @@index([idhdonServer])
  @@index([stt])
  @@index([createdAt])
}




nbmst	khmshdon	khhdon	shdon	cqt	nbdchi	nbten	nmdchi	nmmst	nmten	nmtnmua	tgtcthue	tgtthue	tgtttbso	tgtttbchu	thlap	ttcktmai	tthai	tttbao	ttxly