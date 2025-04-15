"use client"

import { useState, useMemo, useCallback } from "react"
import { Calendar, FileSpreadsheet, MoreHorizontal, Search, Trash, UserPlus, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { AppShell } from "@/components/app-shell"
import { navigation } from "../dashboard/page"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

// Dữ liệu mẫu
const hocKyList = [
  { value: "HK1-2023-2024", label: "Học kỳ 1 (2023-2024)" },
  { value: "HK2-2023-2024", label: "Học kỳ 2 (2023-2024)" },
  { value: "HK3-2023-2024", label: "Học kỳ 3 (2023-2024)" },
]

const lopHocPhanList = [
  {
    maLHP: "COMP101-01-2023-1",
    tenMonHoc: "Nhập môn lập trình",
    maGV: "GV001",
    tenGV: "Nguyễn Văn A",
    hocKy: "HK1-2023-2024",
    nhom: 1,
    soSinhVien: 3,
    soSinhVienToiDa: 40,
  },
  {
    maLHP: "COMP102-01-2023-1",
    tenMonHoc: "Cấu trúc dữ liệu và giải thuật",
    maGV: "GV002",
    tenGV: "Trần Thị B",
    hocKy: "HK1-2023-2024",
    nhom: 1,
    soSinhVien: 2,
    soSinhVienToiDa: 35,
  },
  {
    maLHP: "COMP103-01-2023-1",
    tenMonHoc: "Cơ sở dữ liệu",
    maGV: "GV003",
    tenGV: "Lê Văn C",
    hocKy: "HK2-2023-2024",
    nhom: 1,
    soSinhVien: 0,
    soSinhVienToiDa: 40,
  },
  {
    maLHP: "COMP104-01-2023-1",
    tenMonHoc: "Lập trình hướng đối tượng",
    maGV: "GV004",
    tenGV: "Phạm Thị D",
    hocKy: "HK2-2023-2024",
    nhom: 1,
    soSinhVien: 0,
    soSinhVienToiDa: 35,
  },
]

const sinhVienList = [
  { maSV: "SV001", hoTen: "Nguyễn Văn An", maLop: "CNTT2020" },
  { maSV: "SV002", hoTen: "Trần Thị Bình", maLop: "CNTT2020" },
  { maSV: "SV003", hoTen: "Lê Văn Cường", maLop: "CNTT2020" },
  { maSV: "SV004", hoTen: "Phạm Thị Dung", maLop: "KTPM2020" },
  { maSV: "SV005", hoTen: "Hoàng Văn Em", maLop: "KTPM2020" },
  { maSV: "SV006", hoTen: "Ngô Thị Phương", maLop: "KTPM2020" },
  { maSV: "SV007", hoTen: "Đỗ Văn Giang", maLop: "HTTT2020" },
  { maSV: "SV008", hoTen: "Vũ Thị Hoa", maLop: "HTTT2020" },
  { maSV: "SV009", hoTen: "Bùi Văn Ích", maLop: "HTTT2020" },
  { maSV: "SV010", hoTen: "Lý Thị Kim", maLop: "CNTT2021" },
]

type DangKyHoc = {
  id: string
  maSV: string
  tenSV: string
  maLop: string
  maLHP: string
  tenMonHoc: string
  tenGV: string
  hocKy: string
  nhom: number
  isActive: boolean
}

// Dữ liệu mẫu
const initialData: DangKyHoc[] = [
  {
    id: "1",
    maSV: "SV001",
    tenSV: "Nguyễn Văn An",
    maLop: "CNTT2020",
    maLHP: "COMP101-01-2023-1",
    tenMonHoc: "Nhập môn lập trình",
    tenGV: "Nguyễn Văn A",
    hocKy: "HK1-2023-2024",
    nhom: 1,
    isActive: true,
  },
  {
    id: "2",
    maSV: "SV002",
    tenSV: "Trần Thị Bình",
    maLop: "CNTT2020",
    maLHP: "COMP101-01-2023-1",
    tenMonHoc: "Nhập môn lập trình",
    tenGV: "Nguyễn Văn A",
    hocKy: "HK1-2023-2024",
    nhom: 1,
    isActive: true,
  },
  {
    id: "3",
    maSV: "SV003",
    tenSV: "Lê Văn Cường",
    maLop: "CNTT2020",
    maLHP: "COMP101-01-2023-1",
    tenMonHoc: "Nhập môn lập trình",
    tenGV: "Nguyễn Văn A",
    hocKy: "HK1-2023-2024",
    nhom: 1,
    isActive: false,
  },
  {
    id: "4",
    maSV: "SV004",
    tenSV: "Phạm Thị Dung",
    maLop: "KTPM2020",
    maLHP: "COMP102-01-2023-1",
    tenMonHoc: "Cấu trúc dữ liệu và giải thuật",
    tenGV: "Trần Thị B",
    hocKy: "HK1-2023-2024",
    nhom: 1,
    isActive: true,
  },
  {
    id: "5",
    maSV: "SV005",
    tenSV: "Hoàng Văn Em",
    maLop: "KTPM2020",
    maLHP: "COMP102-01-2023-1",
    tenMonHoc: "Cấu trúc dữ liệu và giải thuật",
    tenGV: "Trần Thị B",
    hocKy: "HK1-2023-2024",
    nhom: 1,
    isActive: true,
  },
]

export default function DangKyHocPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedHocKy, setSelectedHocKy] = useState(hocKyList[0].value)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize] = useState(10)
  const [data, setData] = useState<DangKyHoc[]>(initialData)

  // State cho view
  const [view, setView] = useState<"lopHocPhan" | "sinhVien">("lopHocPhan")
  const [selectedLopHP, setSelectedLopHP] = useState<string | null>(null)

  // State cho dialog
  const [isAddSinhVienDialogOpen, setIsAddSinhVienDialogOpen] = useState(false)
  const [isImportExcelDialogOpen, setIsImportExcelDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<DangKyHoc | null>(null)

  // State cho form thêm sinh viên
  const [selectedSinhVien, setSelectedSinhVien] = useState<string[]>([])
  const [searchSinhVien, setSearchSinhVien] = useState("")

  // Lọc danh sách lớp học phần theo học kỳ đã chọn
  const filteredLopHocPhan = useMemo(() => {
    return lopHocPhanList.filter((lhp) => lhp.hocKy === selectedHocKy)
  }, [selectedHocKy])

  // Lọc danh sách sinh viên đã đăng ký vào lớp học phần đã chọn
  const filteredSinhVien = useMemo(() => {
    if (!selectedLopHP) return []

    return data
      .filter((item) => item.maLHP === selectedLopHP)
      .filter((item) =>
        searchQuery
          ? item.tenSV.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.maSV.toLowerCase().includes(searchQuery.toLowerCase())
          : true,
      )
  }, [data, selectedLopHP, searchQuery])

  // Lọc danh sách sinh viên chưa đăng ký vào lớp học phần đã chọn
  const availableSinhVien = useMemo(() => {
    if (!selectedLopHP) return []

    const registeredStudentIds = data.filter((item) => item.maLHP === selectedLopHP).map((item) => item.maSV)

    return sinhVienList
      .filter((sv) => !registeredStudentIds.includes(sv.maSV))
      .filter((sv) =>
        searchSinhVien
          ? sv.hoTen.toLowerCase().includes(searchSinhVien.toLowerCase()) ||
            sv.maSV.toLowerCase().includes(searchSinhVien.toLowerCase())
          : true,
      )
  }, [data, selectedLopHP, searchSinhVien])

  // Phân trang
  const paginatedSinhVien = useMemo(() => {
    const start = currentPage * pageSize
    const end = start + pageSize
    return filteredSinhVien.slice(start, end)
  }, [filteredSinhVien, currentPage, pageSize])

  // Xử lý chọn lớp học phần
  const handleSelectLopHP = useCallback((maLHP: string) => {
    setSelectedLopHP(maLHP)
    setView("sinhVien")
    setCurrentPage(0)
    setSearchQuery("")
  }, [])

  // Xử lý quay lại danh sách lớp học phần
  const handleBackToLopHP = useCallback(() => {
    setSelectedLopHP(null)
    setView("lopHocPhan")
  }, [])

  // Xử lý mở dialog thêm sinh viên
  const handleOpenAddSinhVienDialog = useCallback(() => {
    if (!selectedLopHP) return
    setSelectedSinhVien([])
    setSearchSinhVien("")
    setIsAddSinhVienDialogOpen(true)
  }, [selectedLopHP])

  // Xử lý mở dialog nhập từ Excel
  const handleOpenImportExcelDialog = useCallback(() => {
    if (!selectedLopHP) return
    setIsImportExcelDialogOpen(true)
  }, [selectedLopHP])

  // Xử lý thêm sinh viên vào lớp học phần
  const handleAddSinhVien = useCallback(() => {
    if (!selectedLopHP || selectedSinhVien.length === 0) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất một sinh viên để thêm vào lớp học phần.",
      })
      return
    }

    const lopHocPhan = lopHocPhanList.find((lhp) => lhp.maLHP === selectedLopHP)
    if (!lopHocPhan) return

    const newItems: DangKyHoc[] = selectedSinhVien.map((maSV) => {
      const sinhVien = sinhVienList.find((sv) => sv.maSV === maSV)
      if (!sinhVien) throw new Error(`Không tìm thấy sinh viên với mã ${maSV}`)

      return {
        id: `${Date.now()}-${maSV}`,
        maSV: sinhVien.maSV,
        tenSV: sinhVien.hoTen,
        maLop: sinhVien.maLop,
        maLHP: lopHocPhan.maLHP,
        tenMonHoc: lopHocPhan.tenMonHoc,
        tenGV: lopHocPhan.tenGV,
        hocKy: lopHocPhan.hocKy,
        nhom: lopHocPhan.nhom,
        isActive: true,
      }
    })

    setData((prev) => [...prev, ...newItems])
    setIsAddSinhVienDialogOpen(false)
    toast({
      title: "Thêm sinh viên thành công",
      description: `Đã thêm ${newItems.length} sinh viên vào lớp học phần ${lopHocPhan.tenMonHoc}`,
    })
  }, [selectedLopHP, selectedSinhVien, toast])

  // Xử lý nhập từ Excel
  const handleImportExcel = useCallback(() => {
    // Giả lập nhập từ Excel
    toast({
      title: "Nhập từ Excel thành công",
      description: "Đã nhập danh sách sinh viên từ file Excel",
    })
    setIsImportExcelDialogOpen(false)
  }, [toast])

  // Xử lý xóa đăng ký học
  const handleDelete = useCallback((item: DangKyHoc) => {
    setSelectedItem(item)
    setIsDeleteDialogOpen(true)
  }, [])

  // Xử lý xác nhận xóa
  const handleConfirmDelete = useCallback(() => {
    if (!selectedItem) return

    setData((prev) => prev.filter((item) => item.id !== selectedItem.id))
    setIsDeleteDialogOpen(false)
    toast({
      title: "Xóa đăng ký học thành công",
      description: `Đã xóa đăng ký học của sinh viên ${selectedItem.tenSV} khỏi lớp ${selectedItem.tenMonHoc}`,
    })
  }, [selectedItem, toast])

  // Xử lý thay đổi trạng thái
  const handleToggleStatus = useCallback(
    (item: DangKyHoc) => {
      setData((prev) => prev.map((d) => (d.id === item.id ? { ...d, isActive: !d.isActive } : d)))

      toast({
        title: "Thay đổi trạng thái thành công",
        description: `Đã ${!item.isActive ? "kích hoạt" : "vô hiệu hóa"} đăng ký học của sinh viên ${item.tenSV}`,
      })
    },
    [toast],
  )

  // Xử lý thay đổi trang
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage)
  }, [])

  // Lấy thông tin lớp học phần đã chọn
  const selectedLopHPInfo = useMemo(() => {
    if (!selectedLopHP) return null
    return lopHocPhanList.find((lhp) => lhp.maLHP === selectedLopHP)
  }, [selectedLopHP])

  // Thống kê
  const stats = useMemo(() => {
    if (view === "lopHocPhan") {
      return {
        total: filteredLopHocPhan.length,
        active: filteredLopHocPhan.filter((lhp) => data.some((item) => item.maLHP === lhp.maLHP && item.isActive))
          .length,
        students: data.filter((item) => filteredLopHocPhan.some((lhp) => lhp.maLHP === item.maLHP)).length,
      }
    } else {
      return {
        total: filteredSinhVien.length,
        active: filteredSinhVien.filter((item) => item.isActive).length,
        inactive: filteredSinhVien.filter((item) => !item.isActive).length,
      }
    }
  }, [view, filteredLopHocPhan, filteredSinhVien, data])

  return (
    <AppShell navigation={navigation}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Quản lý đăng ký học</h1>
          <p className="text-muted-foreground">Quản lý đăng ký học phần cho sinh viên</p>
        </div>

        {/* Thống kê */}
        <div className="grid gap-4 md:grid-cols-3">
          {view === "lopHocPhan" ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng số lớp học phần</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">Học kỳ hiện tại</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Lớp học phần có sinh viên</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.active}</div>
                  <p className="text-xs text-muted-foreground">Học kỳ hiện tại</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng số đăng ký</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.students}</div>
                  <p className="text-xs text-muted-foreground">Học kỳ hiện tại</p>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tổng số sinh viên</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <p className="text-xs text-muted-foreground">Trong lớp học phần này</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.active}</div>
                  <p className="text-xs text-muted-foreground">Trong lớp học phần này</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Không hoạt động</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.inactive}</div>
                  <p className="text-xs text-muted-foreground">Trong lớp học phần này</p>
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
                    {hocKyList.map((hk) => (
                      <SelectItem key={hk.value} value={hk.value}>
                        {hk.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {view === "sinhVien" && (
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
              )}
            </div>

            {view === "sinhVien" && selectedLopHP && (
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" size="sm" className="h-8 gap-1" onClick={handleOpenImportExcelDialog}>
                  <FileSpreadsheet className="h-4 w-4" />
                  Nhập từ Excel
                </Button>
                <Button
                  size="sm"
                  className="h-8 gap-1 bg-primary hover:bg-primary/90"
                  onClick={handleOpenAddSinhVienDialog}
                >
                  <UserPlus className="h-4 w-4" />
                  Thêm sinh viên
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
                    <TableHead>Số sinh viên</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLopHocPhan.length > 0 ? (
                    filteredLopHocPhan.map((lhp) => {
                      const registeredCount = data.filter((item) => item.maLHP === lhp.maLHP).length

                      return (
                        <TableRow key={lhp.maLHP}>
                          <TableCell>{lhp.maLHP}</TableCell>
                          <TableCell className="font-medium">{lhp.tenMonHoc}</TableCell>
                          <TableCell>{lhp.nhom}</TableCell>
                          <TableCell>{lhp.tenGV}</TableCell>
                          <TableCell>
                            {registeredCount}/{lhp.soSinhVienToiDa}
                            <div className="mt-1 h-2 w-full rounded-full bg-gray-200">
                              <div
                                className="h-2 rounded-full bg-primary"
                                style={{ width: `${(registeredCount / lhp.soSinhVienToiDa) * 100}%` }}
                              />
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="outline" size="sm" onClick={() => handleSelectLopHP(lhp.maLHP)}>
                              Xem danh sách
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })
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
          ) : (
            // Danh sách sinh viên trong lớp học phần
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
                      Mã lớp: {selectedLopHPInfo.maLHP} | Giảng viên: {selectedLopHPInfo.tenGV}
                    </p>
                  </div>
                </div>
              )}

              <Tabs defaultValue="all">
                <TabsList>
                  <TabsTrigger value="all">Tất cả</TabsTrigger>
                  <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
                  <TabsTrigger value="inactive">Không hoạt động</TabsTrigger>
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
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedSinhVien.length > 0 ? (
                      paginatedSinhVien.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.maSV}</TableCell>
                          <TableCell className="font-medium">{item.tenSV}</TableCell>
                          <TableCell>{item.maLop}</TableCell>
                          <TableCell>
                            {item.isActive ? (
                              <Badge variant="outline" className="bg-green-100 text-green-800">
                                Hoạt động
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-red-100 text-red-800">
                                Không hoạt động
                              </Badge>
                            )}
                          </TableCell>
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
                                <DropdownMenuItem onClick={() => handleToggleStatus(item)}>
                                  {item.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDelete(item)} className="text-red-600">
                                  <Trash className="mr-2 h-4 w-4" />
                                  Xóa
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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

              {/* Phân trang */}
              {filteredSinhVien.length > pageSize && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Hiển thị {paginatedSinhVien.length} trên {filteredSinhVien.length} kết quả
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 0}
                    >
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={(currentPage + 1) * pageSize >= filteredSinhVien.length}
                    >
                      Sau
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Dialog thêm sinh viên */}
      <Dialog open={isAddSinhVienDialogOpen} onOpenChange={setIsAddSinhVienDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Thêm sinh viên vào lớp học phần</DialogTitle>
            <DialogDescription>
              {selectedLopHPInfo &&
                `Thêm sinh viên vào lớp ${selectedLopHPInfo.tenMonHoc} - Nhóm ${selectedLopHPInfo.nhom}`}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm sinh viên..."
                  value={searchSinhVien}
                  onChange={(e) => setSearchSinhVien(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="max-h-[300px] overflow-y-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={availableSinhVien.length > 0 && selectedSinhVien.length === availableSinhVien.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedSinhVien(availableSinhVien.map((sv) => sv.maSV))
                          } else {
                            setSelectedSinhVien([])
                          }
                        }}
                        aria-label="Chọn tất cả"
                      />
                    </TableHead>
                    <TableHead>Mã SV</TableHead>
                    <TableHead>Họ tên</TableHead>
                    <TableHead>Lớp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {availableSinhVien.length > 0 ? (
                    availableSinhVien.map((sv) => (
                      <TableRow key={sv.maSV}>
                        <TableCell>
                          <Checkbox
                            checked={selectedSinhVien.includes(sv.maSV)}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                setSelectedSinhVien((prev) => [...prev, sv.maSV])
                              } else {
                                setSelectedSinhVien((prev) => prev.filter((id) => id !== sv.maSV))
                              }
                            }}
                            aria-label={`Chọn ${sv.hoTen}`}
                          />
                        </TableCell>
                        <TableCell>{sv.maSV}</TableCell>
                        <TableCell>{sv.hoTen}</TableCell>
                        <TableCell>{sv.maLop}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        Không có sinh viên nào có thể thêm vào lớp học phần này.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddSinhVienDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleAddSinhVien}
              disabled={selectedSinhVien.length === 0}
              className="bg-primary hover:bg-primary/90"
            >
              Thêm {selectedSinhVien.length} sinh viên
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog nhập từ Excel */}
      <Dialog open={isImportExcelDialogOpen} onOpenChange={setIsImportExcelDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nhập danh sách sinh viên từ Excel</DialogTitle>
            <DialogDescription>
              {selectedLopHPInfo &&
                `Nhập danh sách sinh viên vào lớp ${selectedLopHPInfo.tenMonHoc} - Nhóm ${selectedLopHPInfo.nhom}`}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-4">
              <Label htmlFor="excel-file">Chọn file Excel</Label>
              <div className="mt-2 flex items-center gap-2">
                <Input id="excel-file" type="file" accept=".xlsx, .xls" />
              </div>
            </div>

            <div className="rounded-md border bg-muted/50 p-4">
              <h4 className="mb-2 font-medium">Hướng dẫn:</h4>
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>File Excel phải có các cột: Mã SV, Họ tên, Lớp</li>
                <li>Định dạng file: .xlsx hoặc .xls</li>
                <li>Kích thước tối đa: 5MB</li>
                <li>
                  Tải{" "}
                  <a href="#" className="text-primary underline">
                    mẫu file Excel
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportExcelDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleImportExcel} className="bg-primary hover:bg-primary/90">
              Nhập dữ liệu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn xóa đăng ký học này không?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedItem && (
              <>
                <p>
                  <strong>Sinh viên:</strong> {selectedItem.tenSV} ({selectedItem.maSV})
                </p>
                <p>
                  <strong>Lớp học phần:</strong> {selectedItem.tenMonHoc} - Nhóm {selectedItem.nhom}
                </p>
              </>
            )}
            <p className="mt-2 text-sm text-red-400">Lưu ý: Hành động này không thể hoàn tác.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
