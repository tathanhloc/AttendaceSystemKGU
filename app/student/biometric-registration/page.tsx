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
import { navigation } from "@/app/student/dashboard/page"

export default function BiometricRegistrationPage() {
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
    // If user already has biometrics, redirect to dashboard
    if (user?.hasBiometrics) {
      router.push("/student/dashboard")
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
      console.error("Error accessing camera:", err)
      toast({
        variant: "destructive",
        title: "Camera access denied",
        description: "Please allow camera access to complete biometric registration.",
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

        // Update progress
        setProgress((prev) => {
          const newProgress = Math.min(prev + 20, 100)
          return newProgress
        })

        // If we've captured 5 images, move to the next step
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
      // In a real app, you would send the captured images to your backend
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update user state to indicate biometrics are registered
      updateUser({ hasBiometrics: true })

      toast({
        title: "Biometric registration complete",
        description: "Your face biometrics have been successfully registered.",
      })

      // Redirect to dashboard
      router.push("/student/dashboard")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "There was an error registering your biometrics. Please try again.",
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
          <h1 className="text-3xl font-bold">Biometric Registration</h1>
          <p className="text-muted-foreground">Register your face biometrics for attendance tracking</p>
        </div>

        <div className="mb-8">
          <Progress value={progress} className="h-2" />
          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            <span>Start</span>
            <span>Capture Images</span>
            <span>Complete</span>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {step === 1 && "Step 1: Prepare for Biometric Registration"}
              {step === 2 && "Step 2: Capture Face Images"}
              {step === 3 && "Step 3: Complete Registration"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Please follow the instructions to register your face biometrics"}
              {step === 2 && "Please capture 5 images of your face from different angles"}
              {step === 3 && "Review your captured images and complete registration"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="mb-2 font-medium">Before you begin:</h3>
                  <ul className="ml-6 list-disc space-y-2 text-sm">
                    <li>Make sure you are in a well-lit environment</li>
                    <li>Remove glasses, hats, or anything covering your face</li>
                    <li>Position your face directly in front of the camera</li>
                    <li>You will need to capture 5 images from different angles</li>
                    <li>Your biometric data will be used for attendance tracking only</li>
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
                    <p>Position your face within the circle</p>
                    <p className="text-sm">Captured: {capturedImages.length} of 5</p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button size="lg" onClick={handleCaptureClick} disabled={capturedImages.length >= 5}>
                    Capture Image {capturedImages.length + 1}
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
                    <h3 className="font-medium text-green-800 dark:text-green-400">All images captured successfully</h3>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-medium">Captured Images:</h3>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                    {capturedImages.map((img, index) => (
                      <div key={index} className="overflow-hidden rounded-md border">
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`Captured face ${index + 1}`}
                          className="aspect-square object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <h3 className="mb-2 font-medium">Next Steps:</h3>
                  <p className="text-sm text-muted-foreground">
                    Your biometric data will be processed and stored securely. This data will be used for attendance
                    tracking purposes only. You can update your biometric data at any time from your profile settings.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {step === 1 ? (
              <div className="flex w-full justify-end">
                <Button onClick={handleStartCapture}>
                  Start Capture <ChevronRight className="ml-2 h-4 w-4" />
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
                  Back
                </Button>
                <Button
                  disabled={capturedImages.length < 5}
                  onClick={() => {
                    setStep(3)
                    stopCamera()
                  }}
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
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
                  Retake Images
                </Button>
                <Button onClick={handleSubmit} disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          <p>Having trouble? Please contact the IT support team for assistance.</p>
        </div>
      </div>
    </AppShell>
  )
}
