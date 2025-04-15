"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Trong ứng dụng thực tế, đây sẽ gọi API của bạn
      const user = await login(username, password)

      // Chuyển hướng dựa trên vai trò người dùng
      if (user.vaiTro === "admin") {
        router.push("/admin/dashboard")
      } else if (user.vaiTro === "giangvien") {
        router.push("/giangvien/dashboard")
      } else if (user.vaiTro === "sinhvien") {
        // Kiểm tra xem sinh viên đã hoàn thành đăng ký sinh trắc học chưa
        if (!user.hasBiometrics) {
          router.push("/sinhvien/sinh-trac-hoc")
        } else {
          router.push("/sinhvien/dashboard")
        }
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Đăng nhập thất bại",
        description: "Tên đăng nhập hoặc mật khẩu không đúng. Vui lòng thử lại.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-cover bg-center" style={{ backgroundImage: "url('/loginbg.jpg')" }}> {/* Đảm bảo chiếm toàn bộ màn hình */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"></div> {/* Thêm lớp filter làm mờ background */}
      <div className="relative w-full max-w-md mx-auto space-y-8 bg-white p-8 rounded-lg shadow-lg"> {/* Thêm bóng và nền trắng */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Hệ Thống Quản Lý Giáo Dục</h1>
          <p className="mt-2 text-muted-foreground">Đăng nhập vào tài khoản của bạn</p>
        </div>
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Tên đăng nhập</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Mật khẩu</Label>
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}</span>
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </div>
        <div className="mt-4 flex items-center justify-center gap-2">
          <Lock className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Đăng nhập an toàn. Liên hệ quản trị viên nếu có vấn đề.</p>
        </div>
      </div>
    </div>
  )
}
