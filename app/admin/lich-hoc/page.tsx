"use client"

import { useState, useMemo } from "react"
import { CalendarDays, List, Plus, Pencil, Trash2 } from "lucide-react"
import { addMinutes, startOfWeek } from "date-fns"
import { Calendar as FullCalendar, momentLocalizer } from "react-big-calendar"
import moment from "moment"
import "react-big-calendar/lib/css/react-big-calendar.css"

import { AppShell } from "@/components/app-shell"
import { navigation } from "@/app/admin/dashboard/page"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"

const localizer = momentLocalizer(moment)

const years = ["2023-2024", "2024-2025", "2025-2026"]
const semesters = [1, 2, 3]
const displayOptions = ["Tách trang theo tuần", "Xem toàn bộ"]
const weeks = ["---- Tất cả ----", ...Array.from({ length: 20 }, (_, i) => `Tuần ${i + 1}`)]
const weekdays = [
  { value: 2, label: "Thứ 2" },
  { value: 3, label: "Thứ 3" },
  { value: 4, label: "Thứ 4" },
  { value: 5, label: "Thứ 5" },
  { value: 6, label: "Thứ 6" },
  { value: 7, label: "Thứ 7" },
  { value: 8, label: "Chủ nhật" },
]

const phongHocList = [
  { value: "A101", label: "Phòng A101" },
  { value: "A102", label: "Phòng A102" },
  { value: "A103", label: "Phòng A103" },
  { value: "B201", label: "Phòng B201" },
  { value: "B202", label: "Phòng B202" },
  { value: "B203", label: "Phòng B203" },
  { value: "C301", label: "Phòng C301" },
  { value: "C302", label: "Phòng C302" },
  { value: "C303", label: "Phòng C303" },
]

type LichHoc = {
  id: string
  tenMonHoc: string
  tenPhong: string
  thu: number
  tietBatDau: number
  soTiet: number
  tuanIds: string[]
}

export default function LichHocPage() {
  const { toast } = useToast()
  const [view, setView] = useState<"list" | "calendar">("list")

  const [year, setYear] = useState("2024-2025")
  const [semester, setSemester] = useState(3)
  const [option, setOption] = useState(displayOptions[0])
  const [week, setWeek] = useState(weeks[0])

  const [data, setData] = useState<LichHoc[]>([
    {
      id: "1",
      tenMonHoc: "Lập trình Web",
      tenPhong: "A101",
      thu: 2,
      tietBatDau: 1,
      soTiet: 3,
      tuanIds: ["week1", "week2"],
    },
    {
      id: "2",
      tenMonHoc: "Hệ quản trị CSDL",
      tenPhong: "B202",
      thu: 4,
      tietBatDau: 4,
      soTiet: 3,
      tuanIds: ["week3"],
    },
  ])

  const [form, setForm] = useState<LichHoc>({
    id: "",
    tenMonHoc: "",
    tenPhong: "A101",
    thu: 2,
    tietBatDau: 1,
    soTiet: 2,
    tuanIds: [],
  })
  const [editMode, setEditMode] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<LichHoc | null>(null)

  const handleOpenAddDialog = () => {
    setForm({
      id: "",
      tenMonHoc: "",
      tenPhong: "A101",
      thu: 2,
      tietBatDau: 1,
      soTiet: 2,
      tuanIds: [],
    })
    setEditMode(false)
    setDialogOpen(true)
  }

  const validateForm = () => {
    if (!form.tenMonHoc.trim()) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng nhập tên môn học",
      })
      return false
    }

    if (!form.tenPhong) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng chọn phòng học",
      })
      return false
    }

    if (form.thu < 2 || form.thu > 8) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Thứ phải từ 2 đến 8 (Chủ nhật)",
      })
      return false
    }

    if (form.tietBatDau < 1 || form.tietBatDau > 10) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Tiết bắt đầu phải từ 1 đến 10",
      })
      return false
    }

    if (form.soTiet < 1 || form.soTiet > 5) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Số tiết phải từ 1 đến 5",
      })
      return false
    }

    if (form.tuanIds.length === 0) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất một tuần áp dụng",
      })
      return false
    }

    return true
  }

  const handleSave = () => {
    if (!validateForm()) return

    if (editMode) {
      setData((prev) => prev.map((i) => (i.id === form.id ? form : i)))
      toast({
        title: "Thành công",
        description: "Đã cập nhật lịch học",
      })
    } else {
      const newItem = { ...form, id: Date.now().toString() }
      setData((prev) => [...prev, newItem])
      toast({
        title: "Thành công",
        description: "Đã thêm lịch học mới",
      })
    }
    setDialogOpen(false)
  }

  const handleEdit = (item: LichHoc) => {
    setForm(item)
    setEditMode(true)
    setDialogOpen(true)
  }

  const handleDelete = (item: LichHoc) => {
    setSelectedItem(item)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (selectedItem) {
      setData((prev) => prev.filter((i) => i.id !== selectedItem.id))
      toast({
        title: "Thành công",
        description: "Đã xóa lịch học",
      })
      setDeleteDialogOpen(false)
      setSelectedItem(null)
    }
  }

  const tietToTime = (tiet: number): Date => {
    const start = new Date()
    start.setHours(6, 45, 0, 0)
    return addMinutes(start, (tiet - 1) * 50)
  }

  const filteredData = useMemo(() => {
    if (week === "---- Tất cả ----") return data
    return data.filter((d) => d.tuanIds.includes(week.toLowerCase().replace(" ", "")))
  }, [data, week])

  const events = filteredData.map((item) => {
    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 })
    const dayOffset = item.thu - 2
    const start = tietToTime(item.tietBatDau)
    const end = addMinutes(start, item.soTiet * 50)

    return {
      title: `${item.tenMonHoc} (${item.tenPhong})`,
      start: new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + dayOffset,
        start.getHours(),
        start.getMinutes(),
      ),
      end: new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate() + dayOffset,
        end.getHours(),
        end.getMinutes(),
      ),
      resource: item,
    }
  })

  return (
    <AppShell navigation={navigation}>
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Quản lý lịch học</h1>
          <p className="text-muted-foreground">Xem và quản lý lịch học theo năm học, học kỳ và tuần</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {/* Bộ lọc */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="year">Năm học</Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger id="year">
                    <SelectValue placeholder="Chọn năm học" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Học kỳ</Label>
                <Select value={semester.toString()} onValueChange={(val) => setSemester(Number.parseInt(val))}>
                  <SelectTrigger id="semester">
                    <SelectValue placeholder="Chọn học kỳ" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map((s) => (
                      <SelectItem key={s} value={s.toString()}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="option">Tùy chọn</Label>
                <Select value={option} onValueChange={setOption}>
                  <SelectTrigger id="option">
                    <SelectValue placeholder="Chọn tùy chọn" />
                  </SelectTrigger>
                  <SelectContent>
                    {displayOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="week">Chọn tuần</Label>
                <Select value={week} onValueChange={setWeek}>
                  <SelectTrigger id="week">
                    <SelectValue placeholder="Chọn tuần" />
                  </SelectTrigger>
                  <SelectContent>
                    {weeks.map((w) => (
                      <SelectItem key={w} value={w}>
                        {w}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Nút và Toggle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <ToggleGroup type="single" value={view} onValueChange={(val) => val && setView(val as any)}>
                <ToggleGroupItem value="list">
                  <List className="h-4 w-4 mr-1" /> Danh sách
                </ToggleGroupItem>
                <ToggleGroupItem value="calendar">
                  <CalendarDays className="h-4 w-4 mr-1" /> Lịch
                </ToggleGroupItem>
              </ToggleGroup>

              <Button onClick={handleOpenAddDialog}>
                <Plus className="mr-2 h-4 w-4" /> Thêm lịch học
              </Button>
            </div>

            {/* Danh sách hoặc lịch */}
            {view === "list" ? (
              <div className="rounded-md border overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Môn học</TableHead>
                      <TableHead>Phòng học</TableHead>
                      <TableHead>Thứ</TableHead>
                      <TableHead>Tiết bắt đầu</TableHead>
                      <TableHead>Số tiết</TableHead>
                      <TableHead>Tuần áp dụng</TableHead>
                      <TableHead className="text-right">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length > 0 ? (
                      filteredData.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.tenMonHoc}</TableCell>
                          <TableCell>{item.tenPhong}</TableCell>
                          <TableCell>Thứ {item.thu}</TableCell>
                          <TableCell>{item.tietBatDau}</TableCell>
                          <TableCell>{item.soTiet}</TableCell>
                          <TableCell>{item.tuanIds.map((w) => w.replace("week", "Tuần ")).join(", ")}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                                <Pencil className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-500"
                                onClick={() => handleDelete(item)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Không có dữ liệu lịch học
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="h-[600px] rounded-md border p-4 bg-white">
                <FullCalendar
                  localizer={localizer}
                  events={events}
                  defaultView="week"
                  views={["week"]}
                  step={30}
                  timeslots={2}
                  min={new Date(2023, 1, 1, 6, 45)}
                  max={new Date(2023, 1, 1, 18, 0)}
                  style={{ height: "100%" }}
                  messages={{ week: "Tuần", day: "Ngày", agenda: "Lịch" }}
                  onSelectEvent={(event) => handleEdit(event.resource)}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialog thêm/sửa lịch học */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editMode ? "Cập nhật lịch học" : "Thêm lịch học mới"}</DialogTitle>
            <DialogDescription>
              {editMode ? "Chỉnh sửa thông tin lịch học hiện tại" : "Nhập thông tin chi tiết cho lịch học mới"}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tenMonHoc" className="text-right">
                Tên môn học
              </Label>
              <Input
                id="tenMonHoc"
                className="col-span-3"
                placeholder="Nhập tên môn học"
                value={form.tenMonHoc}
                onChange={(e) => setForm({ ...form, tenMonHoc: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tenPhong" className="text-right">
                Phòng học
              </Label>
              <Select value={form.tenPhong} onValueChange={(val) => setForm({ ...form, tenPhong: val })}>
                <SelectTrigger id="tenPhong" className="col-span-3">
                  <SelectValue placeholder="Chọn phòng học" />
                </SelectTrigger>
                <SelectContent>
                  {phongHocList.map((phong) => (
                    <SelectItem key={phong.value} value={phong.value}>
                      {phong.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="thu" className="text-right">
                Thứ
              </Label>
              <Select
                value={form.thu.toString()}
                onValueChange={(val) => setForm({ ...form, thu: Number.parseInt(val) })}
              >
                <SelectTrigger id="thu" className="col-span-3">
                  <SelectValue placeholder="Chọn thứ" />
                </SelectTrigger>
                <SelectContent>
                  {weekdays.map((day) => (
                    <SelectItem key={day.value} value={day.value.toString()}>
                      {day.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tietBatDau" className="text-right">
                Tiết bắt đầu
              </Label>
              <Select
                value={form.tietBatDau.toString()}
                onValueChange={(val) => setForm({ ...form, tietBatDau: Number.parseInt(val) })}
              >
                <SelectTrigger id="tietBatDau" className="col-span-3">
                  <SelectValue placeholder="Chọn tiết bắt đầu" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 10 }, (_, i) => (
                    <SelectItem key={i + 1} value={(i + 1).toString()}>
                      Tiết {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="soTiet" className="text-right">
                Số tiết
              </Label>
              <Select
                value={form.soTiet.toString()}
                onValueChange={(val) => setForm({ ...form, soTiet: Number.parseInt(val) })}
              >
                <SelectTrigger id="soTiet" className="col-span-3">
                  <SelectValue placeholder="Chọn số tiết" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} tiết
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="tuanIds" className="text-right pt-2">
                Tuần áp dụng
              </Label>
              <div className="col-span-3 border rounded-md p-2 h-40 overflow-y-auto">
                {Array.from({ length: 20 }, (_, i) => (
                  <div key={i + 1} className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      id={`week${i + 1}`}
                      checked={form.tuanIds.includes(`week${i + 1}`)}
                      onChange={(e) => {
                        const weekId = `week${i + 1}`
                        if (e.target.checked) {
                          setForm({ ...form, tuanIds: [...form.tuanIds, weekId] })
                        } else {
                          setForm({ ...form, tuanIds: form.tuanIds.filter((id) => id !== weekId) })
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor={`week${i + 1}`} className="text-sm">
                      Tuần {i + 1}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave}>{editMode ? "Cập nhật" : "Lưu"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa lịch học này không? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="py-4">
              <p>
                <strong>Môn học:</strong> {selectedItem.tenMonHoc}
              </p>
              <p>
                <strong>Phòng học:</strong> {selectedItem.tenPhong}
              </p>
              <p>
                <strong>Thời gian:</strong> Thứ {selectedItem.thu}, tiết {selectedItem.tietBatDau} -{" "}
                {selectedItem.tietBatDau + selectedItem.soTiet - 1}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
