"use client"

import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Activity, AlarmClock, Bell, BookMarked, BookOpen, Building2, Calendar, Camera, Check, ClipboardList, Download, Eye, FileWarning, Filter, FolderOpen, GraduationCap, ImageIcon, Layers3, LayoutDashboard, Loader2, RefreshCw, School, Search, Settings, UserCheck, UserCog, Users } from "lucide-react"
import { ChevronDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { AppShell } from "@/components/app-shell"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CustomDatePicker } from "@/components/ui/custom-date-picker"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

import { diemDanhData } from "@/lib/data/diemdanh-data"
import { sinhVienData } from "@/lib/data/sinhvien-data"
import { khoaData } from "@/lib/data/khoa-data"

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
      icon: Camera,
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

// Dữ liệu mẫu cho biểu đồ
const attendanceByMonth = [
  { name: "T1", "Có mặt": 85, Vắng: 15, Trễ: 5 },
  { name: "T2", "Có mặt": 82, Vắng: 10, Trễ: 8 },
  { name: "T3", "Có mặt": 78, Vắng: 12, Trễ: 10 },
  { name: "T4", "Có mặt": 80, Vắng: 15, Trễ: 5 },
  { name: "T5", "Có mặt": 85, Vắng: 10, Trễ: 5 },
  { name: "T6", "Có mặt": 90, Vắng: 5, Trễ: 5 },
  { name: "T7", "Có mặt": 88, Vắng: 7, Trễ: 5 },
  { name: "T8", "Có mặt": 86, Vắng: 9, Trễ: 5 },
  { name: "T9", "Có mặt": 84, Vắng: 11, Trễ: 5 },
  { name: "T10", "Có mặt": 87, Vắng: 8, Trễ: 5 },
  { name: "T11", "Có mặt": 89, Vắng: 6, Trễ: 5 },
  { name: "T12", "Có mặt": 91, Vắng: 4, Trễ: 5 },
]

const studentsByFaculty = [
  { name: "CNTT", value: 450 },
  { name: "Kinh tế", value: 380 },
  { name: "Ngoại ngữ", value: 300 },
  { name: "Cơ khí", value: 250 },
  { name: "Điện tử", value: 220 },
  { name: "Xây dựng", value: 180 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

const attendanceStatus = [
  { name: "Có mặt", value: 75 },
  { name: "Vắng", value: 15 },
  { name: "Trễ", value: 10 },
]

const STATUS_COLORS = {
  "Có mặt": "#10B981",
  Vắng: "#EF4444",
  Trễ: "#F59E0B",
}

export default function ThongKePage() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date(new Date().setMonth(new Date().getMonth() - 1)))
  const [endDate, setEndDate] = useState<Date | undefined>(new Date())
  const [selectedKhoa, setSelectedKhoa] = useState<string>("all")
  const [selectedNganh, setSelectedNganh] = useState<string>("all")
  const [selectedLop, setSelectedLop] = useState<string>("all")
  const [stats, setStats] = useState({
    totalStudents: 0,
    attendanceRate: 0,
    absentRate: 0,
    lateRate: 0,
    biometricRegistered: 0,
  })

  // Tính toán thống kê từ dữ liệu
  useEffect(() => {
    // Giả lập tải dữ liệu và tính toán thống kê
    const totalStudents = sinhVienData.length

    // Tính tỷ lệ điểm danh
    const attendanceCount = diemDanhData.filter((d) => d.trangThai === "Có mặt").length
    const absentCount = diemDanhData.filter((d) => d.trangThai === "Vắng").length
    const lateCount = diemDanhData.filter((d) => d.trangThai === "Trễ").length
    const totalAttendance = attendanceCount + absentCount + lateCount

    // Giả định số sinh viên đã đăng ký sinh trắc học
    const biometricRegistered = Math.floor(totalStudents * 0.85)

    setStats({
      totalStudents,
      attendanceRate: (attendanceCount / totalAttendance) * 100,
      absentRate: (absentCount / totalAttendance) * 100,
      lateRate: (lateCount / totalAttendance) * 100,
      biometricRegistered,
    })
  }, [])

  // Tính toán thống kê điểm danh theo khoa
  const getAttendanceByFaculty = () => {
    return khoaData.map((khoa) => {
      // Giả lập dữ liệu điểm danh theo khoa
      const present = Math.floor(Math.random() * 30) + 60 // 60-90%
      const absent = Math.floor(Math.random() * 15) + 5 // 5-20%
      const late = 100 - present - absent

      return {
        name: khoa.tenKhoa,
        "Có mặt": present,
        Vắng: absent,
        Trễ: late,
      }
    })
  }

  return (
    <AppShell navigation={navigation}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Thống kê</h1>
          <p className="text-muted-foreground">Xem thống kê chi tiết về điểm danh và hoạt động của sinh viên.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="flex gap-2 items-center">
              <CustomDatePicker date={startDate} setDate={setStartDate} placeholder="Từ ngày" />
              <span className="text-muted-foreground">-</span>
              <CustomDatePicker date={endDate} setDate={setEndDate} placeholder="Đến ngày" />
            </div>

            <Select value={selectedKhoa} onValueChange={setSelectedKhoa}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Chọn khoa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả khoa</SelectItem>
                {khoaData.map((khoa) => (
                  <SelectItem key={khoa.maKhoa} value={khoa.maKhoa}>
                    {khoa.tenKhoa}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Bộ lọc
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuItem onClick={() => setSelectedKhoa("all")}>Tất cả khoa</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedNganh("all")}>Tất cả ngành</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedLop("all")}>Tất cả lớp</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Xuất báo cáo
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng số sinh viên</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Sinh viên đang hoạt động</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tỷ lệ đi học</CardTitle>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {stats.attendanceRate.toFixed(1)}%
              </Badge>
            </CardHeader>
            <CardContent>
              <Progress value={stats.attendanceRate} className="h-2 bg-muted">
                <div className="h-full bg-green-500" />
              </Progress>
              <p className="mt-2 text-xs text-muted-foreground">Tỷ lệ sinh viên có mặt</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tỷ lệ vắng mặt</CardTitle>
              <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                {stats.absentRate.toFixed(1)}%
              </Badge>
            </CardHeader>
            <CardContent>
              <Progress value={stats.absentRate} className="h-2 bg-muted">
                <div className="h-full bg-red-500" />
              </Progress>
              <p className="mt-2 text-xs text-muted-foreground">Tỷ lệ sinh viên vắng mặt</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sinh trắc học</CardTitle>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {((stats.biometricRegistered / stats.totalStudents) * 100).toFixed(1)}%
              </Badge>
            </CardHeader>
            <CardContent>
              <Progress
                value={(stats.biometricRegistered / stats.totalStudents) * 100}
                className="h-2 bg-muted"
              >
                <div className="h-full bg-blue-500" />
              </Progress>
              <p className="mt-2 text-xs text-muted-foreground">{stats.biometricRegistered} sinh viên đã đăng ký</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="attendance" className="space-y-4">
          <TabsList>
            <TabsTrigger value="attendance">Điểm danh</TabsTrigger>
            <TabsTrigger value="students">Sinh viên</TabsTrigger>
            <TabsTrigger value="biometric">Sinh trắc học</TabsTrigger>
          </TabsList>

          <TabsContent value="attendance" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle>Thống kê điểm danh theo tháng</CardTitle>
                  <CardDescription>Tỷ lệ điểm danh của sinh viên theo từng tháng trong năm</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={attendanceByMonth}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Có mặt" stackId="a" fill="#10B981" />
                        <Bar dataKey="Vắng" stackId="a" fill="#EF4444" />
                        <Bar dataKey="Trễ" stackId="a" fill="#F59E0B" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trạng thái điểm danh</CardTitle>
                  <CardDescription>Phân bố trạng thái điểm danh của sinh viên</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={attendanceStatus}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {attendanceStatus.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={STATUS_COLORS[entry.name as keyof typeof STATUS_COLORS]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Điểm danh theo khoa</CardTitle>
                  <CardDescription>So sánh tỷ lệ điểm danh giữa các khoa</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={getAttendanceByFaculty()}
                        layout="vertical"
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={100} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Có mặt" stackId="a" fill="#10B981" />
                        <Bar dataKey="Vắng" stackId="a" fill="#EF4444" />
                        <Bar dataKey="Trễ" stackId="a" fill="#F59E0B" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="students" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Phân bố sinh viên theo khoa</CardTitle>
                  <CardDescription>Số lượng sinh viên trong từng khoa</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={studentsByFaculty}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ${value}`}
                        >
                          {studentsByFaculty.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Xu hướng nhập học</CardTitle>
                  <CardDescription>Số lượng sinh viên nhập học theo năm</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={[
                          { year: "2018", students: 850 },
                          { year: "2019", students: 940 },
                          { year: "2020", students: 1050 },
                          { year: "2021", students: 1150 },
                          { year: "2022", students: 1250 },
                          { year: "2023", students: 1380 },
                        ]}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="students"
                          stroke="#8884d8"
                          activeDot={{ r: 8 }}
                          name="Sinh viên"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="biometric" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Tình trạng đăng ký sinh trắc học</CardTitle>
                  <CardDescription>Tỷ lệ sinh viên đã đăng ký sinh trắc học</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Đã đăng ký", value: stats.biometricRegistered },
                            { name: "Chưa đăng ký", value: stats.totalStudents - stats.biometricRegistered },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#3B82F6" />
                          <Cell fill="#9CA3AF" />
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tiến độ đăng ký theo khoa</CardTitle>
                  <CardDescription>Tỷ lệ sinh viên đã đăng ký sinh trắc học theo khoa</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {khoaData.map((khoa, index) => {
                      // Giả lập dữ liệu tiến độ đăng ký sinh trắc học theo khoa
                      const progress = Math.floor(Math.random() * 30) + 70 // 70-100%

                      return (
                        <div key={khoa.maKhoa} className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{khoa.tenKhoa}</span>
                            <span className="text-sm text-muted-foreground">{progress}%</span>
                          </div>
                          <Progress value={progress} className="h-2">
                            <div className="h-full bg-blue-500" />
                          </Progress>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Hiệu quả nhận diện sinh trắc học</CardTitle>
                <CardDescription>Tỷ lệ nhận diện thành công theo thời gian</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: "T1", success: 92, failed: 8 },
                        { month: "T2", success: 93, failed: 7 },
                        { month: "T3", success: 94, failed: 6 },
                        { month: "T4", success: 95, failed: 5 },
                        { month: "T5", success: 96, failed: 4 },
                        { month: "T6", success: 97, failed: 3 },
                      ]}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="success"
                        stroke="#10B981"
                        activeDot={{ r: 8 }}
                        name="Nhận diện thành công"
                      />
                      <Line type="monotone" dataKey="failed" stroke="#EF4444" name="Nhận diện thất bại" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
              <CardFooter>
                <p className="text-sm text-muted-foreground">
                  Tỷ lệ nhận diện thành công đang tăng dần theo thời gian khi hệ thống được cải thiện.
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
