"use client"

import { useEffect, useState } from "react"
import { BarChart, BookOpen, Calendar, Clock, GraduationCap, LayoutDashboard, Settings, Users } from "lucide-react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AppShell } from "@/components/app-shell"

const navigation = [
  {
    title: "Dashboard",
    href: "/teacher/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Classes",
    href: "/teacher/classes",
    icon: Users,
  },
  {
    title: "Schedule",
    href: "/teacher/schedule",
    icon: Calendar,
  },
  {
    title: "Attendance",
    href: "/teacher/attendance",
    icon: Clock,
  },
  {
    title: "Reports",
    href: "/teacher/reports",
    icon: BarChart,
  },
  {
    title: "Settings",
    href: "/teacher/settings",
    icon: Settings,
  },
]

export default function TeacherDashboardPage() {
  const [stats, setStats] = useState({
    classes: 0,
    students: 0,
    attendanceRate: 0,
    upcomingClasses: 0,
  })

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats({
        classes: 5,
        students: 120,
        attendanceRate: 87,
        upcomingClasses: 3,
      })
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AppShell navigation={navigation}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your dashboard. Here's an overview of your classes and students.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.classes}</div>
              <p className="text-xs text-muted-foreground">For current semester</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.students}</div>
              <p className="text-xs text-muted-foreground">Across all your classes</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.attendanceRate}%</div>
              <p className="text-xs text-muted-foreground">Average across all classes</p>
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
        </div>

        <Tabs defaultValue="schedule" className="space-y-4">
          <TabsList>
            <TabsTrigger value="schedule">Today's Schedule</TabsTrigger>
            <TabsTrigger value="students">At-Risk Students</TabsTrigger>
            <TabsTrigger value="attendance">Attendance Overview</TabsTrigger>
          </TabsList>
          <TabsContent value="schedule" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Today's Classes</CardTitle>
                <CardDescription>Your teaching schedule for today</CardDescription>
              </CardHeader>
              <CardContent>
                {stats.upcomingClasses > 0 ? (
                  <div className="space-y-4">
                    {Array.from({ length: stats.upcomingClasses }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="space-y-1">
                          <p className="font-medium">Introduction to Programming {i + 1}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>{`${8 + i * 2}:00 - ${10 + i * 2}:00`}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <GraduationCap className="h-4 w-4" />
                            <span>Computer Science - Year {i + 1}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                            Room A{i + 1}0{i + 1}
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
          <TabsContent value="students" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>At-Risk Students</CardTitle>
                <CardDescription>Students with attendance below 70%</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">Student Name {i}</p>
                          <p className="text-sm text-muted-foreground">ID: S00{i}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                          {60 - i * 5}% Attendance
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="attendance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Overview</CardTitle>
                <CardDescription>Attendance rates across your classes</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center">
                <BarChart className="h-16 w-16 text-muted-foreground" />
                <p className="ml-4 text-muted-foreground">Attendance chart will be displayed here</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  )
}
