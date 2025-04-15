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

import { Plus } from "lucide-react"
import { Pencil } from "lucide-react"
import { Trash2 } from "lucide-react"

type PhongHoc = {
  id: string
  maPhong: string
  tenPhong: string
  moTa?: string
}

export default function PhongHocPage() {
  const [data, setData] = useState<PhongHoc[]>([
    { id: "1", maPhong: "PH101", tenPhong: "Phòng máy 1", moTa: "Trang bị 40 máy" },
    { id: "2", maPhong: "PH102", tenPhong: "Phòng máy 2", moTa: "Phòng lý thuyết" },
  ])

  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [form, setForm] = useState({ id: "", maPhong: "", tenPhong: "", moTa: "" })

  const handleAdd = () => {
    setForm({ id: "", maPhong: "", tenPhong: "", moTa: "" })
    setIsEdit(false)
    setOpen(true)
  }

  const handleEdit = (item: PhongHoc) => {
    setForm({ id: item.id, maPhong: item.maPhong, tenPhong: item.tenPhong, moTa: item.moTa || "" })
    setIsEdit(true)
    setOpen(true)
  }

  const handleSubmit = () => {
    const newItem: PhongHoc = {
      id: form.id || Date.now().toString(),
      maPhong: form.maPhong,
      tenPhong: form.tenPhong,
      moTa: form.moTa,
    }

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

  const columns: ColumnDef<PhongHoc>[] = [
    { accessorKey: "maPhong", header: "Mã phòng" },
    { accessorKey: "tenPhong", header: "Tên phòng" },
    { accessorKey: "moTa", header: "Mô tả" },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id)}>
              <Trash2 className="h-4 w-4" />
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
            <h1 className="text-3xl font-bold">Phòng học</h1>
            <p className="text-muted-foreground">Quản lý danh sách phòng học sử dụng trong giảng dạy</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm phòng học
          </Button>
        </div>

        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-10 text-muted-foreground">
                    Không có dữ liệu.
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
            <DialogTitle>{isEdit ? "Chỉnh sửa phòng học" : "Thêm phòng học"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maPhong">Mã phòng</Label>
              <Input
                id="maPhong"
                value={form.maPhong}
                onChange={(e) => setForm({ ...form, maPhong: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tenPhong">Tên phòng</Label>
              <Input
                id="tenPhong"
                value={form.tenPhong}
                onChange={(e) => setForm({ ...form, tenPhong: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="moTa">Mô tả</Label>
              <Input
                id="moTa"
                value={form.moTa}
                onChange={(e) => setForm({ ...form, moTa: e.target.value })}
                className="col-span-3"
              />
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
