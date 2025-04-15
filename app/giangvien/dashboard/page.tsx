"use client"

import { useEffect, useState } from "react"
import { BarChart, BookOpen, Calendar, Clock, GraduationCap, LayoutDashboard, Plus, Settings, Users } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { AppShell } from "@/components/app-shell"

export const navigation = [
  {
    title: "Tổng quan",
    href: "/giangvien/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Lớp học",
    href: "/giangvien/lop-hoc",
    icon: Users,
  },
  {
    title: "Lịch dạy",
    href: "/giangvien/lich-day",
    icon: Calendar,
  },
  {
    title: "Điểm danh",
    href: "/giangvien/diem-danh",
    icon: Clock,
  },
  {
    title: "Báo cáo",
    href: "/giangvien/bao-cao",
    icon: BarChart,
  },
  {
    title: "Cài đặt",
    href: "/giangvien/cai-dat",
    icon: Settings,
  },
]

type Class = {
  id: string
  name: string
  section: string
  students: number
  time: string
  room: string
  attendanceRate: number
}

type AtRiskStudent = {
  id: string
  name: string
  studentId: string
  attendanceRate: number
  lastAttendance: string
}

export default function GiangVienDashboardPage() {
  const [stats, setStats] = useState({
    classes: 0,
    students: 0,
    attendanceRate: 0,
    upcomingClasses: 0,
  })

  const [classes, setClasses] = useState<Class[]>([
    {
      id: "c1",
      name: "Nhập môn lập trình",
      section: "A",
      students: 35,
      time: "08:00 - 10:00",
      room: "A101",
      attendanceRate: 92,
    },
    {
      id: "c2",
      name: "Cấu trúc dữ liệu và giải thuật",
      section: "B",
      students: 30,
      time: "10:30 - 12:30",
      room: "A102",
      attendanceRate: 88,
    },
    {
      id: "c3",
      name: "Cơ sở dữ liệu",
      section: "C",
      students: 32,
      time: "13:30 - 15:30",
      room: "B101",
      attendanceRate: 85,
    },
  ])

  const [atRiskStudents, setAtRiskStudents] = useState<AtRiskStudent[]>([
    {
      id: "s1",
      name: "Nguyễn Văn A",
      studentId: "SV001",
      attendanceRate: 65,
      lastAttendance: "2023-04-05",
    },
    {
      id: "s2",
      name: "Trần Thị B",
      studentId: "SV002",
      attendanceRate: 60,
      lastAttendance: "2023-04-03",
    },
    {
      id: "s3",
      name: "Lê Văn C",
      studentId: "SV003",
      attendanceRate: 55,
      lastAttendance: "2023-04-01",
    },
  ])

  const [isAddClassDialogOpen, setIsAddClassDialogOpen] = useState(false)
  const [isEditClassDialogOpen, setIsEditClassDialogOpen] = useState(false)
  const [isDeleteClassDialogOpen, setIsDeleteClassDialogOpen] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Class | null>(null)
  const [newClass, setNewClass] = useState<Partial<Class>>({
    name: "",
    section: "",
    students: 0,
    time: "",
    room: "",
    attendanceRate: 0,
  })

  const { toast } = useToast()

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats({
        classes: classes.length,
        students: classes.reduce((acc, cls) => acc + cls.students, 0),
        attendanceRate: Math.round(
          classes.reduce((acc, cls) => acc + cls.attendanceRate, 0) / Math.max(classes.length, 1)
        ),
        upcomingClasses: classes.length,
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [classes])

  const handleAddClass = () => {
    setNewClass({
      name: "",
      section: "",
      students: 0,
      time: "",
      room: "",
      attendanceRate: 0,
    })
    setIsAddClassDialogOpen(true)
  }

  const handleEditClass = (cls: Class) => {
    setSelectedClass(cls)
    setNewClass({ ...cls })
    setIsEditClassDialogOpen(true)
  }

  const handleDeleteClass = (cls: Class) => {
    setSelectedClass(cls)
    setIsDeleteClassDialogOpen(true)
  }

  const handleSaveAddClass = () => {
    if (!newClass.name || !newClass.section || !newClass.time || !newClass.room) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin lớp học.",
      })
      return
    }

    const newClassItem: Class = {
      id: `c${classes.length + 1}`,
      name: newClass.name!,
      section: newClass.section!,
      students: newClass.students || 0,
      time: newClass.time!,
      room: newClass.room!,
      attendanceRate: newClass.attendanceRate || 0,
    }

    setClasses([...classes, newClassItem])
    setIsAddClassDialogOpen(false)
    toast({
      title: "Thêm lớp học thành công",
      description: `Đã thêm lớp học: ${newClassItem.name} - Nhóm ${newClassItem.section}`,
    })
  }

  const handleSaveEditClass = () => {
    if (!selectedClass || !newClass.name || !newClass.section || !newClass.time || !newClass.room) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin lớp học.",
      })
      return
    }

    const updatedClasses = classes.map((cls) =>
      cls.id === selectedClass.id
        ? {
            ...cls,
            name: newClass.name!,
            section: newClass.section!,
            students: newClass.students || cls.students,
            time: newClass.time!,
            room: newClass.room!,
            attendanceRate: newClass.attendanceRate || cls.attendanceRate,
          }
        : cls
    )

    setClasses(updatedClasses)
    setIsEditClassDialogOpen(false)
    toast({
      title: "Cập nhật lớp học thành công",
      description: `Đã cập nhật lớp học: ${newClass.name} - Nhóm ${newClass.section}`,
    })
  }

  const handleConfirmDeleteClass = () => {
    if (!selectedClass) return

    const updatedClasses = classes.filter((cls) => cls.id !== selectedClass.id)
    setClasses(updatedClasses)
    setIsDeleteClassDialogOpen(false)
    toast({
      title: "Xóa lớp học thành công",
      description: `Đã xóa lớp học: ${selectedClass.name} - Nhóm ${selectedClass.section}`,
    })
  }

  const handleAddAtRiskNote = (student: AtRiskStudent) => {
    toast({
      title: "Đã thêm ghi chú",
      description: `Đã thêm ghi chú cho sinh viên: ${student.name}`,
    })
  }

  const handleContactAtRiskStudent = (student: AtRiskStudent) => {
    toast({
      title: "Đã gửi thông báo",
      description: `Đã gửi thông báo cho sinh viên: ${student.name}`,
    })
  }

  return (
    <AppShell navigation={navigation}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Tổng quan giảng viên</h1>
          <p className="text-muted-foreground">
            Chào mừng đến với trang tổng quan. Dưới đây là thông tin về các lớp học và sinh viên của bạn.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lớp học đang dạy</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.classes}</div>
              <p className="text-xs text-muted-foreground">Học kỳ hiện tại</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng số sinh viên</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.students}</div>
              <p className="text-xs text-muted-foreground">Trong tất cả các lớp học</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tỷ lệ điểm danh</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
              <p className="text-xs text-muted-foreground">Trung bình tất cả các lớp</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lớp học sắp tới</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingClasses}</div>
              <p className="text-xs text-muted-foreground">Trong 24 giờ tới</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="schedule" className="space-y-4">
          <TabsList>
            <TabsTrigger value="schedule">Lịch dạy hôm nay</TabsTrigger>
            <TabsTrigger value="students">Sinh viên cần chú ý</TabsTrigger>
            <TabsTrigger value="attendance">Tổng quan điểm danh</TabsTrigger>
          </TabsList>
          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Lớp học hôm nay</CardTitle>
                  <CardDescription>Lịch dạy của bạn cho hôm nay</CardDescription>
                </div>
                <Button onClick={handleAddClass} className="bg-primary hover:bg-primary/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm lớp học
                </Button>
              </CardHeader>
              <CardContent>
                {classes.length > 0 ? (
                  <div className="space-y-4">
                    {classes.map((cls) => (
                      <div key={cls.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="space-y-1">
                          <p className="font-medium">{cls.name}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{cls.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <GraduationCap className="h-4 w-4" />
                            <span>Nhóm {cls.section} - {cls.students} sinh viên</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                            Phòng {cls.room}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEditClass(cls)}>
                              Sửa
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDeleteClass(cls)}>
                              Xóa
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-[200px] items-center justify-center">
                    <p className="text-muted-foreground">Không có lớp học nào được lên lịch cho hôm nay</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sinh viên cần chú ý</CardTitle>
                <CardDescription>Sinh viên có tỷ lệ điểm danh dưới 70%</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {atRiskStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">MSSV: {student.studentId}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                          {student.attendanceRate}% Điểm danh
                        </div>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm" onClick={() => handleAddAtRiskNote(student)}>
                            Thêm ghi chú
                          </Button>
                          <Button variant="outline" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => handleContactAtRiskStudent(student)}>
                            Liên hệ
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Tổng quan điểm danh</CardTitle>
                <CardDescription>Tỷ lệ điểm danh trong các lớp học của bạn</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <BarChart className="h-16 w-16 text-muted-foreground" />
                <p className="ml-4 text-muted-foreground">Biểu đồ điểm danh sẽ được hiển thị ở đây</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Xem báo cáo chi tiết</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Dialog thêm lớp học */}
      <Dialog open={isAddClassDialogOpen} onOpenChange={setIsAddClassDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thêm lớp học mới</DialogTitle>
            <DialogDescription>Nhập thông tin chi tiết cho lớp học mới.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="className" className="text-right">
                Tên lớp học
              </Label>
              <Input
                id="className"
                value={newClass.name || ""}
                onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="section" className="text-right">
                Nhóm
              </Label>
              <Input
                id="section"
                value={newClass.section || ""}
                onChange={(e) => setNewClass({ ...newClass, section: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="students" className="text-right">
                Số sinh viên
              </Label>
              <Input
                id="students"
                type="number"
                value={newClass.students || ""}
                onChange={(e) => setNewClass({ ...newClass, students: parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Thời gian
              </Label>
              <Input
                id="time"
                value={newClass.time || ""}
                onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
                placeholder="VD: 08:00 - 10:00"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room" className="text-right">
                Phòng học
              </Label>
              <Input
                id="room"
                value={newClass.room || ""}
                onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddClassDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveAddClass} className="bg-primary hover:bg-primary/90">
              Thêm lớp học
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa lớp học */}
      <Dialog open={isEditClassDialogOpen} onOpenChange={setIsEditClassDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa lớp học</DialogTitle>
            <DialogDescription>Cập nhật thông tin chi tiết cho lớp học.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editClassName" className="text-right">
                Tên lớp học
              </Label>
              <Input
                id="editClassName"
                value={newClass.name || ""}
                onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editSection" className="text-right">
                Nhóm
              </Label>
              <Input
                id="editSection"
                value={newClass.section || ""}
                onChange={(e) => setNewClass({ ...newClass, section: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editStudents" className="text-right">
                Số sinh viên
              </Label>
              <Input
                id="editStudents"
                type="number"
                value={newClass.students || ""}
                onChange={(e) => setNewClass({ ...newClass, students: parseInt(e.target.value) || 0 })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editTime" className="text-right">
                Thời gian
              </Label>
              <Input
                id="editTime"
                value={newClass.time || ""}
                onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
                placeholder="VD: 08:00 - 10:00"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editRoom" className="text-right">
                Phòng học
              </Label>
              <Input
                id="editRoom"
                value={newClass.room || ""}
                onChange={(e) => setNewClass({ ...newClass, room: e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditClassDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveEditClass} className="bg-primary hover:bg-primary/90">
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={isDeleteClassDialogOpen} onOpenChange={setIsDeleteClassDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn xóa lớp học này không?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedClass && (
              <p>
                Bạn đang xóa lớp học: <strong>{selectedClass.name}</strong> - Nhóm {selectedClass.section}
              </p>
            )}
            <p className="mt-2 text-sm text-red-500">Lưu ý: Hành động này không thể hoàn tác.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteClassDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleConfirmDeleteClass}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
