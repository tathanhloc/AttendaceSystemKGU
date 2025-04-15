"use client"

import { useState } from "react"
import { Calendar, Check, Download, Loader2, Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { AppShell } from "@/components/app-shell"
import { navigation } from "@/app/teacher/dashboard/page"

type Student = {
  id: string
  name: string
  studentId: string
  present: boolean | null
  lastAttendance: string | null
}

const courses = [
  { id: "cs101", name: "Introduction to Programming", section: "A" },
  { id: "cs201", name: "Data Structures", section: "B" },
  { id: "cs301", name: "Database Systems", section: "C" },
  { id: "cs401", name: "Software Engineering", section: "A" },
  { id: "cs501", name: "Artificial Intelligence", section: "B" },
]

const students: Student[] = [
  {
    id: "s1",
    name: "Emily Davis",
    studentId: "S2023001",
    present: null,
    lastAttendance: "2023-04-10",
  },
  {
    id: "s2",
    name: "David Wilson",
    studentId: "S2023002",
    present: null,
    lastAttendance: "2023-04-10",
  },
  {
    id: "s3",
    name: "Lisa Anderson",
    studentId: "S2023003",
    present: null,
    lastAttendance: "2023-04-10",
  },
  {
    id: "s4",
    name: "James Martin",
    studentId: "S2023004",
    present: null,
    lastAttendance: "2023-04-10",
  },
  {
    id: "s5",
    name: "Jennifer Lee",
    studentId: "S2023005",
    present: null,
    lastAttendance: "2023-04-03",
  },
  {
    id: "s6",
    name: "Michael Chen",
    studentId: "S2023006",
    present: null,
    lastAttendance: "2023-04-10",
  },
  {
    id: "s7",
    name: "Sarah Johnson",
    studentId: "S2023007",
    present: null,
    lastAttendance: "2023-04-10",
  },
  {
    id: "s8",
    name: "Robert Taylor",
    studentId: "S2023008",
    present: null,
    lastAttendance: "2023-04-03",
  },
  {
    id: "s9",
    name: "Jessica Brown",
    studentId: "S2023009",
    present: null,
    lastAttendance: "2023-04-10",
  },
  {
    id: "s10",
    name: "William Garcia",
    studentId: "S2023010",
    present: null,
    lastAttendance: "2023-04-10",
  },
]

export default function AttendancePage() {
  const [selectedCourse, setSelectedCourse] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [attendanceList, setAttendanceList] = useState<Student[]>(students)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isAttendanceStarted, setIsAttendanceStarted] = useState(false)
  const { toast } = useToast()

  const filteredStudents = attendanceList.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleStartAttendance = () => {
    if (!selectedCourse) {
      toast({
        variant: "destructive",
        title: "Course selection required",
        description: "Please select a course before starting attendance.",
      })
      return
    }

    setIsAttendanceStarted(true)
    toast({
      title: "Attendance started",
      description: "You can now mark attendance for students.",
    })
  }

  const handleMarkAttendance = (studentId: string, present: boolean) => {
    setAttendanceList((prev) => prev.map((student) => (student.id === studentId ? { ...student, present } : student)))
  }

  const handleSubmitAttendance = async () => {
    if (!selectedCourse) {
      toast({
        variant: "destructive",
        title: "Course selection required",
        description: "Please select a course before submitting attendance.",
      })
      return
    }

    const unmarkedStudents = attendanceList.filter((student) => student.present === null)
    if (unmarkedStudents.length > 0) {
      toast({
        variant: "destructive",
        title: "Incomplete attendance",
        description: `${unmarkedStudents.length} students have not been marked. Please complete the attendance.`,
      })
      return
    }

    setIsSubmitting(true)

    try {
      // In a real app, this would call your API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Attendance submitted",
        description: "Attendance has been successfully recorded.",
      })

      // Reset the attendance state
      setIsAttendanceStarted(false)
      setAttendanceList(students.map((student) => ({ ...student, present: null })))
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: "There was an error submitting the attendance. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const presentCount = attendanceList.filter((student) => student.present === true).length
  const absentCount = attendanceList.filter((student) => student.present === false).length
  const unmarkedCount = attendanceList.filter((student) => student.present === null).length

  return (
    <AppShell navigation={navigation}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
          <p className="text-muted-foreground">Take and manage attendance for your classes</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Present</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{presentCount}</div>
              <p className="text-xs text-muted-foreground">
                {((presentCount / attendanceList.length) * 100).toFixed(1)}% of class
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{absentCount}</div>
              <p className="text-xs text-muted-foreground">
                {((absentCount / attendanceList.length) * 100).toFixed(1)}% of class
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Unmarked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{unmarkedCount}</div>
              <p className="text-xs text-muted-foreground">
                {((unmarkedCount / attendanceList.length) * 100).toFixed(1)}% of class
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Take Attendance</CardTitle>
            <CardDescription>Select a course and mark attendance for students</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <Select value={selectedCourse} onValueChange={setSelectedCourse} disabled={isAttendanceStarted}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name} - Section {course.section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  {isAttendanceStarted ? (
                    <>
                      <Button variant="outline" onClick={() => setIsAttendanceStarted(false)} disabled={isSubmitting}>
                        Cancel
                      </Button>
                      <Button onClick={handleSubmitAttendance} disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          "Submit Attendance"
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button onClick={handleStartAttendance}>Start Attendance</Button>
                  )}
                </div>
              </div>

              {isAttendanceStarted && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>

                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Last Attendance</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredStudents.length > 0 ? (
                          filteredStudents.map((student) => (
                            <TableRow key={student.id}>
                              <TableCell>{student.studentId}</TableCell>
                              <TableCell>{student.name}</TableCell>
                              <TableCell>
                                {student.lastAttendance ? (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span>{student.lastAttendance}</span>
                                  </div>
                                ) : (
                                  "N/A"
                                )}
                              </TableCell>
                              <TableCell>
                                {student.present === true ? (
                                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                                    Present
                                  </span>
                                ) : student.present === false ? (
                                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                                    Absent
                                  </span>
                                ) : (
                                  <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                                    Unmarked
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-green-600"
                                    onClick={() => handleMarkAttendance(student.id, true)}
                                  >
                                    <Check className="h-4 w-4" />
                                    <span className="sr-only">Mark present</span>
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-600"
                                    onClick={() => handleMarkAttendance(student.id, false)}
                                  >
                                    <X className="h-4 w-4" />
                                    <span className="sr-only">Mark absent</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="h-24 text-center">
                              No students found.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Reports</CardTitle>
            <CardDescription>View and download attendance reports for your courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="flex-1">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name} - Section {course.section}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" className="gap-2">
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Present</TableHead>
                      <TableHead>Absent</TableHead>
                      <TableHead>Attendance Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <TableRow key={i}>
                        <TableCell>{new Date(Date.now() - i * 86400000 * 7).toLocaleDateString()}</TableCell>
                        <TableCell>Introduction to Programming - Section A</TableCell>
                        <TableCell>{20 - i}</TableCell>
                        <TableCell>{i}</TableCell>
                        <TableCell>{(((20 - i) / 20) * 100).toFixed(1)}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  )
}
