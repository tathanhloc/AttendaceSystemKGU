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

import { Plus } from "lucide-react"
import { Pencil } from "lucide-react"
import { Trash2 } from "lucide-react"

type Lop = {
  id: string
  maLop: string
  tenLop: string
  maNganh: string
  maKhoaHoc: string
  maKhoa: string
}

export default function LopHocPage() {
  const [data, setData] = useState<Lop[]>([
    { id: "1", maLop: "B022TT1", tenLop: "Lớp CNTT 1", maNganh: "CNTT", maKhoaHoc: "K7", maKhoa: "K01" },
    { id: "2", maLop: "B022KT1", tenLop: "Lớp KT 1", maNganh: "KT", maKhoaHoc: "K8", maKhoa: "K02" },
  ])

  const nganhOptions = ["CNTT", "KT", "QTKD"]
  const khoaHocOptions = ["K7", "K8", "K9", "K10"]
  const khoaOptions = ["K01", "K02", "K03"]

  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [form, setForm] = useState({
    id: "",
    maLop: "",
    tenLop: "",
    maNganh: "",
    maKhoaHoc: "",
    maKhoa: "",
  })

  const handleAdd = () => {
    setForm({ id: "", maLop: "", tenLop: "", maNganh: "", maKhoaHoc: "", maKhoa: "" })
    setIsEdit(false)
    setOpen(true)
  }

  const handleEdit = (item: Lop) => {
    setForm({
      id: item.id,
      maLop: item.maLop,
      tenLop: item.tenLop,
      maNganh: item.maNganh,
      maKhoaHoc: item.maKhoaHoc,
      maKhoa: item.maKhoa,
    })
    setIsEdit(true)
    setOpen(true)
  }

  const handleSubmit = () => {
    const newItem: Lop = {
      id: form.id || Date.now().toString(),
      maLop: form.maLop,
      tenLop: form.tenLop,
      maNganh: form.maNganh,
      maKhoaHoc: form.maKhoaHoc,
      maKhoa: form.maKhoa,
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

  const columns: ColumnDef<Lop>[] = [
    { accessorKey: "maLop", header: "Mã lớp" },
    { accessorKey: "tenLop", header: "Tên lớp" },
    { accessorKey: "maNganh", header: "Ngành" },
    { accessorKey: "maKhoaHoc", header: "Khóa học" },
    { accessorKey: "maKhoa", header: "Khoa" },
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
            <h1 className="text-3xl font-bold">Lớp học</h1>
            <p className="text-muted-foreground">Quản lý danh sách lớp học trong từng ngành, khóa học và khoa</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm lớp học
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
            <DialogTitle>{isEdit ? "Chỉnh sửa lớp học" : "Thêm lớp học"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maLop">Mã lớp</Label>
              <Input id="maLop" value={form.maLop} onChange={(e) => setForm({ ...form, maLop: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tenLop">Tên lớp</Label>
              <Input id="tenLop" value={form.tenLop} onChange={(e) => setForm({ ...form, tenLop: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Ngành</Label>
              <Select value={form.maNganh} onValueChange={(value) => setForm({ ...form, maNganh: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn ngành" />
                </SelectTrigger>
                <SelectContent>
                  {nganhOptions.map((ng) => (
                    <SelectItem key={ng} value={ng}>
                      {ng}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Khóa học</Label>
              <Select value={form.maKhoaHoc} onValueChange={(value) => setForm({ ...form, maKhoaHoc: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn khóa học" />
                </SelectTrigger>
                <SelectContent>
                  {khoaHocOptions.map((kh) => (
                    <SelectItem key={kh} value={kh}>
                      {kh}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Khoa</Label>
              <Select value={form.maKhoa} onValueChange={(value) => setForm({ ...form, maKhoa: value })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn khoa" />
                </SelectTrigger>
                <SelectContent>
                  {khoaOptions.map((k) => (
                    <SelectItem key={k} value={k}>
                      {k}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
