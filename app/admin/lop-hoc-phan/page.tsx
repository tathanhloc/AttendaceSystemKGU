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

import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

import { Plus } from "lucide-react"
import { Pencil } from "lucide-react"
import { Trash2 } from "lucide-react"

type LopHocPhan = {
  id: string
  maLhp: string
  maMh: string
  maGv: string
  hocKy: string
  namHoc: string
  nhom: string
  isActive: boolean
}

export default function LopHocPhanPage() {
  const [data, setData] = useState<LopHocPhan[]>([
    { id: "1", maLhp: "LHP001", maMh: "IT001", maGv: "GV001", hocKy: "1", namHoc: "2023-2024", nhom: "1", isActive: true },
    { id: "2", maLhp: "LHP002", maMh: "IT002", maGv: "GV002", hocKy: "2", namHoc: "2023-2024", nhom: "2", isActive: false },
  ])

  const monHocOptions = ["IT001", "IT002", "IT003"]
  const giangVienOptions = ["GV001", "GV002", "GV003"]
  const hocKyOptions = ["1", "2", "3"]
  const namHocOptions = ["2022-2023", "2023-2024", "2024-2025"]

  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [form, setForm] = useState<LopHocPhan>({
    id: "",
    maLhp: "",
    maMh: "",
    maGv: "",
    hocKy: "",
    namHoc: "",
    nhom: "",
    isActive: true,
  })

  const handleAdd = () => {
    setForm({ id: "", maLhp: "", maMh: "", maGv: "", hocKy: "", namHoc: "", nhom: "", isActive: true })
    setIsEdit(false)
    setOpen(true)
  }

  const handleEdit = (item: LopHocPhan) => {
    setForm({ ...item })
    setIsEdit(true)
    setOpen(true)
  }

  const handleSubmit = () => {
    const newItem = { ...form, id: form.id || Date.now().toString() }

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

  const columns: ColumnDef<LopHocPhan>[] = [
    { accessorKey: "maLhp", header: "Mã LHP" },
    { accessorKey: "maMh", header: "Môn học" },
    { accessorKey: "maGv", header: "Giảng viên" },
    { accessorKey: "hocKy", header: "Học kỳ" },
    { accessorKey: "namHoc", header: "Năm học" },
    { accessorKey: "nhom", header: "Nhóm" },
    {
      accessorKey: "isActive",
      header: "Trạng thái",
      cell: ({ row }) => (
        row.original.isActive ? (
          <Badge variant="default">Đang hoạt động</Badge>
        ) : (
          <Badge variant="secondary">Ngưng hoạt động</Badge>
        )
      ),
    },
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
            <h1 className="text-3xl font-bold">Lớp học phần</h1>
            <p className="text-muted-foreground">Quản lý các lớp học phần, giảng viên giảng dạy và trạng thái.</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm lớp học phần
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
            <DialogTitle>{isEdit ? "Chỉnh sửa LHP" : "Thêm LHP"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Mã LHP</Label>
              <Input value={form.maLhp} onChange={(e) => setForm({ ...form, maLhp: e.target.value })} className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Môn học</Label>
              <Select value={form.maMh} onValueChange={(v) => setForm({ ...form, maMh: v })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn môn học" />
                </SelectTrigger>
                <SelectContent>
                  {monHocOptions.map((m) => (
                    <SelectItem key={m} value={m}>{m}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Giảng viên</Label>
              <Select value={form.maGv} onValueChange={(v) => setForm({ ...form, maGv: v })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn giảng viên" />
                </SelectTrigger>
                <SelectContent>
                  {giangVienOptions.map((g) => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Học kỳ</Label>
              <Select value={form.hocKy} onValueChange={(v) => setForm({ ...form, hocKy: v })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn học kỳ" />
                </SelectTrigger>
                <SelectContent>
                  {hocKyOptions.map((h) => (
                    <SelectItem key={h} value={h}>{h}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Năm học</Label>
              <Select value={form.namHoc} onValueChange={(v) => setForm({ ...form, namHoc: v })}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Chọn năm học" />
                </SelectTrigger>
                <SelectContent>
                  {namHocOptions.map((n) => (
                    <SelectItem key={n} value={n}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label>Nhóm</Label>
              <Input type="number" value={form.nhom} onChange={(e) => setForm({ ...form, nhom: e.target.value })} className="col-span-3" />
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
