"use client"

import { useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { AppShell } from "@/components/app-shell"
import { navigation } from "@/app/admin/dashboard/page"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table"
import { Pencil, Plus, Trash2 } from "lucide-react"

type HocKy = {
  id: string
  ten: string
  moTa: string
}

export default function HocKyPage() {
  const [data, setData] = useState<HocKy[]>([
    { id: "1", ten: "Học kỳ 1", moTa: "Học kỳ đầu tiên trong năm học" },
    { id: "2", ten: "Học kỳ 2", moTa: "Học kỳ thứ hai trong năm học" },
    { id: "3", ten: "Học kỳ hè", moTa: "Học kỳ hè bổ sung" },
  ])

  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [form, setForm] = useState({ id: "", ten: "", moTa: "" })

  const handleAdd = () => {
    setForm({ id: "", ten: "", moTa: "" })
    setIsEdit(false)
    setOpen(true)
  }

  const handleEdit = (item: HocKy) => {
    setForm({ id: item.id, ten: item.ten, moTa: item.moTa })
    setIsEdit(true)
    setOpen(true)
  }

  const handleSubmit = () => {
    const newItem: HocKy = {
      id: form.id || Date.now().toString(),
      ten: form.ten,
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

  const columns: ColumnDef<HocKy>[] = [
    { accessorKey: "ten", header: "Tên học kỳ" },
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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Học kỳ</h1>
            <p className="text-muted-foreground">Quản lý danh sách các học kỳ trong năm học.</p>
          </div>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm học kỳ
          </Button>
        </div>

        <div className="rounded-md border overflow-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => (
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
            <DialogTitle>{isEdit ? "Chỉnh sửa học kỳ" : "Thêm học kỳ"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ten">Tên</Label>
              <Input id="ten" value={form.ten} onChange={(e) => setForm({ ...form, ten: e.target.value })} className="col-span-3" />
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
