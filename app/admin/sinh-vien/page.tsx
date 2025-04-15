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

type SinhVien = {
  id: string
  maSv: string
  hoTen: string
  email: string
  gioiTinh: "Nam" | "Nữ"
  ngaySinh: string
  maLop: string
  isActive: boolean
}

export default function SinhVienPage() {
  const [data, setData] = useState<SinhVien[]>([
    {
      id: "1",
      maSv: "B0220001",
      hoTen: "Nguyễn Văn A",
      email: "vana@example.com",
      gioiTinh: "Nam",
      ngaySinh: "2003-08-10",
      maLop: "B022TT1",
      isActive: true,
    },
  ])

  const lopOptions = ["B022TT1", "B022KT1", "B022QTKD"]
  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [form, setForm] = useState<SinhVien>({
    id: "",
    maSv: "",
    hoTen: "",
    email: "",
    gioiTinh: "Nam",
    ngaySinh: "",
    maLop: "",
    isActive: true,
  })

  const handleAdd = () => {
    setForm({
      id: "",
      maSv: "",
      hoTen: "",
      email: "",
      gioiTinh: "Nam",
      ngaySinh: "",
      maLop: "",
      isActive: true,
    })
    setIsEdit(false)
    setOpen(true)
  }

  const handleEdit = (sv: SinhVien) => {
    setForm({ ...sv })
    setIsEdit(true)
    setOpen(true)
  }

  const handleSubmit = () => {
    const newItem = { ...form, id: form.id || Date.now().toString() }

    if (isEdit) {
      setData((prev) => prev.map((s) => (s.id === newItem.id ? newItem : s)))
    } else {
      setData((prev) => [...prev, newItem])
    }

    setOpen(false)
  }

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((s) => s.id !== id))
  }

  const columns: ColumnDef<SinhVien>[] = [
    { accessorKey: "maSv", header: "MSSV" },
    { accessorKey: "hoTen", header: "Họ tên" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "gioiTinh", header: "Giới tính" },
    { accessorKey: "ngaySinh", header: "Ngày sinh" },
    { accessorKey: "maLop", header: "Lớp" },
    {
      accessorKey: "isActive",
      header: "Trạng thái",
      cell: ({ row }) =>
        row.original.isActive ? (
          <Badge variant="default">Hoạt động</Badge>
        ) : (
          <Badge variant="secondary">Bị khóa</Badge>
        ),
    },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        const sv = row.original
        return (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleEdit(sv)}>
              <Pencil className="w-4 h-4" />
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleDelete(sv.id)}>
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
            <h1 className="text-3xl font-bold">Sinh viên</h1>
            <p className="text-muted-foreground">Quản lý danh sách sinh viên theo lớp học</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm sinh viên
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
            <DialogTitle>{isEdit ? "Chỉnh sửa sinh viên" : "Thêm sinh viên"}</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>MSSV</Label>
              <Input value={form.maSv} onChange={(e) => setForm({ ...form, maSv: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Họ tên</Label>
              <Input value={form.hoTen} onChange={(e) => setForm({ ...form, hoTen: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Giới tính</Label>
              <Select value={form.gioiTinh} onValueChange={(v) => setForm({ ...form, gioiTinh: v as "Nam" | "Nữ" })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn giới tính" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nam">Nam</SelectItem>
                  <SelectItem value="Nữ">Nữ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Ngày sinh</Label>
              <Input type="date" value={form.ngaySinh} onChange={(e) => setForm({ ...form, ngaySinh: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Lớp</Label>
              <Select value={form.maLop} onValueChange={(v) => setForm({ ...form, maLop: v })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn lớp" />
                </SelectTrigger>
                <SelectContent>
                  {lopOptions.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Hoạt động</Label>
              <Switch checked={form.isActive} onCheckedChange={(v) => setForm({ ...form, isActive: v })} />
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleSubmit}>
              {isEdit ? "Lưu thay đổi" : "Thêm mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
