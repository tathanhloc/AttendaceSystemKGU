export interface Khoa {
  maKhoa: string
  tenKhoa: string
  isActive: boolean
}

export const khoaData: Khoa[] = [
  {
    maKhoa: "CNTT",
    tenKhoa: "Công Nghệ Thông Tin",
    isActive: true,
  },
  {
    maKhoa: "KTMT",
    tenKhoa: "Kỹ Thuật Máy Tính",
    isActive: true,
  },
  {
    maKhoa: "DTVT",
    tenKhoa: "Điện Tử Viễn Thông",
    isActive: true,
  },
  {
    maKhoa: "QTKD",
    tenKhoa: "Quản Trị Kinh Doanh",
    isActive: true,
  },
  {
    maKhoa: "KTPM",
    tenKhoa: "Kỹ Thuật Phần Mềm",
    isActive: true,
  },
  {
    maKhoa: "HTTT",
    tenKhoa: "Hệ Thống Thông Tin",
    isActive: true,
  },
  {
    maKhoa: "KHMT",
    tenKhoa: "Khoa Học Máy Tính",
    isActive: true,
  },
  {
    maKhoa: "MMT",
    tenKhoa: "Mạng Máy Tính",
    isActive: false,
  },
]
