"use client"

import { useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { AppShell } from "@/components/app-shell"
import { navigation } from "@/app/admin/dashboard/page"
import { Plus, Pencil, Trash2 } from "lucide-react"

type NamHoc = {
  id: string
  ten: string
  namBatDau: number
  namKetThuc: number
  soHocKy: number
}

export default function NamHocPage() {
  const [data, setData] = useState<NamHoc[]>([
    { id: "1", ten: "2022 - 2023", namBatDau: 2022, namKetThuc: 2023, soHocKy: 2 },
    { id: "2", ten: "2023 - 2024", namBatDau: 2023, namKetThuc: 2024, soHocKy: 3 },
  ])

  const [open, setOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({ id: "", ten: "", namBatDau: "", namKetThuc: "", soHocKy: "" })

  const handleOpenAdd = () => {
    setForm({ id: "", ten: "", namBatDau: "", namKetThuc: "", soHocKy: "" })
    setIsEditing(false)
    setOpen(true)
  }

  const handleOpenEdit = (row: NamHoc) => {
    setForm({
      id: row.id,
      ten: row.ten,
      namBatDau: row.namBatDau.toString(),
      namKetThuc: row.namKetThuc.toString(),
      soHocKy: row.soHocKy.toString(),
    })
    setIsEditing(true)
    setOpen(true)
  }

  const handleSubmit = () => {
    const newItem: NamHoc = {
      id: form.id || Date.now().toString(),
      ten: form.ten,
      namBatDau: Number(form.namBatDau),
      namKetThuc: Number(form.namKetThuc),
      soHocKy: Number(form.soHocKy),
    }

    if (isEditing) {
      setData((prev) => prev.map((i) => (i.id === newItem.id ? newItem : i)))
    } else {
      setData((prev) => [...prev, newItem])
    }

    setOpen(false)
  }

  const handleDelete = (id: string) => {
    setData((prev) => prev.filter((i) => i.id !== id))
  }

  const columns: ColumnDef<NamHoc>[] = [
    { accessorKey: "ten", header: "Tên năm học" },
    { accessorKey: "namBatDau", header: "Bắt đầu" },
    { accessorKey: "namKetThuc", header: "Kết thúc" },
    { accessorKey: "soHocKy", header: "Số học kỳ" },
    {
      id: "actions",
      header: "Thao tác",
      cell: ({ row }) => {
        const item = row.original
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleOpenEdit(item)}>
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
            <h1 className="text-3xl font-bold">Năm học</h1>
            <p className="text-muted-foreground">Quản lý các năm học trong hệ thống</p>
          </div>
          <Button onClick={handleOpenAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm năm học
          </Button>
        </div>

        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
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

      {/* Dialog thêm/sửa */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Cập nhật năm học" : "Thêm năm học"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ten">Tên</Label>
              <Input id="ten" value={form.ten} onChange={(e) => setForm({ ...form, ten: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="batDau">Bắt đầu</Label>
              <Input id="batDau" type="number" value={form.namBatDau} onChange={(e) => setForm({ ...form, namBatDau: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ketThuc">Kết thúc</Label>
              <Input id="ketThuc" type="number" value={form.namKetThuc} onChange={(e) => setForm({ ...form, namKetThuc: e.target.value })} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="soHocKy">Số học kỳ</Label>
              <Input id="soHocKy" type="number" value={form.soHocKy} onChange={(e) => setForm({ ...form, soHocKy: e.target.value })} className="col-span-3" />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>{isEditing ? "Cập nhật" : "Thêm"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
