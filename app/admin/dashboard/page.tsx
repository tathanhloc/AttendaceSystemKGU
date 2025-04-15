"use client"

import { useEffect, useState } from "react"
import { BarChart, BookOpen, Calendar, GraduationCap, LayoutDashboard, School, Settings, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppShell } from "@/components/app-shell"

import {

  Building2,
  UserCheck,
  UserCog,
  ClipboardList,
  AlarmClock,
  Camera,
  BookMarked,
  Layers3,
  FileWarning,
  Activity,
  Bell,
  FolderOpen,
} from "lucide-react"

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

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    sinhVien: 0,
    giangVien: 0,
    monHoc: 0,
    khoa: 0,
  })

  useEffect(() => {
    // Giả lập tải dữ liệu
    const timer = setTimeout(() => {
      setStats({
        sinhVien: 1250,
        giangVien: 75,
        monHoc: 120,
        khoa: 8,
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AppShell navigation={navigation}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Tổng quan</h1>
          <p className="text-muted-foreground">
            Chào mừng đến với trang quản trị. Dưới đây là tổng quan về trường của bạn.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng số sinh viên</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sinhVien.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+12% so với học kỳ trước</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng số giảng viên</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.giangVien.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+4% so với học kỳ trước</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Môn học đang mở</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.monHoc.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+8% so với học kỳ trước</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Khoa</CardTitle>
              <School className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.khoa.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+2 khoa mới</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
            <TabsTrigger value="analytics">Phân tích</TabsTrigger>
            <TabsTrigger value="reports">Báo cáo</TabsTrigger>
            <TabsTrigger value="notifications">Thông báo</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Tổng quan điểm danh</CardTitle>
                  <CardDescription>Tỷ lệ điểm danh của sinh viên theo khoa</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px] flex items-center justify-center">
                    <BarChart className="h-16 w-16 text-muted-foreground" />
                    <p className="ml-4 text-muted-foreground">Biểu đồ điểm danh sẽ được hiển thị ở đây</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Hoạt động gần đây</CardTitle>
                  <CardDescription>Các hoạt động mới nhất trong hệ thống</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">Người dùng mới đã đăng ký</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(Date.now() - i * 3600000).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Phân tích</CardTitle>
                <CardDescription>Phân tích chi tiết sẽ được hiển thị ở đây</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <BarChart className="h-16 w-16 text-muted-foreground" />
                <p className="ml-4 text-muted-foreground">Biểu đồ phân tích sẽ được hiển thị ở đây</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Báo cáo</CardTitle>
                <CardDescription>Báo cáo hệ thống sẽ được hiển thị ở đây</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Không có báo cáo nào vào lúc này</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Thông báo</CardTitle>
                <CardDescription>Thông báo hệ thống sẽ được hiển thị ở đây</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Không có thông báo mới vào lúc này</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
