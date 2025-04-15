"use client"

import { useEffect, useState } from "react"
import { BarChart, BookOpen, Calendar, Camera, Clock, LayoutDashboard, Settings, User } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppShell } from "@/components/app-shell"
import { useAuth } from "@/components/auth-provider"

const navigation = [
  {
    title: "Dashboard",
    href: "/student/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Courses",
    href: "/student/courses",
    icon: BookOpen,
  },
  {
    title: "Schedule",
    href: "/student/schedule",
    icon: Calendar,
  },
  {
    title: "Attendance",
    href: "/student/attendance",
    icon: Clock,
  },
  {
    title: "Biometrics",
    href: "/student/biometric-registration",
    icon: Camera,
  },
  {
    title: "Profile",
    href: "/student/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/student/settings",
    icon: Settings,
  },
]

export default function StudentDashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    courses: 0,
    attendanceRate: 0,
    upcomingClasses: 0,
    totalHours: 0,
    completedHours: 0,
  })

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats({
        courses: 5,
        attendanceRate: 85,
        upcomingClasses: 2,
        totalHours: 120,
        completedHours: 48,
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AppShell navigation={navigation}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Here's an overview of your academic progress.
          </p>
        </div>

        {!user?.hasBiometrics && (
          <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900">
                <Camera className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-orange-800 dark:text-orange-400">Biometric registration required</p>
                <p className="text-sm text-orange-700 dark:text-orange-500">
                  Please complete your biometric registration to enable attendance tracking.
                </p>
              </div>
              <a
                href="/student/biometric-registration"
                className="rounded-md bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-400 dark:hover:bg-orange-800"
              >
                Register Now
              </a>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.courses}</div>
              <p className="text-xs text-muted-foreground">Current semester</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
              <p className="text-xs text-muted-foreground">
                {stats.attendanceRate < 70 ? (
                  <span className="text-red-500">Warning: Below required minimum</span>
                ) : (
                  "Good standing"
                )}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingClasses}</div>
              <p className="text-xs text-muted-foreground">In the next 24 hours</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Course Progress</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round((stats.completedHours / stats.totalHours) * 100)}%</div>
              <div className="mt-2">
                <Progress value={(stats.completedHours / stats.totalHours) * 100} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {stats.completedHours} of {stats.totalHours} hours completed
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="schedule" className="space-y-4">
          <TabsList>
            <TabsTrigger value="schedule">Today's Schedule</TabsTrigger>
            <TabsTrigger value="attendance">Attendance History</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Today's Classes</CardTitle>
                <CardDescription>Your class schedule for today</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.upcomingClasses > 0 ? (
                  <div className="space-y-4">
                    {Array.from({ length: stats.upcomingClasses }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="space-y-1">
                          <p className="font-medium">Database Systems {i + 1}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{`${13 + i * 2}:00 - ${15 + i * 2}:00`}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <BookOpen className="h-4 w-4" />
                            <span>Prof. Johnson</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                            Room B{i + 1}0{i + 1}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-[200px] items-center justify-center">
                    <p className="text-muted-foreground">No classes scheduled for today</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance History</CardTitle>
                <CardDescription>Your recent attendance records</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="space-y-1">
                        <p className="font-medium">Database Systems</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(Date.now() - i * 86400000).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {i % 4 === 0 ? (
                          <div className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                            Absent
                          </div>
                        ) : (
                          <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                            Present
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Your recent notifications and alerts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.attendanceRate < 70 && (
                    <div className="flex items-start gap-4 rounded-md border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950">
                      <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
                        <Clock className="h-5 w-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="font-medium text-red-800 dark:text-red-400">Attendance Warning</p>
                        <p className="text-sm text-red-700 dark:text-red-500">
                          Your attendance rate is below the required minimum of 70%. Please improve your attendance to
                          avoid academic penalties.
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-4 rounded-md border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                    <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                      <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-blue-800 dark:text-blue-400">Exam Schedule Posted</p>
                      <p className="text-sm text-blue-700 dark:text-blue-500">
                        The final exam schedule has been posted. Please check your course pages for details.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 rounded-md border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950">
                    <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                      <BookOpen className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-green-800 dark:text-green-400">New Course Materials</p>
                      <p className="text-sm text-green-700 dark:text-green-500">
                        New course materials have been uploaded for Database Systems. Check your course page for
                        details.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
