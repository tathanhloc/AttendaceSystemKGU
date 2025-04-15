// Create this file for the biometric registration page
"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Camera, Check, ChevronRight, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { AppShell } from "@/components/app-shell"
import { useAuth } from "@/components/auth-provider"
import { navigation } from "../dashboard/page"

export default function SinhTracHocPage() {
  const { user, updateUser } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [step, setStep] = useState(1)
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const [progress, setProgress] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Nếu người dùng đã có sinh trắc học, chuyển hướng đến trang tổng quan
    if (user?.hasBiometrics) {
      router.push("/sinhvien/dashboard")
    }
  }, [user, router])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: 640,
          height: 480,
          facingMode: "user",
        },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (err) {
      console.error("Lỗi khi truy cập camera:", err)
      toast({
        variant: "destructive",
        title: "Truy cập camera bị từ chối",
        description: "Vui lòng cho phép truy cập camera để hoàn thành đăng ký sinh trắc học.",
      })
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      const tracks = stream.getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d")
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth
        canvasRef.current.height = videoRef.current.videoHeight
        context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)

        const imageData = canvasRef.current.toDataURL("image/png")
        setCapturedImages((prev) => [...prev, imageData])

        // Cập nhật tiến trình
        setProgress((prev) => {
          const newProgress = Math.min(prev + 20, 100)
          return newProgress
        })

        // Nếu đã chụp 5 ảnh, chuyển sang bước tiếp theo
        if (capturedImages.length >= 4) {
          setIsCapturing(false)
          setStep(3)
        }
      }
    }
  }

  const handleStartCapture = () => {
    setIsCapturing(true)
    startCamera()
    setStep(2)
  }

  const handleCaptureClick = () => {
    captureImage()
  }

  const handleSubmit = async () => {
    setIsProcessing(true)

    try {
      // Trong ứng dụng thực tế, bạn sẽ gửi ảnh đã chụp đến backend
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Cập nhật trạng thái người dùng để chỉ ra rằng sinh trắc học đã được đăng ký
      updateUser({ hasBiometrics: true })

      toast({
        title: "Đăng ký sinh trắc học hoàn tất",
        description: "Sinh trắc học khuôn mặt của bạn đã được đăng ký thành công.",
      })

      // Chuyển hướng đến trang tổng quan
      router.push("/sinhvien/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Đăng ký thất bại",
        description: "Đã xảy ra lỗi khi đăng ký sinh trắc học. Vui lòng thử lại.",
      })
    } finally {
      setIsProcessing(false)
      stopCamera()
    }
  }

  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  return (
    <AppShell navigation={navigation}>
      <div className="container mx-auto max-w-4xl py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-primary">Đăng Ký Sinh Trắc Học</h1>
          <p className="text-muted-foreground">Đăng ký sinh trắc học khuôn mặt để điểm danh</p>
        </div>

        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            <span>Bắt đầu</span>
            <span>Chụp ảnh</span>
            <span>Hoàn thành</span>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {step === 1 && "Bước 1: Chuẩn bị đăng ký sinh trắc học"}
              {step === 2 && "Bước 2: Chụp ảnh khuôn mặt"}
              {step === 3 && "Bước 3: Hoàn thành đăng ký"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Vui lòng làm theo hướng dẫn để đăng ký sinh trắc học khuôn mặt"}
              {step === 2 && "Vui lòng chụp 5 ảnh khuôn mặt của bạn từ các góc độ khác nhau"}
              {step === 3 && "Xem lại ảnh đã chụp và hoàn thành đăng ký"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="mb-2 font-medium">Trước khi bắt đầu:</h3>
                  <ul className="ml-6 list-disc space-y-2 text-sm">
                    <li>Đảm bảo bạn đang ở trong môi trường có ánh sáng tốt</li>
                    <li>Tháo kính, mũ, hoặc bất cứ thứ gì che khuôn mặt</li>
                    <li>Đặt khuôn mặt trực tiếp trước camera</li>
                    <li>Bạn sẽ cần chụp 5 ảnh từ các góc độ khác nhau</li>
                    <li>Dữ liệu sinh trắc học của bạn sẽ chỉ được sử dụng cho mục đích điểm danh</li>
                  </ul>
                </div>
                <div className="flex justify-center">
                  <div className="rounded-full bg-primary/10 p-8">
                    <Camera className="h-16 w-16 text-primary" />
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="relative mx-auto aspect-video max-w-md overflow-hidden rounded-lg border bg-black">
                  <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Overlay with face outline guide */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-64 w-64 rounded-full border-2 border-dashed border-white/50" />
                  </div>

                  <div className="absolute bottom-4 left-0 right-0 text-center text-white">
                    <p>Đặt khuôn mặt của bạn trong vòng tròn</p>
                    <p className="text-sm">Đã chụp: {capturedImages.length} / 5</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button size="lg" onClick={handleCaptureClick} disabled={capturedImages.length >= 5}>
                    Chụp ảnh {capturedImages.length + 1}
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-100 p-1 dark:bg-green-900">
                      <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-medium text-green-800 dark:text-green-400">Đã chụp tất cả ảnh thành công</h3>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-medium">Ảnh đã chụp:</h3>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    {capturedImages.map((img, index) => (
                      <div key={index} className="overflow-hidden rounded-md border">
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`Khuôn mặt đã chụp ${index + 1}`}
                          className="aspect-square object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <h3 className="mb-2 font-medium">Các bước tiếp theo:</h3>
                  <p className="text-sm text-muted-foreground">
                    Dữ liệu sinh trắc học của bạn sẽ được xử lý và lưu trữ an toàn. Dữ liệu này sẽ chỉ được sử dụng cho
                    mục đích điểm danh. Bạn có thể cập nhật dữ liệu sinh trắc học của mình bất kỳ lúc nào từ cài đặt hồ
                    sơ.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step === 1 ? (
              <div className="flex w-full justify-end">
                <Button onClick={handleStartCapture} className="bg-primary hover:bg-primary/90">
                  Bắt đầu chụp <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : step === 2 ? (
              <div className="flex w-full justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep(1)
                    stopCamera()
                    setIsCapturing(false)
                    setCapturedImages([])
                    setProgress(0)
                  }}
                >
                  Quay lại
                </Button>
                <Button
                  disabled={capturedImages.length < 5}
                  onClick={() => {
                    setStep(3)
                    stopCamera()
                  }}
                  className="bg-primary hover:bg-primary/90"
                >
                  Tiếp theo <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex w-full justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep(2)
                    startCamera()
                    setIsCapturing(true)
                  }}
                >
                  Chụp lại
                </Button>
                <Button onClick={handleSubmit} disabled={isProcessing} className="bg-primary hover:bg-primary/90">
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xử lý...
                    </>
                  ) : (
                    "Hoàn thành đăng ký"
                  )}
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Gặp sự cố? Vui lòng liên hệ đội ngũ hỗ trợ CNTT để được hỗ trợ.</p>
        </div>
      </div>
    </AppShell>
  )
}
