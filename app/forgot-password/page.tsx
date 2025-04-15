"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Trong ứng dụng thực tế, đây sẽ gọi API của bạn
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSubmitted(true)
      toast({
        title: "Đã gửi liên kết đặt lại mật khẩu",
        description: "Kiểm tra email của bạn để đặt lại mật khẩu.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Đã xảy ra lỗi",
        description: "Không thể gửi liên kết đặt lại mật khẩu. Vui lòng thử lại.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary">Đặt lại mật khẩu</h1>
          <p className="mt-2 text-muted-foreground">
            Nhập email của bạn và chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu
          </p>
        </div>
        <div className="rounded-lg border bg-card p-8 shadow-sm">
          {isSubmitted ? (
            <div className="space-y-4 text-center">
              <p className="text-muted-foreground">
                Chúng tôi đã gửi liên kết đặt lại mật khẩu đến <strong>{email}</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Nếu bạn không nhận được email, hãy kiểm tra thư mục spam hoặc thử lại với email khác.
              </p>
              <Button variant="outline" className="mt-4 w-full" onClick={() => setIsSubmitted(false)}>
                Thử lại
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Nhập địa chỉ email của bạn"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
              </Button>
            </form>
          )}
        </div>
        <div className="text-center">
          <Link href="/login" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
            <ArrowLeft className="h-4 w-4" />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  )
}
