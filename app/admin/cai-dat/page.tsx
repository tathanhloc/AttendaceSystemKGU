"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Save, RefreshCw, Mail, School, Clock, Bell, Shield, Database } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"

const generalFormSchema = z.object({
  schoolName: z.string().min(2, {
    message: "Tên trường phải có ít nhất 2 ký tự.",
  }),
  schoolAddress: z.string().min(5, {
    message: "Địa chỉ trường phải có ít nhất 5 ký tự.",
  }),
  schoolPhone: z.string().min(10, {
    message: "Số điện thoại không hợp lệ.",
  }),
  schoolEmail: z.string().email({
    message: "Email không hợp lệ.",
  }),
  schoolWebsite: z.string().url({
    message: "Website không hợp lệ.",
  }),
  schoolLogo: z.string().optional(),
})

const emailFormSchema = z.object({
  smtpServer: z.string().min(1, {
    message: "Vui lòng nhập địa chỉ máy chủ SMTP.",
  }),
  smtpPort: z.string().min(1, {
    message: "Vui lòng nhập cổng SMTP.",
  }),
  smtpUsername: z.string().min(1, {
    message: "Vui lòng nhập tên đăng nhập SMTP.",
  }),
  smtpPassword: z.string().min(1, {
    message: "Vui lòng nhập mật khẩu SMTP.",
  }),
  emailFrom: z.string().email({
    message: "Email không hợp lệ.",
  }),
  emailTemplate: z.string().min(10, {
    message: "Mẫu email phải có ít nhất 10 ký tự.",
  }),
  enableEmailNotifications: z.boolean().default(true),
})

const attendanceFormSchema = z.object({
  attendanceThreshold: z.number().min(0).max(100),
  allowLateAttendance: z.boolean().default(true),
  lateAttendanceThreshold: z.number().min(5).max(60),
  enableAutomaticAttendance: z.boolean().default(false),
  attendanceMethod: z.enum(["biometric", "qrcode", "manual", "combined"]),
  notifyAbsentStudents: z.boolean().default(true),
})

const securityFormSchema = z.object({
  passwordPolicy: z.enum(["low", "medium", "high", "custom"]),
  sessionTimeout: z.number().min(5).max(1440),
  enableTwoFactor: z.boolean().default(false),
  ipRestriction: z.boolean().default(false),
  allowedIPs: z.string().optional(),
  failedLoginAttempts: z.number().min(1).max(10),
  accountLockDuration: z.number().min(5).max(1440),
})

const backupFormSchema = z.object({
  enableAutomaticBackup: z.boolean().default(true),
  backupFrequency: z.enum(["daily", "weekly", "monthly"]),
  backupTime: z.string().min(1, {
    message: "Vui lòng chọn thời gian sao lưu.",
  }),
  backupRetention: z.number().min(1).max(365),
  backupLocation: z.string().min(1, {
    message: "Vui lòng nhập vị trí sao lưu.",
  }),
  includeAttachments: z.boolean().default(true),
})

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false)

  const generalForm = useForm<z.infer<typeof generalFormSchema>>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      schoolName: "Trường Đại học ABC",
      schoolAddress: "123 Đường XYZ, Quận 1, TP.HCM",
      schoolPhone: "0123456789",
      schoolEmail: "info@abc.edu.vn",
      schoolWebsite: "https://abc.edu.vn",
    },
  })

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      smtpServer: "smtp.gmail.com",
      smtpPort: "587",
      smtpUsername: "noreply@abc.edu.vn",
      smtpPassword: "********",
      emailFrom: "noreply@abc.edu.vn",
      emailTemplate: "Kính gửi {recipient},\n\n{message}\n\nTrân trọng,\nTrường Đại học ABC",
      enableEmailNotifications: true,
    },
  })

  const attendanceForm = useForm<z.infer<typeof attendanceFormSchema>>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: {
      attendanceThreshold: 80,
      allowLateAttendance: true,
      lateAttendanceThreshold: 15,
      enableAutomaticAttendance: true,
      attendanceMethod: "biometric",
      notifyAbsentStudents: true,
    },
  })

  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      passwordPolicy: "medium",
      sessionTimeout: 30,
      enableTwoFactor: false,
      ipRestriction: false,
      allowedIPs: "",
      failedLoginAttempts: 5,
      accountLockDuration: 30,
    },
  })

  const backupForm = useForm<z.infer<typeof backupFormSchema>>({
    resolver: zodResolver(backupFormSchema),
    defaultValues: {
      enableAutomaticBackup: true,
      backupFrequency: "daily",
      backupTime: "02:00",
      backupRetention: 30,
      backupLocation: "/var/backups/edu-system",
      includeAttachments: true,
    },
  })

  function onSubmit(values: any, formType: string) {
    setIsSaving(true)
    
    // Giả lập API call
    setTimeout(() => {
      console.log(values)
      setIsSaving(false)
      toast({
        title: "Đã lưu cài đặt",
        description: `Cài đặt ${formType} đã được cập nhật thành công.`,
      })
    }, 1000)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Cài đặt hệ thống</h1>
          <p className="text-muted-foreground">
            Quản lý các cài đặt và tùy chọn cho hệ thống quản lý giáo dục.
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <School className="h-4 w-4" />
            <span className="hidden sm:inline">Thông tin chung</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Điểm danh</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Bảo mật</span>
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Sao lưu</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Thông tin chung */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin trường học</CardTitle>
              <CardDescription>
                Cập nhật thông tin cơ bản về trường học của bạn.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...generalForm}>
                <form onSubmit={generalForm.handleSubmit((values) => onSubmit(values, "thông tin chung"))} className="space-y-6">
                  <FormField
                    control={generalForm.control}
                    name="schoolName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên trường</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên trường" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={generalForm.control}
                    name="schoolAddress"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa chỉ</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Nhập địa chỉ trường" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={generalForm.control}
                      name="schoolPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số điện thoại</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập số điện thoại" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={generalForm.control}
                      name="schoolEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={generalForm.control}
                    name="schoolWebsite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập website" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={generalForm.control}
                    name="schoolLogo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logo trường</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-4">
                            <div className="h-20 w-20 rounded-md border flex items-center justify-center bg-muted">
                              <School className="h-10 w-10 text-muted-foreground" />
                            </div>
                            <Button type="button" variant="outline">
                              Tải lên logo
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Tải lên logo của trường với kích thước tối thiểu 200x200px.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isSaving} className="flex gap-2">
                    {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Lưu thay đổi
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Email */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Cấu hình Email</CardTitle>
              <CardDescription>
                Cấu hình máy chủ email và các thông báo tự động.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...emailForm}>
                <form onSubmit={emailForm.handleSubmit((values) => onSubmit(values, "email"))} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={emailForm.control}
                      name="smtpServer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Máy chủ SMTP</FormLabel>
                          <FormControl>
                            <Input placeholder="smtp.example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailForm.control}
                      name="smtpPort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cổng SMTP</FormLabel>
                          <FormControl>
                            <Input placeholder="587" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={emailForm.control}
                      name="smtpUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên đăng nhập SMTP</FormLabel>
                          <FormControl>
                            <Input placeholder="username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailForm.control}
                      name="smtpPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mật khẩu SMTP</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="********" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={emailForm.control}
                    name="emailFrom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email gửi</FormLabel>
                        <FormControl>
                          <Input placeholder="noreply@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={emailForm.control}
                    name="emailTemplate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mẫu email mặc định</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Mẫu email" 
                            className="min-h-[150px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Sử dụng {'{recipient}'} cho tên người nhận và {'{message}'} cho nội dung email.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={emailForm.control}
                    name="enableEmailNotifications"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Thông báo qua email</FormLabel>
                          <FormDescription>
                            Bật thông báo tự động qua email cho người dùng.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isSaving} className="flex gap-2">
                    {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Lưu thay đổi
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Điểm danh */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt điểm danh</CardTitle>
              <CardDescription>
                Cấu hình các tùy chọn liên quan đến điểm danh sinh viên.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...attendanceForm}>
                <form onSubmit={attendanceForm.handleSubmit((values) => onSubmit(values, "điểm danh"))} className="space-y-6">
                  <FormField
                    control={attendanceForm.control}
                    name="attendanceThreshold"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngưỡng điểm danh tối thiểu (%)</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-4">
                            <Slider
                              value={[field.value]}
                              min={0}
                              max={100}
                              step={1}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="flex-1"
                            />
                            <span className="w-12 text-center">{field.value}%</span>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Tỷ lệ điểm danh tối thiểu để sinh viên đủ điều kiện dự thi.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={attendanceForm.control}
                    name="allowLateAttendance"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Cho phép điểm danh muộn</FormLabel>
                          <FormDescription>
                            Cho phép sinh viên điểm danh khi đến muộn.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {attendanceForm.watch("allowLateAttendance") && (
                    <FormField
                      control={attendanceForm.control}
                      name="lateAttendanceThreshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Thời gian điểm danh muộn tối đa (phút)</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-4">
                              <Slider
                                value={[field.value]}
                                min={5}
                                max={60}
                                step={5}
                                onValueChange={(value) => field.onChange(value[0])}
                                className="flex-1"
                              />
                              <span className="w-12 text-center">{field.value} phút</span>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Thời gian tối đa cho phép điểm danh muộn sau khi bắt đầu buổi học.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <FormField
                    control={attendanceForm.control}
                    name="attendanceMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phương thức điểm danh</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn phương thức điểm danh" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="biometric">Sinh trắc học</SelectItem>
                            <SelectItem value="qrcode">Mã QR</SelectItem>
                            <SelectItem value="manual">Thủ công</SelectItem>
                            <SelectItem value="combined">Kết hợp</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Phương thức điểm danh mặc định cho sinh viên.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={attendanceForm.control}
                    name="enableAutomaticAttendance"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Điểm danh tự động</FormLabel>
                          <FormDescription>
                            Tự động điểm danh sinh viên khi họ được nhận diện bởi hệ thống sinh trắc học.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={attendanceForm.control}
                    name="notifyAbsentStudents"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Thông báo vắng mặt</FormLabel>
                          <FormDescription>
                            Gửi thông báo cho sinh viên khi họ vắng mặt trong buổi học.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={isSaving} className="flex gap-2">
                    {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Lưu thay đổi
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Bảo mật */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt bảo mật</CardTitle>
              <CardDescription>
                Cấu hình các tùy chọn bảo mật cho hệ thống.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit((values) => onSubmit(values, "bảo mật"))} className="space-y-6">
                  <FormField
                    control={securityForm.control}
                    name="passwordPolicy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chính sách mật khẩu</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn chính sách mật khẩu" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Thấp (ít nhất 6 ký tự)</SelectItem>
                            <SelectItem value="medium">Trung bình (ít nhất 8 ký tự, bao gồm chữ và số)</SelectItem>
                            <SelectItem value="high">Cao (ít nhất 10 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt)</SelectItem>
                            <SelectItem value="custom">Tùy chỉnh</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Chính sách mật khẩu áp dụng cho tất cả người dùng.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={securityForm.control}
                    name="sessionTimeout"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thời gian hết hạn phiên (phút)</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-4">
                            <Slider
                              value={[field.value]}
                              min={5}
                              max={1440}
                              step={5}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="flex-1"
                            />
                            <span className="w-16 text-center">{field.value} phút</span>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Thời gian không hoạt động trước khi phiên đăng nhập hết hạn.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={securityForm.control}
                    name="enableTwoFactor"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Xác thực hai yếu tố</FormLabel>
                          <FormDescription>
                            Yêu cầu xác thực hai yếu tố cho tất cả tài khoản quản trị viên.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={securityForm.control}
                    name="ipRestriction"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Hạn chế IP</FormLabel>
                          <FormDescription>
                            Chỉ cho phép đăng nhập từ các địa chỉ IP được chỉ định.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {securityForm.watch("ipRestriction") && (
                    <FormField
                      control={securityForm.control}
                      name="allowedIPs"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Địa chỉ IP được phép</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="192.168.1.1, 10.0.0.1" 
                              {...field} 
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormDescription>
                            Nhập danh sách các địa chỉ IP được phép, phân cách bằng dấu phẩy.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={securityForm.control}
                      name="failedLoginAttempts"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Số lần đăng nhập thất bại tối đa</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-4">
                              <Slider
                                value={[field.value]}
                                min={1}
                                max={10}
                                step={1}
                                onValueChange={(value) => field.onChange(value[0])}
                                className="flex-1"
                              />
                              <span className="w-8 text-center">{field.value}</span>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Số lần đăng nhập thất bại trước khi khóa tài khoản.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={securityForm.control}
                      name="accountLockDuration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Thời gian khóa tài khoản (phút)</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-4">
                              <Slider
                                value={[field.value]}
                                min={5}
                                max={1440}
                                step={5}
                                onValueChange={(value) => field.onChange(value[0])}
                                className="flex-1"
                              />
                              <span className="w-16 text-center">{field.value} phút</span>
                            </div>
                          </FormControl>
                          <FormDescription>
                            Thời gian khóa tài khoản sau nhiều lần đăng nhập thất bại.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="submit" disabled={isSaving} className="flex gap-2">
                    {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Lưu thay đổi
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Sao lưu */}
        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt sao lưu</CardTitle>
              <CardDescription>
                Cấu hình các tùy chọn sao lưu và khôi phục dữ liệu.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Form {...backupForm}>
                <form onSubmit={backupForm.handleSubmit((values) => onSubmit(values, "sao lưu"))} className="space-y-6">
                  <FormField
                    control={backupForm.control}
                    name="enableAutomaticBackup"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Sao lưu tự động</FormLabel>
                          <FormDescription>
                            Tự động sao lưu dữ liệu theo lịch trình đã cấu hình.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  {backupForm.watch("enableAutomaticBackup") && (
                    <>
                      <FormField
                        control={backupForm.control}
                        name="backupFrequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tần suất sao lưu</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Chọn tần suất sao lưu" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="daily">Hàng ngày</SelectItem>
                                <SelectItem value="weekly">Hàng tuần</SelectItem>
                                <SelectItem value="monthly">Hàng tháng</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Tần suất thực hiện sao lưu tự động.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={backupForm.control}
                        name="backupTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Thời gian sao lưu</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} />
                            </FormControl>
                            <FormDescription>
                              Thời gian thực hiện sao lưu tự động (giờ địa phương).
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}
                  <FormField
                    control={backupForm.control}
                    name="backupRetention"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thời gian lưu trữ sao lưu (ngày)</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-4">
                            <Slider
                              value={[field.value]}
                              min={1}
                              max={365}
                              step={1}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="flex-1"
                            />
                            <span className="w-16 text-center">{field.value} ngày</span>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Thời gian lưu trữ các bản sao lưu trước khi tự động xóa.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={backupForm.control}
                    name="backupLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vị trí lưu trữ sao lưu</FormLabel>
                        <FormControl>
                          <Input placeholder="/var/backups/edu-system" {...field} />
                        </FormControl>
                        <FormDescription>
                          Đường dẫn đến thư mục lưu trữ các bản sao lưu.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={backupForm.control}
                    name="includeAttachments"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Bao gồm tệp đính kèm</FormLabel>
                          <FormDescription>
                            Bao gồm tất cả tệp đính kèm trong bản sao lưu.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col space-y-4">
                    <Button type="submit" disabled={isSaving} className="flex gap-2">
                      {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                      Lưu thay đổi
                    </Button>
                    <div className="flex gap-4">
                      <Button type="button" variant="outline" className="flex-1">
                        Sao lưu ngay
                      </Button>
                      <Button type="button" variant="outline" className="flex-1">
                        Khôi phục
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
