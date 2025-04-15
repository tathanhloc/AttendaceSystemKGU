"use client"

import { useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"


import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { AppShell } from "@/components/app-shell"
import { navigation } from "@/app/admin/dashboard/page"
import { Button } from "@/components/ui/button"

type MonHoc = {
  id: string
  maMh: string
  tenMh: string
  soTinChi: number
  moTa?: string
}

export default function MonHocPage() {
  const [data, setData] = useState<MonHoc[]>([
    { id: "1", maMh: "IT101", tenMh: "Lập trình C++", soTinChi: 3 },
    { id: "2", maMh: "IT202", tenMh: "Cơ sở dữ liệu", soTinChi: 4 },
  ])

  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [form, setForm] = useState({ id: "", maMh: "", tenMh: "", soTinChi: "", moTa: "" })

  const handleAdd = () => {
    setForm({ id: "", maMh: "", tenMh: "", soTinChi: "", moTa: "" })
    setIsEdit(false)
    setOpen(true)
  }

  const handleEdit = (item: MonHoc) => {
    setForm({
      id: item.id,
      maMh: item.maMh,
      tenMh: item.tenMh,
      soTinChi: item.soTinChi.toString(),
      moTa: item.moTa || "",
    })
    setIsEdit(true)
    setOpen(true)
  }

  const handleSubmit = () => {
    const newItem: MonHoc = {
      id: form.id || Date.now().toString(),
      maMh: form.maMh,
      tenMh: form.tenMh,
      soTinChi: Number(form.soTinChi),
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

  const columns: ColumnDef<MonHoc>[] = [
    { accessorKey: "maMh", header: "Mã môn học" },
    { accessorKey: "tenMh", header: "Tên môn học" },
    { accessorKey: "soTinChi", header: "Số tín chỉ" },
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
            <h1 className="text-3xl font-bold">Môn học</h1>
            <p className="text-muted-foreground">Quản lý danh sách môn học của trường</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm môn học
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
            <DialogTitle>{isEdit ? "Chỉnh sửa môn học" : "Thêm môn học"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maMh">Mã môn</Label>
              <Input id="maMh" value={form.maMh} onChange={(e) => setForm({ ...form, maMh: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tenMh">Tên môn</Label>
              <Input id="tenMh" value={form.tenMh} onChange={(e) => setForm({ ...form, tenMh: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="soTinChi">Số tín chỉ</Label>
              <Input id="soTinChi" type="number" value={form.soTinChi} onChange={(e) => setForm({ ...form, soTinChi: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="moTa">Mô tả</Label>
              <Input id="moTa" value={form.moTa} onChange={(e) => setForm({ ...form, moTa: e.target.value })} className="col-span-3" />
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
