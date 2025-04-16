"use client"

import { useState } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { AlertCircle, ArrowDownUp, Calendar, ChevronDown, Download, Filter, Info, RefreshCw, Search, Shield, User } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomDatePicker } from "@/components/ui/custom-date-picker"

// Dữ liệu mẫu cho nhật ký hệ thống
const systemLogs = [
  {
    id: "log-001",
    timestamp: new Date(2023, 5, 15, 8, 30, 0),
    user: "admin@abc.edu.vn",
    action: "Đăng nhập",
    module: "Xác thực",
    ipAddress: "192.168.1.100",
    details: "Đăng nhập thành công",
    level: "info",
  },
  {
    id: "log-002",
    timestamp: new Date(2023, 5, 15, 9, 15, 0),
    user: "admin@abc.edu.vn",
    action: "Thêm sinh viên",
    module: "Quản lý sinh viên",
    ipAddress: "192.168.1.100",
    details: "Thêm sinh viên mới: Nguyễn Văn A",
    level: "info",
  },
  {
    id: "log-003",
    timestamp: new Date(2023, 5, 15, 10, 5, 0),
    user: "giangvien@abc.edu.vn",
    action: "Điểm danh",
    module: "Điểm danh",
    ipAddress: "192.168.1.101",
    details: "Điểm danh lớp CNTT001",
    level: "info",
  },
  {
    id: "log-004",
    timestamp: new Date(2023, 5, 15, 11, 0, 0),
    user: "system",
    action: "Sao lưu dữ liệu",
    module: "Hệ thống",
    ipAddress: "localhost",
    details: "Sao lưu dữ liệu tự động hoàn tất",
    level: "info",
  },
  {
    id: "log-005",
    timestamp: new Date(2023, 5, 15, 13, 45, 0),
    user: "sinhvien@abc.edu.vn",
    action: "Đăng nhập thất bại",
    module: "Xác thực",
    ipAddress: "192.168.1.150",
    details: "Mật khẩu không chính xác",
    level: "warning",
  },
  {
    id: "log-006",
    timestamp: new Date(2023, 5, 15, 14, 30, 0),
    user: "unknown",
    action: "Truy cập trái phép",
    module: "Bảo mật",
    ipAddress: "203.0.113.42",
    details: "Phát hiện nỗ lực truy cập trái phép vào hệ thống",
    level: "error",
  },
  {
    id: "log-007",
    timestamp: new Date(2023, 5, 15, 15, 20, 0),
    user: "admin@abc.edu.vn",
    action: "Cập nhật cài đặt",
    module: "Cài đặt hệ thống",
    ipAddress: "192.168.1.100",
    details: "Cập nhật cài đặt email",
    level: "info",
  },
  {
    id: "log-008",
    timestamp: new Date(2023, 5, 15, 16, 10, 0),
    user: "system",
    action: "Lỗi kết nối",
    module: "Cơ sở dữ liệu",
    ipAddress: "localhost",
    details: "Mất kết nối tạm thời đến cơ sở dữ liệu",
    level: "error",
  },
  {
    id: "log-009",
    timestamp: new Date(2023, 5, 15, 16, 15, 0),
    user: "system",
    action: "Khôi phục kết nối",
    module: "Cơ sở dữ liệu",
    ipAddress: "localhost",
    details: "Kết nối đến cơ sở dữ liệu đã được khôi phục",
    level: "info",
  },
  {
    id: "log-010",
    timestamp: new Date(2023, 5, 15, 17, 0, 0),
    user: "giangvien@abc.edu.vn",
    action: "Đăng xuất",
    module: "Xác thực",
    ipAddress: "192.168.1.101",
    details: "Đăng xuất thành công",
    level: "info",
  },
]

// Dữ liệu mẫu cho nhật ký truy cập
const accessLogs = [
  {
    id: "access-001",
    timestamp: new Date(2023, 5, 15, 8, 30, 0),
    user: "admin@abc.edu.vn",
    userType: "Admin",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    action: "Đăng nhập",
    status: "success",
  },
  {
    id: "access-002",
    timestamp: new Date(2023, 5, 15, 9, 0, 0),
    user: "giangvien@abc.edu.vn",
    userType: "Giảng viên",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    action: "Đăng nhập",
    status: "success",
  },
  {
    id: "access-003",
    timestamp: new Date(2023, 5, 15, 9, 15, 0),
    user: "sinhvien@abc.edu.vn",
    userType: "Sinh viên",
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)",
    action: "Đăng nhập",
    status: "success",
  },
  {
    id: "access-004",
    timestamp: new Date(2023, 5, 15, 10, 0, 0),
    user: "unknown@example.com",
    userType: "Unknown",
    ipAddress: "203.0.113.42",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    action: "Đăng nhập",
    status: "failed",
  },
  {
    id: "access-005",
    timestamp: new Date(2023, 5, 15, 11, 30, 0),
    user: "sinhvien@abc.edu.vn",
    userType: "Sinh viên",
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1)",
    action: "Đăng xuất",
    status: "success",
  },
  {
    id: "access-006",
    timestamp: new Date(2023, 5, 15, 12, 0, 0),
    user: "giangvien@abc.edu.vn",
    userType: "Giảng viên",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    action: "Đăng xuất",
    status: "success",
  },
  {
    id: "access-007",
    timestamp: new Date(2023, 5, 15, 13, 0, 0),
    user: "sinhvien2@abc.edu.vn",
    userType: "Sinh viên",
    ipAddress: "192.168.1.103",
    userAgent: "Mozilla/5.0 (Android 11; Mobile)",
    action: "Đăng nhập",
    status: "success",
  },
  {
    id: "access-008",
    timestamp: new Date(2023, 5, 15, 14, 0, 0),
    user: "unknown@example.com",
    userType: "Unknown",
    ipAddress: "203.0.113.50",
    userAgent: "Mozilla/5.0 (Linux; Android 10)",
    action: "Đăng nhập",
    status: "failed",
  },
  {
    id: "access-009",
    timestamp: new Date(2023, 5, 15, 15, 0, 0),
    user: "admin@abc.edu.vn",
    userType: "Admin",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    action: "Đăng xuất",
    status: "success",
  },
  {
    id: "access-010",
    timestamp: new Date(2023, 5, 15, 16, 0, 0),
    user: "sinhvien2@abc.edu.vn",
    userType: "Sinh viên",
    ipAddress: "192.168.1.103",
    userAgent: "Mozilla/5.0 (Android 11; Mobile)",
    action: "Đăng xuất",
    status: "success",
  },
]

// Dữ liệu mẫu cho nhật ký thay đổi
const changeLogs = [
  {
    id: "change-001",
    timestamp: new Date(2023, 5, 15, 9, 15, 0),
    user: "admin@abc.edu.vn",
    module: "Quản lý sinh viên",
    action: "Thêm",
    entity: "Sinh viên",
    entityId: "SV001",
    details: "Thêm sinh viên mới: Nguyễn Văn A",
  },
  {
    id: "change-002",
    timestamp: new Date(2023, 5, 15, 9, 30, 0),
    user: "admin@abc.edu.vn",
    module: "Quản lý sinh viên",
    action: "Cập nhật",
    entity: "Sinh viên",
    entityId: "SV001",
    details: "Cập nhật thông tin liên hệ",
  },
  {
    id: "change-003",
    timestamp: new Date(2023, 5, 15, 10, 0, 0),
    user: "admin@abc.edu.vn",
    module: "Quản lý giảng viên",
    action: "Thêm",
    entity: "Giảng viên",
    entityId: "GV001",
    details: "Thêm giảng viên mới: Trần Thị B",
  },
  {
    id: "change-004",
    timestamp: new Date(2023, 5, 15, 10, 45, 0),
    user: "admin@abc.edu.vn",
    module: "Quản lý lớp học",
    action: "Thêm",
    entity: "Lớp học",
    entityId: "LH001",
    details: "Thêm lớp học mới: CNTT001",
  },
  {
    id: "change-005",
    timestamp: new Date(2023, 5, 15, 11, 15, 0),
    user: "admin@abc.edu.vn",
    module: "Quản lý lớp học",
    action: "Cập nhật",
    entity: "Lớp học",
    entityId: "LH001",
    details: "Thêm sinh viên vào lớp",
  },
  {
    id: "change-006",
    timestamp: new Date(2023, 5, 15, 13, 0, 0),
    user: "admin@abc.edu.vn",
    module: "Quản lý môn học",
    action: "Thêm",
    entity: "Môn học",
    entityId: "MH001",
    details: "Thêm môn học mới: Lập trình web",
  },
  {
    id: "change-007",
    timestamp: new Date(2023, 5, 15, 14, 0, 0),
    user: "admin@abc.edu.vn",
    module: "Quản lý lịch học",
    action: "Thêm",
    entity: "Lịch học",
    entityId: "LCH001",
    details: "Thêm lịch học mới cho lớp CNTT001",
  },
  {
    id: "change-008",
    timestamp: new Date(2023, 5, 15, 15, 0, 0),
    user: "giangvien@abc.edu.vn",
    module: "Điểm danh",
    action: "Thêm",
    entity: "Điểm danh",
    entityId: "DD001",
    details: "Tạo phiên điểm danh mới cho lớp CNTT001",
  },
  {
    id: "change-009",
    timestamp: new Date(2023, 5, 15, 15, 30, 0),
    user: "giangvien@abc.edu.vn",
    module: "Điểm danh",
    action: "Cập nhật",
    entity: "Điểm danh",
    entityId: "DD001",
    details: "Cập nhật trạng thái điểm danh cho sinh viên",
  },
  {
    id: "change-010",
    timestamp: new Date(2023, 5, 15, 16, 0, 0),
    user: "admin@abc.edu.vn",
    module: "Cài đặt",
    action: "Cập nhật",
    entity: "Cài đặt hệ thống",
    entityId: "SET001",
    details: "Cập nhật cài đặt email",
  },
]

// Hàm hiển thị badge cho level
function getLevelBadge(level: string) {
  switch (level) {
    case "info":
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Thông tin</Badge>
    case "warning":
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Cảnh báo</Badge>
    case "error":
      return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Lỗi</Badge>
    default:
      return <Badge variant="outline">Không xác định</Badge>
  }
}

// Hàm hiển thị badge cho status
function getStatusBadge(status: string) {
  switch (status) {
    case "success":
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Thành công</Badge>
    case "failed":
      return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Thất bại</Badge>
    default:
      return <Badge variant="outline">Không xác định</Badge>
  }
}

// Hàm hiển thị badge cho action
function getActionBadge(action: string) {
  switch (action) {
    case "Thêm":
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Thêm</Badge>
    case "Cập nhật":
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Cập nhật</Badge>
    case "Xóa":
      return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Xóa</Badge>
    default:
      return <Badge variant="outline">{action}</Badge>
  }
}

export default function SystemLogPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedModule, setSelectedModule] = useState("all")
  const [selectedAction, setSelectedAction] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedUserType, setSelectedUserType] = useState("all")

  // Hàm refresh dữ liệu
  const refreshData = () => {
    setIsLoading(true)
    // Giả lập API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  // Hàm lọc dữ liệu nhật ký hệ thống
  const filteredSystemLogs = systemLogs.filter((log) => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesLevel = selectedLevel === "all" || log.level === selectedLevel
    const matchesModule = selectedModule === "all" || log.module === selectedModule
    const matchesAction = selectedAction === "all" || log.action === selectedAction
    
    const matchesDate = !selectedDate || 
      (log.timestamp.getDate() === selectedDate.getDate() &&
       log.timestamp.getMonth() === selectedDate.getMonth() &&
       log.timestamp.getFullYear() === selectedDate.getFullYear())
    
    return matchesSearch && matchesLevel && matchesModule && matchesAction && matchesDate
  })

  // Hàm lọc dữ liệu nhật ký truy cập
  const filteredAccessLogs = accessLogs.filter((log) => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userAgent.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === "all" || log.status === selectedStatus
    const matchesUserType = selectedUserType === "all" || log.userType === selectedUserType
    const matchesAction = selectedAction === "all" || log.action === selectedAction
    
    const matchesDate = !selectedDate || 
      (log.timestamp.getDate() === selectedDate.getDate() &&
       log.timestamp.getMonth() === selectedDate.getMonth() &&
       log.timestamp.getFullYear() === selectedDate.getFullYear())
    
    return matchesSearch && matchesStatus && matchesUserType && matchesAction && matchesDate
  })

  // Hàm lọc dữ liệu nhật ký thay đổi
  const filteredChangeLogs = changeLogs.filter((log) => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesModule = selectedModule === "all" || log.module === selectedModule
    const matchesAction = selectedAction === "all" || log.action === selectedAction
    
    const matchesDate = !selectedDate || 
      (log.timestamp.getDate() === selectedDate.getDate() &&
       log.timestamp.getMonth() === selectedDate.getMonth() &&
       log.timestamp.getFullYear() === selectedDate.getFullYear())
    
    return matchesSearch && matchesModule && matchesAction && matchesDate
  })

  // Danh sách các module
  const modules = Array.from(new Set(systemLogs.map(log => log.module)))
  
  // Danh sách các action
  const actions = Array.from(new Set([
    ...systemLogs.map(log => log.action),
    ...accessLogs.map(log => log.action),
    ...changeLogs.map(log => log.action)
  ]))

  // Hàm xuất dữ liệu
  const exportData = () => {
    alert("Xuất dữ liệu nhật ký")
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nhật ký hệ thống</h1>
          <p className="text-muted-foreground">
            Xem và quản lý các nhật ký hoạt động của hệ thống.
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Bộ lọc</CardTitle>
          <CardDescription>
            Lọc nhật ký theo các tiêu chí khác nhau.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <CustomDatePicker
                date={selectedDate}
                setDate={setSelectedDate}
                placeholder="Chọn ngày"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={refreshData}
                disabled={isLoading}
              >
                {isLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Làm mới
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={exportData}
              >
                <Download className="h-4 w-4 mr-2" />
                Xuất dữ liệu
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="system" className="space-y-4">
        <TabsList>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Nhật ký hệ thống</span>
          </TabsTrigger>
          <TabsTrigger value="access" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Nhật ký truy cập</span>
          </TabsTrigger>
          <TabsTrigger value="changes" className="flex items-center gap-2">
            <ArrowDownUp className="h-4 w-4" />
            <span>Nhật ký thay đổi</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Nhật ký hệ thống */}
        <TabsContent value="system">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Nhật ký hệ thống</CardTitle>
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Filter className="h-3.5 w-3.5" />
                        <span>Mức độ</span>
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedLevel("all")}>
                        Tất cả
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedLevel("info")}>
                        Thông tin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedLevel("warning")}>
                        Cảnh báo
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedLevel("error")}>
                        Lỗi
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Filter className="h-3.5 w-3.5" />
                        <span>Module</span>
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedModule("all")}>
                        Tất cả
                      </DropdownMenuItem>
                      {modules.map((module) => (
                        <DropdownMenuItem 
                          key={module} 
                          onClick={() => setSelectedModule(module)}
                        >
                          {module}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Thời gian</TableHead>
                      <TableHead>Người dùng</TableHead>
                      <TableHead>Hành động</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Địa chỉ IP</TableHead>
                      <TableHead>Mức độ</TableHead>
                      <TableHead className="text-right">Chi tiết</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSystemLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Không có dữ liệu nhật ký
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSystemLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono">
                            {format(log.timestamp, "dd/MM/yyyy HH:mm:ss", { locale: vi })}
                          </TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell>{log.module}</TableCell>
                          <TableCell className="font-mono">{log.ipAddress}</TableCell>
                          <TableCell>{getLevelBadge(log.level)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Info className="h-4 w-4" />
                                  <span className="sr-only">Chi tiết</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <div className="p-2 max-w-sm">
                                  <p className="text-sm font-medium">Chi tiết nhật ký</p>
                                  <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                                </div>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Nhật ký truy cập */}
        <TabsContent value="access">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Nhật ký truy cập</CardTitle>
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Filter className="h-3.5 w-3.5" />
                        <span>Trạng thái</span>
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedStatus("all")}>
                        Tất cả
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedStatus("success")}>
                        Thành công
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedStatus("failed")}>
                        Thất bại
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Filter className="h-3.5 w-3.5" />
                        <span>Loại người dùng</span>
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedUserType("all")}>
                        Tất cả
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedUserType("Admin")}>
                        Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedUserType("Giảng viên")}>
                        Giảng viên
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedUserType("Sinh viên")}>
                        Sinh viên
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedUserType("Unknown")}>
                        Không xác định
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Thời gian</TableHead>
                      <TableHead>Người dùng</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Hành động</TableHead>
                      <TableHead>Địa chỉ IP</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Chi tiết</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccessLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Không có dữ liệu nhật ký
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAccessLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono">
                            {format(log.timestamp, "dd/MM/yyyy HH:mm:ss", { locale: vi })}
                          </TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>{log.userType}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell className="font-mono">{log.ipAddress}</TableCell>
                          <TableCell>{getStatusBadge(log.status)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Info className="h-4 w-4" />
                                  <span className="sr-only">Chi tiết</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <div className="p-2 max-w-sm">
                                  <p className="text-sm font-medium">Chi tiết trình duyệt</p>
                                  <p className="text-sm text-muted-foreground mt-1">{log.userAgent}</p>
                                </div>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Nhật ký thay đổi */}
        <TabsContent value="changes">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle>Nhật ký thay đổi</CardTitle>
                <div className="flex items-center space-x-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Filter className="h-3.5 w-3.5" />
                        <span>Hành động</span>
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedAction("all")}>
                        Tất cả
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedAction("Thêm")}>
                        Thêm
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedAction("Cập nhật")}>
                        Cập nhật
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setSelectedAction("Xóa")}>
                        Xóa
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-1">
                        <Filter className="h-3.5 w-3.5" />
                        <span>Module</span>
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setSelectedModule("all")}>
                        Tất cả
                      </DropdownMenuItem>
                      {modules.map((module) => (
                        <DropdownMenuItem 
                          key={module} 
                          onClick={() => setSelectedModule(module)}
                        >
                          {module}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[180px]">Thời gian</TableHead>
                      <TableHead>Người dùng</TableHead>
                      <TableHead>Module</TableHead>
                      <TableHead>Hành động</TableHead>
                      <TableHead>Đối tượng</TableHead>
                      <TableHead>Mã</TableHead>
                      <TableHead className="text-right">Chi tiết</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredChangeLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          Không có dữ liệu nhật ký
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredChangeLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="font-mono">
                            {format(log.timestamp, "dd/MM/yyyy HH:mm:ss", { locale: vi })}
                          </TableCell>
                          <TableCell>{log.user}</TableCell>
                          <TableCell>{log.module}</TableCell>
                          <TableCell>{getActionBadge(log.action)}</TableCell>
                          <TableCell>{log.entity}</TableCell>
                          <TableCell className="font-mono">{log.entityId}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <Info className="h-4 w-4" />
                                  <span className="sr-only">Chi tiết</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <div className="p-2 max-w-sm">
                                  <p className="text-sm font-medium">Chi tiết thay đổi</p>
                                  <p className="text-sm text-muted-foreground mt-1">{log.details}</p>
                                </div>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
