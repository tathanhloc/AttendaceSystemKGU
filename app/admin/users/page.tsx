"use client"

import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { getCoreRowModel } from "@tanstack/react-table"
import { useReactTable } from "@tanstack/react-table"
import { flexRender } from "@tanstack/react-table"

import { AppShell } from "@/components/app-shell"
import { navigation } from "@/app/admin/dashboard/page"

import { Table } from "@/components/ui/table"
import { TableHeader } from "@/components/ui/table"
import { TableRow } from "@/components/ui/table"
import { TableHead } from "@/components/ui/table"
import { TableBody } from "@/components/ui/table"
import { TableCell } from "@/components/ui/table"

import { Dialog } from "@/components/ui/dialog"
import { DialogContent } from "@/components/ui/dialog"
import { DialogHeader } from "@/components/ui/dialog"
import { DialogTitle } from "@/components/ui/dialog"
import { DialogFooter } from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

import { Select } from "@/components/ui/select"
import { SelectContent } from "@/components/ui/select"
import { SelectItem } from "@/components/ui/select"
import { SelectTrigger } from "@/components/ui/select"
import { SelectValue } from "@/components/ui/select"

import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

import { Plus } from "lucide-react"
import { Pencil } from "lucide-react"
import { Trash2 } from "lucide-react"

type User = {
  id: string
  name: string
  email: string
  role: "admin" | "teacher" | "student"
  department: string
  isActive: boolean
  createdAt: string
}

export default function UsersPage() {
  const [data, setData] = useState<User[]>([
    {
      id: "1",
      name: "Nguyễn Văn A",
      email: "a@example.com",
      role: "admin",
      department: "Phòng đào tạo",
      isActive: true,
      createdAt: "2023-10-01",
    },
    {
      id: "2",
      name: "Trần Thị B",
      email: "b@example.com",
      role: "teacher",
      department: "Khoa CNTT",
      isActive: true,
      createdAt: "2023-10-05",
    },
  ])

  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [form, setForm] = useState<User>({
    id: "",
    name: "",
    email: "",
    role: "student",
    department: "",
    isActive: true,
    createdAt: "",
  })

  const handleAdd = () => {
    setForm({
      id: "",
      name: "",
      email: "",
      role: "student",
      department: "",
      isActive: true,
      createdAt: "",
    })
    setIsEdit(false)
    setOpen(true)
  }

  const handleEdit = (item: User) => {
    setForm({ ...item })
    setIsEdit(true)
    setOpen(true)
  }

  const handleSubmit = () => {
    const now = new Date().toISOString().split("T")[0]
    const newItem = { ...form, id: form.id || Date.now().toString(), createdAt: form.createdAt || now }

    if (isEdit) {
      setData((prev) => prev.map((item) => (item.id === newItem.id ? newItem : item)))
    } else {
      setData((prev) => [...prev, newItem])
    }

    setOpen(false)
  }

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((item) => item.id !== id))
  }

  const columns: ColumnDef<User>[] = [
    { accessorKey: "name", header: "Họ tên" },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "role",
      header: "Vai trò",
      cell: ({ row }) => {
        const r = row.getValue("role")
        return (
          <Badge variant="outline">
            {r === "admin" ? "Admin" : r === "teacher" ? "Giảng viên" : "Sinh viên"}
          </Badge>
        )
      },
    },
    { accessorKey: "department", header: "Bộ phận / Khoa" },
    {
      accessorKey: "isActive",
      header: "Trạng thái",
      cell: ({ row }) => {
        return row.getValue("isActive") ? (
          <Badge variant="default">Hoạt động</Badge>
        ) : (
          <Badge variant="secondary">Bị khóa</Badge>
        )
      },
    },
    { accessorKey: "createdAt", header: "Ngày tạo" },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(item.id)}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <AppShell navigation={navigation}>
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Người dùng</h1>
            <p className="text-muted-foreground">Quản lý tài khoản người dùng toàn hệ thống</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm người dùng
          </Button>
        </div>

        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-10 text-muted-foreground">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEdit ? "Chỉnh sửa người dùng" : "Thêm người dùng"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Họ tên</Label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Vai trò</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as User["role"] })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="teacher">Giảng viên</SelectItem>
                  <SelectItem value="student">Sinh viên</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Bộ phận</Label>
              <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Hoạt động</Label>
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit}>{isEdit ? "Lưu thay đổi" : "Thêm mới"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
