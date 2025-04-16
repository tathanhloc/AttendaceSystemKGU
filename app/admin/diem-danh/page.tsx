"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon, Check, Clock, Download, MoreHorizontal, Pencil, Search, UserCheck, UserX, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { AppShell } from "@/components/app-shell"
import { navigation } from "../dashboard/page"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

// Import dữ liệu từ các file đã cung cấp
import { diemDanhData, type DiemDanh } from "@/lib/data/diemdanh-data"
import { lichHocData, type LichHoc } from "@/lib/data/lichhoc-data"
import { lopHocPhanData, type LopHocPhan } from "@/lib/data/lophocphan-data"
import { monHocData } from "@/lib/data/monhoc-data"
import { phongHocData } from "@/lib/data/phonghoc-data"
import { sinhVienData, type SinhVien } from "@/lib/data/sinhvien-data"
import { lhpSinhVienData } from "@/lib/data/lhp-sinhvien-data"
import { hocKyData } from "@/lib/data/hocky-data"
import { namHocData } from "@/lib/data/namhoc-data"
import { hocKyNamHocData } from "@/lib/data/hocky-namhoc-data"
import { giangVienData } from "@/lib/data/giangvien-data"

// Định nghĩa các kiểu dữ liệu bổ sung
type DiemDanhExtended = DiemDanh & {
  tenSV: string
  maLop: string
  tenMonHoc: string
  tenPhong: string
  thu: number
  tietBatDau: number
  soTiet: number
}

type LopHocPhanExtended = LopHocPhan & {
  tenMonHoc: string
  tenGV: string
  hocKy: string
  namHoc: string
}

type LichHocExtended = LichHoc & {
  tenMonHoc: string
  tenPhong: string
  maLHP: string
  nhom: number
}

type DiemDanhSinhVien = {
  maSV: string
  tenSV: string
  maLop: string
  trangThai: "Có mặt" | "Vắng" | "Trễ" | "Chưa điểm danh"
  thoiGianVao?: string
  thoiGianRa?: string
  ghiChu?: string
}

// Custom DatePicker component để tránh lỗi tự động hiển thị
function CustomDatePicker({ date, setDate }: { date?: Date; setDate: (date: Date | undefined) => void }) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy", { locale: vi }) : <span>Chọn ngày</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate)
            setOpen(false)
          }}
          initialFocus
          locale={vi}
        />
      </PopoverContent>
    </Popover>
  )
}

export default function DiemDanhPage() {
  const { toast } = useToast()

  // State cho việc lọc và hiển thị
  const [selectedHocKy, setSelectedHocKy] = useState<string>("")
  const [selectedNamHoc, setSelectedNamHoc] = useState<string>("")
  const [selectedLopHP, setSelectedLopHP] = useState<string>("")
  const [selectedNhom, setSelectedNhom] = useState<number | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [searchQuery, setSearchQuery] = useState("")
  const [view, setView] = useState<"lopHocPhan" | "lichHoc" | "diemDanh">("lopHocPhan")

  // State cho dialog
  const [isManualAttendanceDialogOpen, setIsManualAttendanceDialogOpen] = useState(false)
  const [isEditAttendanceDialogOpen, setIsEditAttendanceDialogOpen] = useState(false)
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false)
  const [selectedDiemDanh, setSelectedDiemDanh] = useState<DiemDanhExtended | null>(null)

  // State cho dữ liệu
  const [diemDanhList, setDiemDanhList] = useState<DiemDanhExtended[]>([])
  const [manualAttendanceList, setManualAttendanceList] = useState<DiemDanhSinhVien[]>([])
  const [editAttendanceForm, setEditAttendanceForm] = useState<{
    trangThai: "Có mặt" | "Vắng" | "Trễ"
    thoiGianVao: string
    thoiGianRa: string
    ghiChu: string
  }>({
    trangThai: "Có mặt",
    thoiGianVao: "",
    thoiGianRa: "",
    ghiChu: "",
  })

  // Danh sách học kỳ và năm học
  const hocKyNamHocList = useMemo(() => {
    const result: { value: string; label: string }[] = []

    hocKyNamHocData.forEach((hknm) => {
      const hk = hocKyData.find((h) => h.maHocKy === hknm.maHocKy)
      const nh = namHocData.find((n) => n.maNamHoc === hknm.maNamHoc)

      if (hk && nh) {
        result.push({
          value: `${hknm.maHocKy}-${hknm.maNamHoc}`,
          label: `${hk.tenHocKy} (${nh.maNamHoc})`,
        })
      }
    })

    return result
  }, [])

  // Khởi tạo giá trị mặc định cho học kỳ và năm học
  useEffect(() => {
    if (hocKyNamHocList.length > 0 && !selectedHocKy) {
      const defaultValue = hocKyNamHocList[0].value
      setSelectedHocKy(defaultValue)

      const parts = defaultValue.split("-")
      if (parts.length > 1) {
        const namHoc = parts.slice(1).join("-")
        setSelectedNamHoc(namHoc)
      }
    }
  }, [hocKyNamHocList, selectedHocKy])

  // Danh sách lớp học phần theo học kỳ và năm học
  const filteredLopHocPhan = useMemo(() => {
    if (!selectedHocKy) return []

    const [hocKy, ...namHocParts] = selectedHocKy.split("-")
    const namHoc = namHocParts.join("-")

    return lopHocPhanData
      .filter((lhp) => lhp.hocKy === hocKy && lhp.namHoc === namHoc)
      .map((lhp) => {
        const monHoc = monHocData.find((mh) => mh.maMH === lhp.maMH)
        const giangVien = giangVienData.find((gv) => gv.maGV === lhp.maGV)

        return {
          ...lhp,
          tenMonHoc: monHoc?.tenMH || "Không xác định",
          tenGV: giangVien?.hoTen || "Không xác định",
          hocKy,
          namHoc,
        }
      })
  }, [selectedHocKy])

  // Danh sách nhóm của lớp học phần đã chọn
  const nhomList = useMemo(() => {
    if (!selectedLopHP) return []

    const lopHP = filteredLopHocPhan.find((lhp) => lhp.maLHP === selectedLopHP)
    if (!lopHP) return []

    return [{ value: lopHP.nhom, label: `Nhóm ${lopHP.nhom}` }]
  }, [selectedLopHP, filteredLopHocPhan])

  // Danh sách lịch học của lớp học phần và nhóm đã chọn
  const filteredLichHoc = useMemo(() => {
    if (!selectedLopHP) return []

    return lichHocData
      .filter((lh) => lh.maLHP === selectedLopHP && lh.isActive)
      .map((lh) => {
        const lopHP = lopHocPhanData.find((l) => l.maLHP === lh.maLHP)
        const monHoc = lopHP ? monHocData.find((mh) => mh.maMH === lopHP.maMH) : null
        const phongHoc = phongHocData.find((ph) => ph.maPhong === lh.maPhong)

        return {
          ...lh,
          tenMonHoc: monHoc?.tenMH || "Không xác định",
          tenPhong: phongHoc?.tenPhong || "Không xác định",
          maLHP: lh.maLHP,
          nhom: lopHP?.nhom || 0,
        }
      })
  }, [selectedLopHP])

  // Danh sách sinh viên của lớp học phần đã chọn
  const sinhVienTrongLop = useMemo(() => {
    if (!selectedLopHP) return []

    return lhpSinhVienData
      .filter((lsv) => lsv.maLHP === selectedLopHP && lsv.isActive)
      .map((lsv) => {
        const sv = sinhVienData.find((s) => s.maSV === lsv.maSV)
        return sv || null
      })
      .filter((sv): sv is SinhVien => sv !== null)
  }, [selectedLopHP])

  // Khởi tạo danh sách điểm danh khi component được tạo
  useEffect(() => {
    // Kết hợp dữ liệu từ các bảng để tạo danh sách điểm danh mở rộng
    const extendedDiemDanh: DiemDanhExtended[] = diemDanhData.map((dd) => {
      const lichHoc = lichHocData.find((lh) => lh.maLich === dd.maLich)
      const lopHP = lichHoc ? lopHocPhanData.find((lhp) => lhp.maLHP === lichHoc.maLHP) : null
      const monHoc = lopHP ? monHocData.find((mh) => mh.maMH === lopHP.maMH) : null
      const phongHoc = lichHoc ? phongHocData.find((ph) => ph.maPhong === lichHoc.maPhong) : null
      const sinhVien = sinhVienData.find((sv) => sv.maSV === dd.maSV)

      return {
        ...dd,
        tenSV: sinhVien?.hoTen || "Không xác định",
        maLop: sinhVien?.maLop || "Không xác định",
        tenMonHoc: monHoc?.tenMH || "Không xác định",
        tenPhong: phongHoc?.tenPhong || "Không xác định",
        thu: lichHoc?.thu || 0,
        tietBatDau: lichHoc?.tietBatDau || 0,
        soTiet: lichHoc?.soTiet || 0,
      }
    })

    setDiemDanhList(extendedDiemDanh)
  }, [])

  // Lọc điểm danh theo lớp học phần, nhóm và ngày
  const filteredDiemDanh = useMemo(() => {
    if (!selectedLopHP || !selectedDate) return []

    const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""

    return diemDanhList.filter((dd) => {
      const lichHoc = lichHocData.find((lh) => lh.maLich === dd.maLich)
      if (!lichHoc) return false

      const lopHPMatch = lichHoc.maLHP === selectedLopHP
      const dateMatch = selectedDate ? dd.ngayDiemDanh === dateStr : true

      // Lọc theo tìm kiếm nếu có
      const searchMatch = searchQuery
        ? dd.tenSV.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dd.maSV.toLowerCase().includes(searchQuery.toLowerCase())
        : true

      return lopHPMatch && dateMatch && searchMatch
    })
  }, [diemDanhList, selectedLopHP, selectedDate, searchQuery])

  // Thống kê điểm danh
  const diemDanhStats = useMemo(() => {
    if (!selectedLopHP || !selectedDate) {
      return {
        total: 0,
        present: 0,
        absent: 0,
        late: 0,
        notMarked: 0,
        presentRate: 0,
      }
    }

    const dateStr = format(selectedDate, "yyyy-MM-dd")

    // Lấy tất cả sinh viên trong lớp
    const allStudents = sinhVienTrongLop.length

    // Lấy điểm danh của ngày đã chọn
    const attendanceForDate = diemDanhList.filter((dd) => {
      const lichHoc = lichHocData.find((lh) => lh.maLich === dd.maLich)
      return lichHoc?.maLHP === selectedLopHP && dd.ngayDiemDanh === dateStr
    })

    const present = attendanceForDate.filter((dd) => dd.trangThai === "Có mặt").length
    const absent = attendanceForDate.filter((dd) => dd.trangThai === "Vắng").length
    const late = attendanceForDate.filter((dd) => dd.trangThai === "Trễ").length
    const notMarked = allStudents - present - absent - late

    return {
      total: allStudents,
      present,
      absent,
      late,
      notMarked,
      presentRate: allStudents > 0 ? Math.round(((present + late) / allStudents) * 100) : 0,
    }
  }, [diemDanhList, selectedLopHP, selectedDate, sinhVienTrongLop.length])

  // Xử lý khi chọn lớp học phần
  const handleSelectLopHP = useCallback(
    (maLHP: string) => {
      setSelectedLopHP(maLHP)

      const lopHP = filteredLopHocPhan.find((lhp) => lhp.maLHP === maLHP)
      if (lopHP) {
        setSelectedNhom(lopHP.nhom)
      }

      setView("lichHoc")
    },
    [filteredLopHocPhan],
  )

  // Xử lý khi chọn lịch học để điểm danh
  const handleSelectLichHoc = useCallback((maLich: string) => {
    setView("diemDanh")
  }, [])

  // Xử lý quay lại danh sách lớp học phần
  const handleBackToLopHP = useCallback(() => {
    setSelectedLopHP("")
    setSelectedNhom(null)
    setView("lopHocPhan")
  }, [])

  // Xử lý quay lại danh sách lịch học
  const handleBackToLichHoc = useCallback(() => {
    setView("lichHoc")
  }, [])

  // Xử lý mở dialog điểm danh thủ công
  const handleOpenManualAttendance = useCallback(() => {
    if (!selectedLopHP) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng chọn lớp học phần trước khi điểm danh.",
      })
      return
    }

    if (!selectedDate) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng chọn ngày điểm danh.",
      })
      return
    }

    // Tạo danh sách sinh viên để điểm danh thủ công
    const manualList: DiemDanhSinhVien[] = sinhVienTrongLop.map((sv) => {
      // Kiểm tra xem sinh viên đã được điểm danh chưa
      const existingAttendance = filteredDiemDanh.find((dd) => dd.maSV === sv.maSV)

      return {
        maSV: sv.maSV,
        tenSV: sv.hoTen,
        maLop: sv.maLop,
        trangThai: existingAttendance ? existingAttendance.trangThai : "Chưa điểm danh",
        thoiGianVao: existingAttendance?.thoiGianVao,
        thoiGianRa: existingAttendance?.thoiGianRa,
      }
    })

    setManualAttendanceList(manualList)
    setIsManualAttendanceDialogOpen(true)
  }, [selectedLopHP, selectedDate, sinhVienTrongLop, filteredDiemDanh, toast])

  // Xử lý mở dialog chỉnh sửa điểm danh
  const handleEditAttendance = useCallback((diemDanh: DiemDanhExtended) => {
    setSelectedDiemDanh(diemDanh)
    setEditAttendanceForm({
      trangThai: diemDanh.trangThai,
      thoiGianVao: diemDanh.thoiGianVao || "",
      thoiGianRa: diemDanh.thoiGianRa || "",
      ghiChu: "",
    })
    setIsEditAttendanceDialogOpen(true)
  }, [])

  // Xử lý lưu điểm danh thủ công
  const handleSaveManualAttendance = useCallback(() => {
    if (!selectedLopHP || !selectedDate) return

    const dateStr = format(selectedDate, "yyyy-MM-dd")
    const currentTime = format(new Date(), "HH:mm:ss")

    // Lấy mã lịch học
    const lichHoc = lichHocData.find((lh) => lh.maLHP === selectedLopHP)
    if (!lichHoc) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không tìm thấy lịch học cho lớp học phần này.",
      })
      return
    }

    // Cập nhật hoặc thêm mới điểm danh
    const updatedDiemDanhList = [...diemDanhList]

    manualAttendanceList.forEach((attendance) => {
      if (attendance.trangThai === "Chưa điểm danh") return

      // Tìm điểm danh hiện có
      const existingIndex = updatedDiemDanhList.findIndex(
        (dd) => dd.maSV === attendance.maSV && dd.ngayDiemDanh === dateStr && dd.maLich === lichHoc.maLich,
      )

      if (existingIndex >= 0) {
        // Cập nhật điểm danh hiện có
        updatedDiemDanhList[existingIndex] = {
          ...updatedDiemDanhList[existingIndex],
          trangThai: attendance.trangThai,
          thoiGianVao: attendance.trangThai !== "Vắng" ? attendance.thoiGianVao || currentTime : undefined,
          thoiGianRa: attendance.trangThai !== "Vắng" ? attendance.thoiGianRa || currentTime : undefined,
        }
      } else {
        // Thêm điểm danh mới
        const newDiemDanh: DiemDanhExtended = {
          id: Date.now() + Math.random(),
          maLich: lichHoc.maLich,
          maSV: attendance.maSV,
          ngayDiemDanh: dateStr,
          trangThai: attendance.trangThai,
          thoiGianVao: attendance.trangThai !== "Vắng" ? attendance.thoiGianVao || currentTime : undefined,
          thoiGianRa: attendance.trangThai !== "Vắng" ? attendance.thoiGianRa || currentTime : undefined,
          tenSV: attendance.tenSV,
          maLop: attendance.maLop,
          tenMonHoc: filteredLopHocPhan.find((lhp) => lhp.maLHP === selectedLopHP)?.tenMonHoc || "Không xác định",
          tenPhong: lichHoc
            ? phongHocData.find((ph) => ph.maPhong === lichHoc.maPhong)?.tenPhong || "Không xác định"
            : "Không xác định",
          thu: lichHoc.thu,
          tietBatDau: lichHoc.tietBatDau,
          soTiet: lichHoc.soTiet,
        }

        updatedDiemDanhList.push(newDiemDanh)
      }
    })

    setDiemDanhList(updatedDiemDanhList)
    setIsManualAttendanceDialogOpen(false)

    toast({
      title: "Điểm danh thành công",
      description: "Đã cập nhật điểm danh cho sinh viên.",
    })
  }, [selectedLopHP, selectedDate, manualAttendanceList, diemDanhList, lichHocData, filteredLopHocPhan, toast])

  // Xử lý lưu chỉnh sửa điểm danh
  const handleSaveEditAttendance = useCallback(() => {
    if (!selectedDiemDanh) return

    setDiemDanhList((prev) =>
      prev.map((dd) =>
        dd.id === selectedDiemDanh.id
          ? {
              ...dd,
              trangThai: editAttendanceForm.trangThai,
              thoiGianVao: editAttendanceForm.trangThai !== "Vắng" ? editAttendanceForm.thoiGianVao : undefined,
              thoiGianRa: editAttendanceForm.trangThai !== "Vắng" ? editAttendanceForm.thoiGianRa : undefined,
            }
          : dd,
      ),
    )

    setIsEditAttendanceDialogOpen(false)

    toast({
      title: "Cập nhật điểm danh thành công",
      description: `Đã cập nhật điểm danh cho sinh viên ${selectedDiemDanh.tenSV}.`,
    })
  }, [selectedDiemDanh, editAttendanceForm, toast])

  // Xử lý xuất báo cáo điểm danh
  const handleExportAttendance = useCallback(() => {
    toast({
      title: "Xuất báo cáo thành công",
      description: "Đã xuất báo cáo điểm danh.",
    })
    setIsExportDialogOpen(false)
  }, [toast])

  // Xử lý thay đổi trạng thái điểm danh trong danh sách điểm danh thủ công
  const handleChangeAttendanceStatus = useCallback(
    (maSV: string, trangThai: "Có mặt" | "Vắng" | "Trễ" | "Chưa điểm danh") => {
      setManualAttendanceList((prev) =>
        prev.map((item) =>
          item.maSV === maSV
            ? {
                ...item,
                trangThai,
                thoiGianVao:
                  trangThai !== "Vắng" && trangThai !== "Chưa điểm danh" ? format(new Date(), "HH:mm:ss") : undefined,
                thoiGianRa:
                  trangThai !== "Vắng" && trangThai !== "Chưa điểm danh" ? format(new Date(), "HH:mm:ss") : undefined,
              }
            : item,
        ),
      )
    },
    [],
  )

  // Lấy thông tin lớp học phần đã chọn
  const selectedLopHPInfo = useMemo(() => {
    if (!selectedLopHP) return null
    return filteredLopHocPhan.find((lhp) => lhp.maLHP === selectedLopHP)
  }, [selectedLopHP, filteredLopHocPhan])

  // Chuyển đổi thứ từ số sang chữ
  const getThuText = useCallback((thu: number) => {
    switch (thu) {
      case 2:
        return "Thứ hai"
      case 3:
        return "Thứ ba"
      case 4:
        return "Thứ tư"
      case 5:
        return "Thứ năm"
      case 6:
        return "Thứ sáu"
      case 7:
        return "Thứ bảy"
      case 8:
        return "Chủ nhật"
      default:
        return `Thứ ${thu}`
    }
  }, [])

  return (
    <AppShell navigation={navigation}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Quản lý điểm danh</h1>
          <p className="text-muted-foreground">Quản lý điểm danh theo lớp học phần và nhóm</p>
        </div>

        {/* Thống kê */}
        <div className="grid gap-4 md:grid-cols-4">
          {view === "diemDanh" ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng số sinh viên</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{diemDanhStats.total}</div>
                  <p className="text-xs text-muted-foreground">Trong lớp học phần</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Có mặt</CardTitle>
                  <UserCheck className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{diemDanhStats.present}</div>
                  <p className="text-xs text-muted-foreground">
                    {diemDanhStats.total > 0
                      ? `${Math.round((diemDanhStats.present / diemDanhStats.total) * 100)}% lớp học`
                      : "0% lớp học"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Vắng mặt</CardTitle>
                  <UserX className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{diemDanhStats.absent}</div>
                  <p className="text-xs text-muted-foreground">
                    {diemDanhStats.total > 0
                      ? `${Math.round((diemDanhStats.absent / diemDanhStats.total) * 100)}% lớp học`
                      : "0% lớp học"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tỷ lệ điểm danh</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{diemDanhStats.presentRate}%</div>
                  <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${diemDanhStats.presentRate}%` }} />
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lớp học phần</CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{filteredLopHocPhan.length}</div>
                  <p className="text-xs text-muted-foreground">Học kỳ hiện tại</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lịch học</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {lichHocData.filter((lh) => filteredLopHocPhan.some((lhp) => lhp.maLHP === lh.maLHP)).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Học kỳ hiện tại</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Sinh viên</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sinhVienData.length}</div>
                  <p className="text-xs text-muted-foreground">Tổng số sinh viên</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Điểm danh hôm nay</CardTitle>
                  <UserCheck className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {diemDanhList.filter((dd) => dd.ngayDiemDanh === format(new Date(), "yyyy-MM-dd")).length}
                  </div>
                  <p className="text-xs text-muted-foreground">Số lượt điểm danh</p>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {/* Bộ lọc và nút thao tác */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="w-full sm:w-[240px]">
                <Select value={selectedHocKy} onValueChange={setSelectedHocKy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn học kỳ" />
                  </SelectTrigger>
                  <SelectContent>
                    {hocKyNamHocList.map((hk) => (
                      <SelectItem key={hk.value} value={hk.value}>
                        {hk.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {view === "diemDanh" && (
                <>
                  <div className="w-full sm:w-[180px]">
                    <CustomDatePicker date={selectedDate} setDate={setSelectedDate} />
                  </div>
                  <div className="w-full sm:w-[240px]">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="Tìm kiếm sinh viên..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>

            {view === "diemDanh" && (
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" size="sm" className="h-8 gap-1" onClick={() => setIsExportDialogOpen(true)}>
                  <Download className="h-4 w-4" />
                  Xuất báo cáo
                </Button>
                <Button
                  size="sm"
                  className="h-8 gap-1 bg-primary hover:bg-primary/90"
                  onClick={handleOpenManualAttendance}
                >
                  <UserCheck className="h-4 w-4" />
                  Điểm danh thủ công
                </Button>
              </div>
            )}
          </div>

          {/* Nội dung chính */}
          {view === "lopHocPhan" ? (
            // Danh sách lớp học phần
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã lớp học phần</TableHead>
                    <TableHead>Tên môn học</TableHead>
                    <TableHead>Nhóm</TableHead>
                    <TableHead>Giảng viên</TableHead>
                    <TableHead>Học kỳ</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLopHocPhan.length > 0 ? (
                    filteredLopHocPhan.map((lhp) => (
                      <TableRow key={lhp.maLHP}>
                        <TableCell>{lhp.maLHP}</TableCell>
                        <TableCell className="font-medium">{lhp.tenMonHoc}</TableCell>
                        <TableCell>{lhp.nhom}</TableCell>
                        <TableCell>{lhp.tenGV}</TableCell>
                        <TableCell>{`${lhp.hocKy} (${lhp.namHoc})`}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm" onClick={() => handleSelectLopHP(lhp.maLHP)}>
                            Xem lịch học
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        Không có lớp học phần nào trong học kỳ này.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          ) : view === "lichHoc" ? (
            // Danh sách lịch học
            <>
              {selectedLopHPInfo && (
                <div className="mb-4">
                  <Button variant="outline" size="sm" onClick={handleBackToLopHP}>
                    ← Quay lại danh sách lớp học phần
                  </Button>
                  <div className="mt-4">
                    <h2 className="text-xl font-bold">
                      {selectedLopHPInfo.tenMonHoc} - Nhóm {selectedLopHPInfo.nhom}
                    </h2>
                    <p className="text-muted-foreground">
                      Mã lớp: {selectedLopHPInfo.maLHP} | Giảng viên: {selectedLopHPInfo.tenGV}| Ngày:{" "}
                      {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Chưa chọn ngày"}
                    </p>
                  </div>
                </div>
              )}

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã lịch</TableHead>
                      <TableHead>Thứ</TableHead>
                      <TableHead>Tiết học</TableHead>
                      <TableHead>Phòng học</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLichHoc.length > 0 ? (
                      filteredLichHoc.map((lh) => (
                        <TableRow key={lh.maLich}>
                          <TableCell>{lh.maLich}</TableCell>
                          <TableCell>{getThuText(lh.thu)}</TableCell>
                          <TableCell>
                            Tiết {lh.tietBatDau} - {lh.tietBatDau + lh.soTiet - 1}
                          </TableCell>
                          <TableCell>{lh.tenPhong}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => handleSelectLichHoc(lh.maLich)}>
                              Xem điểm danh
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">
                          Không có lịch học nào cho lớp học phần này.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            // Danh sách điểm danh
            <>
              {selectedLopHPInfo && (
                <div className="mb-4">
                  <Button variant="outline" size="sm" onClick={handleBackToLichHoc}>
                    ← Quay lại danh sách lịch học
                  </Button>
                  <div className="mt-4">
                    <h2 className="text-xl font-bold">
                      {selectedLopHPInfo.tenMonHoc} - Nhóm {selectedLopHPInfo.nhom}
                    </h2>
                    <p className="text-muted-foreground">
                      Mã lớp: {selectedLopHPInfo.maLHP} | Giảng viên: {selectedLopHPInfo.tenGV} | Ngày:{" "}
                      {selectedDate ? format(selectedDate, "dd/MM/yyyy") : "Chưa chọn ngày"}
                    </p>
                  </div>
                </div>
              )}

              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">Tất cả</TabsTrigger>
                  <TabsTrigger value="present">Có mặt</TabsTrigger>
                  <TabsTrigger value="absent">Vắng mặt</TabsTrigger>
                  <TabsTrigger value="late">Đi trễ</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã SV</TableHead>
                      <TableHead>Họ tên</TableHead>
                      <TableHead>Lớp</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Thời gian vào</TableHead>
                      <TableHead>Thời gian ra</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDiemDanh.length > 0 ? (
                      filteredDiemDanh.map((dd) => (
                        <TableRow key={dd.id}>
                          <TableCell>{dd.maSV}</TableCell>
                          <TableCell className="font-medium">{dd.tenSV}</TableCell>
                          <TableCell>{dd.maLop}</TableCell>
                          <TableCell>
                            {dd.trangThai === "Có mặt" ? (
                              <Badge variant="outline" className="bg-green-100 text-green-800">
                                Có mặt
                              </Badge>
                            ) : dd.trangThai === "Vắng" ? (
                              <Badge variant="outline" className="bg-red-100 text-red-800">
                                Vắng mặt
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                Đi trễ
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>{dd.thoiGianVao || "N/A"}</TableCell>
                          <TableCell>{dd.thoiGianRa || "N/A"}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Mở menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleEditAttendance(dd)}>
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Chỉnh sửa điểm danh
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          {selectedDate
                            ? "Không có dữ liệu điểm danh cho ngày này."
                            : "Vui lòng chọn ngày để xem dữ liệu điểm danh."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Dialog điểm danh thủ công */}
      <Dialog open={isManualAttendanceDialogOpen} onOpenChange={setIsManualAttendanceDialogOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Điểm danh thủ công</DialogTitle>
            <DialogDescription>
              {selectedLopHPInfo &&
                `Điểm danh cho lớp ${selectedLopHPInfo.tenMonHoc} - Nhóm ${selectedLopHPInfo.nhom} ngày ${
                  selectedDate ? format(selectedDate, "dd/MM/yyyy") : "hôm nay"
                }`}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Tìm kiếm sinh viên..." className="pl-8" />
              </div>
            </div>

            <div className="max-h-[400px] overflow-y-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã SV</TableHead>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Lớp</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {manualAttendanceList.length > 0 ? (
                    manualAttendanceList.map((sv) => (
                      <TableRow key={sv.maSV}>
                        <TableCell>{sv.maSV}</TableCell>
                        <TableCell className="font-medium">{sv.tenSV}</TableCell>
                        <TableCell>{sv.maLop}</TableCell>
                        <TableCell>
                          {sv.trangThai === "Có mặt" ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              Có mặt
                            </Badge>
                          ) : sv.trangThai === "Vắng" ? (
                            <Badge variant="outline" className="bg-red-100 text-red-800">
                              Vắng mặt
                            </Badge>
                          ) : sv.trangThai === "Trễ" ? (
                            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                              Đi trễ
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-gray-100 text-gray-800">
                              Chưa điểm danh
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className={cn("h-8 w-8 p-0", sv.trangThai === "Có mặt" && "bg-green-100 text-green-800")}
                              onClick={() => handleChangeAttendanceStatus(sv.maSV, "Có mặt")}
                            >
                              <Check className="h-4 w-4" />
                              <span className="sr-only">Có mặt</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className={cn("h-8 w-8 p-0", sv.trangThai === "Vắng" && "bg-red-100 text-red-800")}
                              onClick={() => handleChangeAttendanceStatus(sv.maSV, "Vắng")}
                            >
                              <X className="h-4 w-4" />
                              <span className="sr-only">Vắng mặt</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className={cn("h-8 w-8 p-0", sv.trangThai === "Trễ" && "bg-yellow-100 text-yellow-800")}
                              onClick={() => handleChangeAttendanceStatus(sv.maSV, "Trễ")}
                            >
                              <Clock className="h-4 w-4" />
                              <span className="sr-only">Đi trễ</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        Không có sinh viên nào trong lớp học phần này.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsManualAttendanceDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveManualAttendance} className="bg-primary hover:bg-primary/90">
              Lưu điểm danh
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa điểm danh */}
      <Dialog open={isEditAttendanceDialogOpen} onOpenChange={setIsEditAttendanceDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa điểm danh</DialogTitle>
            <DialogDescription>
              {selectedDiemDanh && `Chỉnh sửa điểm danh cho sinh viên ${selectedDiemDanh.tenSV}`}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="trangThai" className="text-right">
                  Trạng thái
                </Label>
                <Select
                  value={editAttendanceForm.trangThai}
                  onValueChange={(value) => setEditAttendanceForm({ ...editAttendanceForm, trangThai: value as any })}
                >
                  <SelectTrigger id="trangThai" className="col-span-3">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Có mặt">Có mặt</SelectItem>
                    <SelectItem value="Vắng">Vắng mặt</SelectItem>
                    <SelectItem value="Trễ">Đi trễ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {editAttendanceForm.trangThai !== "Vắng" && (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="thoiGianVao" className="text-right">
                      Thời gian vào
                    </Label>
                    <Input
                      id="thoiGianVao"
                      type="time"
                      step="1"
                      value={editAttendanceForm.thoiGianVao}
                      onChange={(e) => setEditAttendanceForm({ ...editAttendanceForm, thoiGianVao: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="thoiGianRa" className="text-right">
                      Thời gian ra
                    </Label>
                    <Input
                      id="thoiGianRa"
                      type="time"
                      step="1"
                      value={editAttendanceForm.thoiGianRa}
                      onChange={(e) => setEditAttendanceForm({ ...editAttendanceForm, thoiGianRa: e.target.value })}
                      className="col-span-3"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="ghiChu" className="text-right">
                  Ghi chú
                </Label>
                <Input
                  id="ghiChu"
                  value={editAttendanceForm.ghiChu}
                  onChange={(e) => setEditAttendanceForm({ ...editAttendanceForm, ghiChu: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditAttendanceDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveEditAttendance} className="bg-primary hover:bg-primary/90">
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xuất báo cáo */}
      <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Xuất báo cáo điểm danh</DialogTitle>
            <DialogDescription>Chọn định dạng và phạm vi thời gian cho báo cáo điểm danh</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reportFormat" className="text-right">
                  Định dạng
                </Label>
                <Select defaultValue="excel">
                  <SelectTrigger id="reportFormat" className="col-span-3">
                    <SelectValue placeholder="Chọn định dạng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                    <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                    <SelectItem value="csv">CSV (.csv)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reportType" className="text-right">
                  Loại báo cáo
                </Label>
                <Select defaultValue="daily">
                  <SelectTrigger id="reportType" className="col-span-3">
                    <SelectValue placeholder="Chọn loại báo cáo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Báo cáo ngày</SelectItem>
                    <SelectItem value="weekly">Báo cáo tuần</SelectItem>
                    <SelectItem value="monthly">Báo cáo tháng</SelectItem>
                    <SelectItem value="custom">Tùy chỉnh</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="startDate" className="text-right">
                  Từ ngày
                </Label>
                <div className="col-span-3">
                  <CustomDatePicker date={selectedDate} setDate={setSelectedDate} />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="endDate" className="text-right">
                  Đến ngày
                </Label>
                <div className="col-span-3">
                  <CustomDatePicker date={selectedDate} setDate={setSelectedDate} />
                </div>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="includeDetails" className="text-right">
                  Tùy chọn
                </Label>
                <div className="col-span-3 space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="includeDetails" defaultChecked />
                    <Label htmlFor="includeDetails">Bao gồm chi tiết thời gian vào/ra</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="includeStats" defaultChecked />
                    <Label htmlFor="includeStats">Bao gồm thống kê tổng hợp</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleExportAttendance} className="bg-primary hover:bg-primary/90">
              Xuất báo cáo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
