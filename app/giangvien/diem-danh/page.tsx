// Create this file for the attendance page
"use client"

import { useState } from "react"
import { Calendar, Check, Download, Loader2, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { AppShell } from "@/components/app-shell"
import { navigation } from "../dashboard/page"

type SinhVien = {
  id: string
  hoTen: string
  maSV: string
  coMat: boolean | null
  lanDiemDanhCuoi: string | null
}

const lopHocPhan = [
  { id: "COMP101-01", tenMH: "Nhập môn lập trình", nhom: "A" },
  { id: "COMP102-01", tenMH: "Cấu trúc dữ liệu và giải thuật", nhom: "B" },
  { id: "COMP103-01", tenMH: "Cơ sở dữ liệu", nhom: "C" },
  { id: "COMP104-01", tenMH: "Lập trình hướng đối tượng", nhom: "A" },
  { id: "COMP105-01", tenMH: "Mạng máy tính", nhom: "B" },
]

const sinhVien: SinhVien[] = [
  {
    id: "sv1",
    hoTen: "Nguyễn Văn An",
    maSV: "SV001",
    coMat: null,
    lanDiemDanhCuoi: "2023-04-10",
  },
  {
    id: "sv2",
    hoTen: "Trần Thị Bình",
    maSV: "SV002",
    coMat: null,
    lanDiemDanhCuoi: "2023-04-10",
  },
  {
    id: "sv3",
    hoTen: "Lê Văn Cường",
    maSV: "SV003",
    coMat: null,
    lanDiemDanhCuoi: "2023-04-10",
  },
  {
    id: "sv4",
    hoTen: "Phạm Thị Dung",
    maSV: "SV004",
    coMat: null,
    lanDiemDanhCuoi: "2023-04-10",
  },
  {
    id: "sv5",
    hoTen: "Hoàng Văn Em",
    maSV: "SV005",
    coMat: null,
    lanDiemDanhCuoi: "2023-04-03",
  },
  {
    id: "sv6",
    hoTen: "Ngô Thị Phương",
    maSV: "SV006",
    coMat: null,
    lanDiemDanhCuoi: "2023-04-10",
  },
  {
    id: "sv7",
    hoTen: "Đỗ Văn Giang",
    maSV: "SV007",
    coMat: null,
    lanDiemDanhCuoi: "2023-04-10",
  },
  {
    id: "sv8",
    hoTen: "Vũ Thị Hoa",
    maSV: "SV008",
    coMat: null,
    lanDiemDanhCuoi: "2023-04-03",
  },
  {
    id: "sv9",
    hoTen: "Bùi Văn Ích",
    maSV: "SV009",
    coMat: null,
    lanDiemDanhCuoi: "2023-04-10",
  },
  {
    id: "sv10",
    hoTen: "Lý Thị Kim",
    maSV: "SV010",
    coMat: null,
    lanDiemDanhCuoi: "2023-04-10",
  },
]

export default function DiemDanhPage() {
  const [selectedLopHP, setSelectedLopHP] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [danhSachDiemDanh, setDanhSachDiemDanh] = useState<SinhVien[]>(sinhVien)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDiemDanhStarted, setIsDiemDanhStarted] = useState(false)
  const { toast } = useToast()

  const filteredSinhVien = danhSachDiemDanh.filter(
    (sv) =>
      sv.hoTen.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sv.maSV.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleStartDiemDanh = () => {
    if (!selectedLopHP) {
      toast({
        variant: "destructive",
        title: "Cần chọn lớp học phần",
        description: "Vui lòng chọn một lớp học phần trước khi bắt đầu điểm danh.",
      })
      return
    }

    setIsDiemDanhStarted(true)
    toast({
      title: "Đã bắt đầu điểm danh",
      description: "Bạn có thể điểm danh cho sinh viên.",
    })
  }

  const handleMarkDiemDanh = (sinhVienId: string, coMat: boolean) => {
    setDanhSachDiemDanh((prev) => prev.map((sv) => (sv.id === sinhVienId ? { ...sv, coMat } : sv)))
  }

  const handleSubmitDiemDanh = async () => {
    if (!selectedLopHP) {
      toast({
        variant: "destructive",
        title: "Cần chọn lớp học phần",
        description: "Vui lòng chọn một lớp học phần trước khi nộp điểm danh.",
      })
      return
    }

    const chuaDiemDanh = danhSachDiemDanh.filter((sv) => sv.coMat === null)
    if (chuaDiemDanh.length > 0) {
      toast({
        variant: "destructive",
        title: "Điểm danh chưa hoàn thành",
        description: `${chuaDiemDanh.length} sinh viên chưa được điểm danh. Vui lòng hoàn thành điểm danh.`,
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Trong ứng dụng thực tế, đây sẽ gọi API của bạn
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Đã nộp điểm danh",
        description: "Điểm danh đã được ghi lại thành công.",
      })

      // Đặt lại trạng thái điểm danh
      setIsDiemDanhStarted(false)
      setDanhSachDiemDanh(sinhVien.map((sv) => ({ ...sv, coMat: null })))
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Nộp thất bại",
        description: "Đã xảy ra lỗi khi nộp điểm danh. Vui lòng thử lại.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const coMatCount = danhSachDiemDanh.filter((sv) => sv.coMat === true).length
  const vangMatCount = danhSachDiemDanh.filter((sv) => sv.coMat === false).length
  const chuaDiemDanhCount = danhSachDiemDanh.filter((sv) => sv.coMat === null).length

  return (
    <AppShell navigation={navigation}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Quản lý điểm danh</h1>
          <p className="text-muted-foreground">Điểm danh và quản lý điểm danh cho các lớp học của bạn</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Có mặt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{coMatCount}</div>
              <p className="text-xs text-muted-foreground">
                {((coMatCount / danhSachDiemDanh.length) * 100).toFixed(1)}% lớp học
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Vắng mặt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vangMatCount}</div>
              <p className="text-xs text-muted-foreground">
                {((vangMatCount / danhSachDiemDanh.length) * 100).toFixed(1)}% lớp học
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Chưa điểm danh</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{chuaDiemDanhCount}</div>
              <p className="text-xs text-muted-foreground">
                {((chuaDiemDanhCount / danhSachDiemDanh.length) * 100).toFixed(1)}% lớp học
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Điểm danh</CardTitle>
            <CardDescription>Chọn một lớp học phần và điểm danh cho sinh viên</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <Select value={selectedLopHP} onValueChange={setSelectedLopHP} disabled={isDiemDanhStarted}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn lớp học phần" />
                    </SelectTrigger>
                    <SelectContent>
                      {lopHocPhan.map((lop) => (
                        <SelectItem key={lop.id} value={lop.id}>
                          {lop.tenMH} - Nhóm {lop.nhom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  {isDiemDanhStarted ? (
                    <>
                      <Button variant="outline" onClick={() => setIsDiemDanhStarted(false)} disabled={isSubmitting}>
                        Hủy
                      </Button>
                      <Button
                        onClick={handleSubmitDiemDanh}
                        disabled={isSubmitting}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang nộp...
                          </>
                        ) : (
                          "Nộp điểm danh"
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleStartDiemDanh} className="bg-primary hover:bg-primary/90">
                      Bắt đầu điểm danh
                    </Button>
                  )}
                </div>
              </div>

              {isDiemDanhStarted && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tìm kiếm sinh viên..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Mã SV</TableHead>
                          <TableHead>Họ tên</TableHead>
                          <TableHead>Lần điểm danh cuối</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead>Hành động</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSinhVien.length > 0 ? (
                          filteredSinhVien.map((sv) => (
                            <TableRow key={sv.id}>
                              <TableCell>{sv.maSV}</TableCell>
                              <TableCell>{sv.hoTen}</TableCell>
                              <TableCell>
                                {sv.lanDiemDanhCuoi ? (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{sv.lanDiemDanhCuoi}</span>
                                  </div>
                                ) : (
                                  "N/A"
                                )}
                              </TableCell>
                              <TableCell>
                                {sv.coMat === true ? (
                                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                                    Có mặt
                                  </span>
                                ) : sv.coMat === false ? (
                                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                                    Vắng mặt
                                  </span>
                                ) : (
                                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                                    Chưa điểm danh
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-green-600"
                                    onClick={() => handleMarkDiemDanh(sv.id, true)}
                                  >
                                    <Check className="h-4 w-4" />
                                    <span className="sr-only">Điểm danh có mặt</span>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-600"
                                    onClick={() => handleMarkDiemDanh(sv.id, false)}
                                  >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Điểm danh vắng mặt</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                              Không tìm thấy sinh viên.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Báo cáo điểm danh</CardTitle>
            <CardDescription>Xem và tải xuống báo cáo điểm danh cho các lớp học của bạn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn lớp học phần" />
                    </SelectTrigger>
                    <SelectContent>
                      {lopHocPhan.map((lop) => (
                        <SelectItem key={lop.id} value={lop.id}>
                          {lop.tenMH} - Nhóm {lop.nhom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Xuất báo cáo
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ngày</TableHead>
                      <TableHead>Môn học</TableHead>
                      <TableHead>Có mặt</TableHead>
                      <TableHead>Vắng mặt</TableHead>
                      <TableHead>Tỷ lệ điểm danh</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <TableRow key={i}>
                        <TableCell>{new Date(Date.now() - i * 86400000 * 7).toLocaleDateString()}</TableCell>
                        <TableCell>Nhập môn lập trình - Nhóm A</TableCell>
                        <TableCell>{20 - i}</TableCell>
                        <TableCell>{i}</TableCell>
                        <TableCell>{(((20 - i) / 20) * 100).toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
