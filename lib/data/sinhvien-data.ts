export interface SinhVien {
  maSV: string
  hoTen: string
  gioiTinh: "Nam" | "Nữ"
  ngaySinh: string
  maLop: string
  hinhAnh?: string
  embedding?: string
  isActive: boolean
  email: string
}

export const sinhVienData: SinhVien[] = [
  {
    maSV: "SV001",
    hoTen: "Nguyễn Văn An",
    gioiTinh: "Nam",
    ngaySinh: "2002-05-15",
    maLop: "CNTT2020",
    isActive: true,
    email: "nguyenvanan@example.com",
  },
  {
    maSV: "SV002",
    hoTen: "Trần Thị Bình",
    gioiTinh: "Nữ",
    ngaySinh: "2002-08-20",
    maLop: "CNTT2020",
    isActive: true,
    email: "tranthib@example.com",
  },
  {
    maSV: "SV003",
    hoTen: "Lê Văn Cường",
    gioiTinh: "Nam",
    ngaySinh: "2002-03-10",
    maLop: "CNTT2020",
    isActive: true,
    email: "levanc@example.com",
  },
  {
    maSV: "SV004",
    hoTen: "Phạm Thị Dung",
    gioiTinh: "Nữ",
    ngaySinh: "2002-11-25",
    maLop: "KTPM2020",
    isActive: true,
    email: "phamthid@example.com",
  },
  {
    maSV: "SV005",
    hoTen: "Hoàng Văn Em",
    gioiTinh: "Nam",
    ngaySinh: "2002-07-05",
    maLop: "KTPM2020",
    isActive: true,
    email: "hoangvane@example.com",
  },
  {
    maSV: "SV006",
    hoTen: "Ngô Thị Phương",
    gioiTinh: "Nữ",
    ngaySinh: "2002-09-18",
    maLop: "KTPM2020",
    isActive: true,
    email: "ngothip@example.com",
  },
  {
    maSV: "SV007",
    hoTen: "Đỗ Văn Giang",
    gioiTinh: "Nam",
    ngaySinh: "2002-01-30",
    maLop: "HTTT2020",
    isActive: true,
    email: "dovang@example.com",
  },
  {
    maSV: "SV008",
    hoTen: "Vũ Thị Hoa",
    gioiTinh: "Nữ",
    ngaySinh: "2002-04-12",
    maLop: "HTTT2020",
    isActive: true,
    email: "vuthih@example.com",
  },
  {
    maSV: "SV009",
    hoTen: "Bùi Văn Ích",
    gioiTinh: "Nam",
    ngaySinh: "2002-06-22",
    maLop: "HTTT2020",
    isActive: true,
    email: "buivani@example.com",
  },
  {
    maSV: "SV010",
    hoTen: "Lý Thị Kim",
    gioiTinh: "Nữ",
    ngaySinh: "2002-12-08",
    maLop: "CNTT2021",
    isActive: true,
    email: "lythik@example.com",
  },
  {
    maSV: "SV011",
    hoTen: "Trương Văn Lâm",
    gioiTinh: "Nam",
    ngaySinh: "2003-02-14",
    maLop: "CNTT2021",
    isActive: true,
    email: "truongvanl@example.com",
  },
  {
    maSV: "SV012",
    hoTen: "Mai Thị Nga",
    gioiTinh: "Nữ",
    ngaySinh: "2003-05-27",
    maLop: "CNTT2021",
    isActive: true,
    email: "maithin@example.com",
  },
  {
    maSV: "SV013",
    hoTen: "Phan Văn Oanh",
    gioiTinh: "Nam",
    ngaySinh: "2003-08-03",
    maLop: "KTPM2021",
    isActive: true,
    email: "phanvano@example.com",
  },
  {
    maSV: "SV014",
    hoTen: "Quách Thị Phương",
    gioiTinh: "Nữ",
    ngaySinh: "2003-10-19",
    maLop: "KTPM2021",
    isActive: true,
    email: "quachthip@example.com",
  },
  {
    maSV: "SV015",
    hoTen: "Đặng Văn Quang",
    gioiTinh: "Nam",
    ngaySinh: "2003-01-07",
    maLop: "KTPM2021",
    isActive: false,
    email: "dangvanq@example.com",
  },
]
