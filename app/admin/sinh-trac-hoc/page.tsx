"use client"

import { useState } from "react"
import { Activity, AlarmClock, Bell, BookMarked, BookOpen, Building2, Calendar, Camera, Check, ClipboardList, Download, Eye, FileWarning, Filter, FolderOpen, GraduationCap, ImageIcon, Layers3, LayoutDashboard, Loader2, RefreshCw, School, Search, Settings, UserCheck, UserCog, Users } from "lucide-react"

import { AppShell } from "@/components/app-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Giả lập dữ liệu sinh viên
const mockStudents = [
  {
    id: 1,
    mssv: "SV001",
    hoTen: "Nguyễn Văn A",
    lop: "CNTT01",
    trangThai: "Đã xử lý",
    soLuongAnh: 5,
    ngayCapNhat: "2023-04-15",
  },
  {
    id: 2,
    mssv: "SV002",
    hoTen: "Trần Thị B",
    lop: "CNTT01",
    trangThai: "Chưa xử lý",
    soLuongAnh: 5,
    ngayCapNhat: "2023-04-16",
  },
  {
    id: 3,
    mssv: "SV003",
    hoTen: "Lê Văn C",
    lop: "CNTT02",
    trangThai: "Đã xử lý",
    soLuongAnh: 5,
    ngayCapNhat: "2023-04-14",
  },
  {
    id: 4,
    mssv: "SV004",
    hoTen: "Phạm Thị D",
    lop: "CNTT02",
    trangThai: "Lỗi",
    soLuongAnh: 3,
    ngayCapNhat: "2023-04-17",
  },
  {
    id: 5,
    mssv: "SV005",
    hoTen: "Hoàng Văn E",
    lop: "CNTT03",
    trangThai: "Chưa xử lý",
    soLuongAnh: 5,
    ngayCapNhat: "2023-04-18",
  },
]

// Giả lập dữ liệu lớp học
const mockClasses = ["CNTT01", "CNTT02", "CNTT03", "CNTT04", "CNTT05"]

// Định nghĩa navigation cho admin
export const navigation = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Năm học",
      href: "/admin/nam-hoc",
      icon: Calendar,
    },
    {
      title: "Học kỳ",
      href: "/admin/hoc-ky",
      icon: Calendar,
    },
    {
      title: "Khoa",
      href: "/admin/khoa",
      icon: School,
    },
    {
      title: "Ngành",
      href: "/admin/nganh",
      icon: BookOpen,
    },
    {
      title: "Môn học",
      href: "/admin/mon-hoc",
      icon: GraduationCap,
    },
    {
      title: "Lớp học",
      href: "/admin/lop-hoc",
      icon: Layers3,
    },
    {
      title: "Lớp học phần",
      href: "/admin/lop-hoc-phan",
      icon: BookMarked,
    },
    {
      title: "Phòng học",
      href: "/admin/phong-hoc",
      icon: Building2,
    },
    {
      title: "Tài khoản",
      href: "/admin/users",
      icon: UserCog,
    },
    {
      title: "Sinh viên",
      href: "/admin/sinh-vien",
      icon: Users,
    },
    {
      title: "Giảng viên",
      href: "/admin/giang-vien",
      icon: ClipboardList,
    },
    {
      title: "Lịch học",
      href: "/admin/lich-hoc",
      icon: AlarmClock,
    },
    {
      title: "Đăng ký học",
      href: "/admin/dang-ky-hoc",
      icon: FolderOpen,
    },
    {
      title: "Điểm danh",
      href: "/admin/diem-danh",
      icon: UserCheck,
    },
    {
      title: "Sinh trắc học",
      href: "/admin/sinh-trac-hoc",
      icon: Camera ,
    },
    {
      title: "Thống kê",
      href: "/admin/thong-ke",
      icon: Activity,
    },
    {
      title: "Thông báo & cảnh báo",
      href: "/admin/canh-bao",
      icon: Bell,
    },
    {
      title: "System Log",
      href: "/admin/system-log",
      icon: FileWarning,
    },
    {
      title: "Cài đặt",
      href: "/admin/cai-dat",
      icon: Settings,
    },
  ]

export default function AdminBiometricPage() {
  const [students, setStudents] = useState(mockStudents)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedClass, setSelectedClass] = useState<string | undefined>()
  const [selectedStatus, setSelectedStatus] = useState<string | undefined>()
  const [processingStudentId, setProcessingStudentId] = useState<number | null>(null)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)
  const [viewImageDialogOpen, setViewImageDialogOpen] = useState(false)
  const [processingDialogOpen, setProcessingDialogOpen] = useState(false)

  // Lọc sinh viên dựa trên các điều kiện tìm kiếm
  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.mssv.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.hoTen.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesClass = !selectedClass || student.lop === selectedClass
    const matchesStatus = !selectedStatus || selectedStatus === "all" || student.trangThai === selectedStatus

    return matchesSearch && matchesClass && matchesStatus
  })

  // Giả lập quá trình xử lý sinh trắc học
  const processStudent = (studentId: number) => {
    setProcessingStudentId(studentId)
    setProcessingProgress(0)
    setIsProcessing(true)
    setProcessingDialogOpen(true)

    // Giả lập tiến trình xử lý
    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)

          // Cập nhật trạng thái sinh viên sau khi xử lý xong
          setTimeout(() => {
            setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, trangThai: "Đã xử lý" } : s)))
            setIsProcessing(false)
            setProcessingStudentId(null)
          }, 500)

          return 100
        }
        return prev + 10
      })
    }, 300)
  }

  // Xem chi tiết hình ảnh của sinh viên
  const viewStudentImages = (student: any) => {
    setSelectedStudent(student)
    setViewImageDialogOpen(true)
  }

  // Giả lập hình ảnh sinh viên
  const getStudentImages = (mssv: string) => {
    return Array(5)
      .fill(0)
      .map((_, index) => ({
        id: index + 1,
        url: `/placeholder.svg?height=300&width=300&text=Ảnh ${index + 1} - ${mssv}`,
        filename: `${index + 1}.jpg`,
      }))
  }

  // Xử lý tất cả sinh viên chưa được xử lý
  const processAllPendingStudents = () => {
    const pendingStudents = students.filter((s) => s.trangThai === "Chưa xử lý")
    if (pendingStudents.length === 0) return

    // Giả lập xử lý hàng loạt
    setIsProcessing(true)
    setProcessingProgress(0)
    setProcessingDialogOpen(true)

    const interval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)

          setTimeout(() => {
            setStudents((prev) => prev.map((s) => (s.trangThai === "Chưa xử lý" ? { ...s, trangThai: "Đã xử lý" } : s)))
            setIsProcessing(false)
          }, 500)

          return 100
        }
        return prev + 5
      })
    }, 200)
  }

  // Xuất báo cáo
  const exportReport = () => {
    alert("Xuất báo cáo sinh trắc học")
  }

  return (
    <AppShell navigation={navigation}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Quản lý Sinh trắc học</h1>
          <p className="text-muted-foreground">Quản lý dữ liệu sinh trắc học của sinh viên và trích xuất đặc trưng</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng số sinh viên</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
              <p className="text-xs text-muted-foreground">Sinh viên đã đăng ký sinh trắc học</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đã xử lý</CardTitle>
              <Check className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.filter((s) => s.trangThai === "Đã xử lý").length}</div>
              <p className="text-xs text-muted-foreground">Sinh viên đã được trích xuất đặc trưng</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chưa xử lý</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.filter((s) => s.trangThai === "Chưa xử lý").length}</div>
              <p className="text-xs text-muted-foreground">Sinh viên chờ trích xuất đặc trưng</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Có lỗi</CardTitle>
              <FileWarning className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.filter((s) => s.trangThai === "Lỗi").length}</div>
              <p className="text-xs text-muted-foreground">Sinh viên có lỗi trong quá trình xử lý</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TabsList>
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="pending">Chưa xử lý</TabsTrigger>
              <TabsTrigger value="processed">Đã xử lý</TabsTrigger>
              <TabsTrigger value="error">Lỗi</TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={processAllPendingStudents}
                disabled={students.filter((s) => s.trangThai === "Chưa xử lý").length === 0}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Xử lý tất cả
              </Button>
              <Button variant="outline" onClick={exportReport}>
                <Download className="mr-2 h-4 w-4" />
                Xuất báo cáo
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="grid w-full sm:max-w-sm items-center gap-1.5">
              <Label htmlFor="search">Tìm kiếm</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  type="search"
                  placeholder="Tìm theo MSSV, họ tên..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="grid w-full sm:max-w-[180px] gap-1.5">
              <Label htmlFor="class-filter">Lớp</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class-filter">
                  <SelectValue placeholder="Tất cả lớp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả lớp</SelectItem>
                  {mockClasses.map((cls) => (
                    <SelectItem key={cls} value={cls}>
                      {cls}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid w-full sm:max-w-[180px] gap-1.5">
              <Label htmlFor="status-filter">Trạng thái</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger id="status-filter">
                  <SelectValue placeholder="Tất cả trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="Đã xử lý">Đã xử lý</SelectItem>
                  <SelectItem value="Chưa xử lý">Chưa xử lý</SelectItem>
                  <SelectItem value="Lỗi">Lỗi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              variant="ghost"
              onClick={() => {
                setSearchTerm("")
                setSelectedClass(undefined)
                setSelectedStatus(undefined)
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>

          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>MSSV</TableHead>
                      <TableHead>Họ và tên</TableHead>
                      <TableHead>Lớp</TableHead>
                      <TableHead>Số lượng ảnh</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày cập nhật</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                          Không tìm thấy sinh viên nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.mssv}</TableCell>
                          <TableCell>{student.hoTen}</TableCell>
                          <TableCell>{student.lop}</TableCell>
                          <TableCell>
                            {student.soLuongAnh}/5
                            {student.soLuongAnh < 5 && (
                              <Badge
                                variant="outline"
                                className="ml-2 text-xs bg-amber-50 text-amber-700 hover:bg-amber-50"
                              >
                                Thiếu
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                student.trangThai === "Đã xử lý"
                                  ? "default"
                                  : student.trangThai === "Chưa xử lý"
                                    ? "outline"
                                    : "destructive"
                              }
                            >
                              {student.trangThai}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(student.ngayCapNhat).toLocaleDateString("vi-VN")}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <Filter className="h-4 w-4" />
                                  <span className="sr-only">Mở menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => viewStudentImages(student)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem ảnh
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => processStudent(student.id)}
                                  disabled={student.trangThai === "Đã xử lý" || student.soLuongAnh < 5}
                                >
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Trích xuất đặc trưng
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>MSSV</TableHead>
                      <TableHead>Họ và tên</TableHead>
                      <TableHead>Lớp</TableHead>
                      <TableHead>Số lượng ảnh</TableHead>
                      <TableHead>Ngày cập nhật</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.filter((s) => s.trangThai === "Chưa xử lý").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          Không có sinh viên nào chưa xử lý
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents
                        .filter((s) => s.trangThai === "Chưa xử lý")
                        .map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.mssv}</TableCell>
                            <TableCell>{student.hoTen}</TableCell>
                            <TableCell>{student.lop}</TableCell>
                            <TableCell>
                              {student.soLuongAnh}/5
                              {student.soLuongAnh < 5 && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-xs bg-amber-50 text-amber-700 hover:bg-amber-50"
                                >
                                  Thiếu
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{new Date(student.ngayCapNhat).toLocaleDateString("vi-VN")}</TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => processStudent(student.id)}
                                disabled={student.soLuongAnh < 5}
                              >
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Xử lý
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="processed" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>MSSV</TableHead>
                      <TableHead>Họ và tên</TableHead>
                      <TableHead>Lớp</TableHead>
                      <TableHead>Số lượng ảnh</TableHead>
                      <TableHead>Ngày cập nhật</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.filter((s) => s.trangThai === "Đã xử lý").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          Không có sinh viên nào đã xử lý
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents
                        .filter((s) => s.trangThai === "Đã xử lý")
                        .map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.mssv}</TableCell>
                            <TableCell>{student.hoTen}</TableCell>
                            <TableCell>{student.lop}</TableCell>
                            <TableCell>{student.soLuongAnh}/5</TableCell>
                            <TableCell>{new Date(student.ngayCapNhat).toLocaleDateString("vi-VN")}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" onClick={() => viewStudentImages(student)}>
                                <Eye className="mr-2 h-4 w-4" />
                                Xem ảnh
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="error" className="space-y-4">
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>MSSV</TableHead>
                      <TableHead>Họ và tên</TableHead>
                      <TableHead>Lớp</TableHead>
                      <TableHead>Số lượng ảnh</TableHead>
                      <TableHead>Ngày cập nhật</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.filter((s) => s.trangThai === "Lỗi").length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                          Không có sinh viên nào gặp lỗi
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredStudents
                        .filter((s) => s.trangThai === "Lỗi")
                        .map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.mssv}</TableCell>
                            <TableCell>{student.hoTen}</TableCell>
                            <TableCell>{student.lop}</TableCell>
                            <TableCell>
                              {student.soLuongAnh}/5
                              {student.soLuongAnh < 5 && (
                                <Badge
                                  variant="outline"
                                  className="ml-2 text-xs bg-amber-50 text-amber-700 hover:bg-amber-50"
                                >
                                  Thiếu
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{new Date(student.ngayCapNhat).toLocaleDateString("vi-VN")}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" onClick={() => viewStudentImages(student)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem ảnh
                                </Button>
                                <Button variant="outline" size="sm" onClick={() => processStudent(student.id)}>
                                  <RefreshCw className="mr-2 h-4 w-4" />
                                  Thử lại
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog xem ảnh sinh viên */}
      <Dialog open={viewImageDialogOpen} onOpenChange={setViewImageDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Ảnh sinh trắc học</DialogTitle>
            <DialogDescription>
              {selectedStudent && (
                <span>
                  {selectedStudent.mssv} - {selectedStudent.hoTen} - Lớp {selectedStudent.lop}
                </span>
              )}
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getStudentImages(selectedStudent.mssv).map((image) => (
                <div key={image.id} className="flex flex-col gap-2">
                  <div className="relative aspect-square overflow-hidden rounded-md border">
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={`Ảnh ${image.id} của sinh viên ${selectedStudent.mssv}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{image.filename}</span>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                      <span className="sr-only">Tải xuống</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewImageDialogOpen(false)}>
              Đóng
            </Button>
            {selectedStudent && selectedStudent.trangThai !== "Đã xử lý" && (
              <Button
                onClick={() => {
                  setViewImageDialogOpen(false)
                  processStudent(selectedStudent.id)
                }}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Trích xuất đặc trưng
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xử lý trích xuất đặc trưng */}
      <Dialog open={processingDialogOpen} onOpenChange={setProcessingDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Đang xử lý trích xuất đặc trưng</DialogTitle>
            <DialogDescription>Hệ thống đang trích xuất đặc trưng từ ảnh sinh trắc học</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm">
                <span>Tiến trình</span>
                <span>{processingProgress}%</span>
              </div>
              <Progress value={processingProgress} />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4 text-green-500" />
                )}
                <span className="text-sm">{isProcessing ? "Đang xử lý..." : "Hoàn thành"}</span>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setProcessingDialogOpen(false)}
              disabled={isProcessing && processingProgress < 100}
            >
              {processingProgress < 100 ? "Đang xử lý..." : "Đóng"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
