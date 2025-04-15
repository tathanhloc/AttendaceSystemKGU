export interface DiemDanh {
  id: number
  maLich: string
  maSV: string
  ngayDiemDanh: string
  trangThai: "Có mặt" | "Vắng" | "Trễ"
  thoiGianVao?: string
  thoiGianRa?: string
}

export const diemDanhData: DiemDanh[] = [
  {
    id: 1,
    maLich: "COMP101-01-2023-1-T2",
    maSV: "SV001",
    ngayDiemDanh: "2023-09-04",
    trangThai: "Có mặt",
    thoiGianVao: "07:30:00",
    thoiGianRa: "10:00:00",
  },
  {
    id: 2,
    maLich: "COMP101-01-2023-1-T2",
    maSV: "SV002",
    ngayDiemDanh: "2023-09-04",
    trangThai: "Có mặt",
    thoiGianVao: "07:35:00",
    thoiGianRa: "10:00:00",
  },
  {
    id: 3,
    maLich: "COMP101-01-2023-1-T2",
    maSV: "SV003",
    ngayDiemDanh: "2023-09-04",
    trangThai: "Trễ",
    thoiGianVao: "08:15:00",
    thoiGianRa: "10:00:00",
  },
  {
    id: 4,
    maLich: "COMP101-01-2023-1-T2",
    maSV: "SV004",
    ngayDiemDanh: "2023-09-04",
    trangThai: "Vắng",
  },
  {
    id: 5,
    maLich: "COMP101-01-2023-1-T5",
    maSV: "SV001",
    ngayDiemDanh: "2023-09-07",
    trangThai: "Có mặt",
    thoiGianVao: "07:25:00",
    thoiGianRa: "10:00:00",
  },
  {
    id: 6,
    maLich: "COMP101-01-2023-1-T5",
    maSV: "SV002",
    ngayDiemDanh: "2023-09-07",
    trangThai: "Có mặt",
    thoiGianVao: "07:30:00",
    thoiGianRa: "10:00:00",
  },
  {
    id: 7,
    maLich: "COMP101-01-2023-1-T5",
    maSV: "SV003",
    ngayDiemDanh: "2023-09-07",
    trangThai: "Có mặt",
    thoiGianVao: "07:40:00",
    thoiGianRa: "10:00:00",
  },
  {
    id: 8,
    maLich: "COMP101-01-2023-1-T5",
    maSV: "SV004",
    ngayDiemDanh: "2023-09-07",
    trangThai: "Có mặt",
    thoiGianVao: "07:45:00",
    thoiGianRa: "10:00:00",
  },
  {
    id: 9,
    maLich: "COMP102-01-2023-1-T2",
    maSV: "SV005",
    ngayDiemDanh: "2023-09-04",
    trangThai: "Có mặt",
    thoiGianVao: "10:25:00",
    thoiGianRa: "12:45:00",
  },
  {
    id: 10,
    maLich: "COMP102-01-2023-1-T2",
    maSV: "SV006",
    ngayDiemDanh: "2023-09-04",
    trangThai: "Có mặt",
    thoiGianVao: "10:30:00",
    thoiGianRa: "12:45:00",
  },
]
