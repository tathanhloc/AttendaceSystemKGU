"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"

type VaiTro = "admin" | "giangvien" | "sinhvien"

interface User {
  id: string
  username: string
  hoTen: string
  email: string
  vaiTro: VaiTro
  hasBiometrics?: boolean
  maSV?: string
  maGV?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<User>
  logout: () => void
  updateUser: (user: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Kiểm tra người dùng đã lưu khi tải trang
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Bảo vệ các tuyến đường dựa trên xác thực và vai trò
    if (!isLoading) {
      const publicRoutes = ["/login", "/forgot-password", "/reset-password"]

      if (!user && !publicRoutes.some((route) => pathname.startsWith(route))) {
        router.push("/login")
      } else if (user) {
        // Chuyển hướng nếu người dùng cố gắng truy cập tuyến đường của vai trò khác
        if (pathname.startsWith("/admin") && user.vaiTro !== "admin") {
          router.push(`/${user.vaiTro}/dashboard`)
        } else if (pathname.startsWith("/giangvien") && user.vaiTro !== "giangvien") {
          router.push(`/${user.vaiTro}/dashboard`)
        } else if (pathname.startsWith("/sinhvien") && user.vaiTro !== "sinhvien") {
          router.push(`/${user.vaiTro}/dashboard`)
        }
      }
    }
  }, [isLoading, user, pathname, router])

  const login = async (username: string, password: string): Promise<User> => {
    setIsLoading(true)
    try {
      // Trong ứng dụng thực tế, đây sẽ gọi API của bạn
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Dữ liệu người dùng giả dựa trên tên đăng nhập
      let mockUser: User

      if (username.includes("admin")) {
        mockUser = {
          id: "admin-1",
          username,
          hoTen: "Quản Trị Viên",
          email: "admin@example.com",
          vaiTro: "admin",
        }
      } else if (username.includes("gv")) {
        mockUser = {
          id: "gv-1",
          username,
          hoTen: "Nguyễn Văn A",
          email: "giangvien@example.com",
          vaiTro: "giangvien",
          maGV: "GV001",
        }
      } else {
        mockUser = {
          id: "sv-1",
          username,
          hoTen: "Trần Thị B",
          email: "sinhvien@example.com",
          vaiTro: "sinhvien",
          hasBiometrics: username.includes("new") ? false : true,
          maSV: "SV001",
        }
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      return mockUser
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
  }

  const updateUser = (updatedFields: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updatedFields }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout, updateUser }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth phải được sử dụng trong AuthProvider")
  }
  return context
}
