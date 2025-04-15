"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, Download, MoreHorizontal, Pencil, Plus, Trash, Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { AppShell } from "@/components/app-shell"
import { khoaData, type Khoa } from "@/lib/data/khoa-data"
import { navigation } from "../dashboard/page"

export default function KhoaPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState<Khoa[]>(khoaData)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedKhoa, setSelectedKhoa] = useState<Khoa | null>(null)
  const [newKhoa, setNewKhoa] = useState<Partial<Khoa>>({
    maKhoa: "",
    tenKhoa: "",
    isActive: true,
  })
  const { toast } = useToast()

  const columns: ColumnDef<Khoa>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Chọn tất cả"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Chọn hàng"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "maKhoa",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Mã khoa
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("maKhoa")}</div>,
    },
    {
      accessorKey: "tenKhoa",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Tên khoa
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("tenKhoa")}</div>,
    },
    {
      accessorKey: "isActive",
      header: "Trạng thái",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive") as boolean
        return (
          <div>
            {isActive ? (
              <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">Hoạt động</span>
            ) : (
              <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-800">
                Không hoạt động
              </span>
            )}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const khoa = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Mở menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(khoa.maKhoa)}>
                Sao chép mã khoa
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleViewDetails(khoa)}>Xem chi tiết</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(khoa)}>
                <Pencil className="mr-2 h-4 w-4" />
                Chỉnh sửa
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(khoa)} className="text-red-600">
                <Trash className="mr-2 h-4 w-4" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const handleViewDetails = (khoa: Khoa) => {
    setSelectedKhoa(khoa)
    // Trong ứng dụng thực tế, bạn có thể chuyển hướng đến trang chi tiết
    toast({
      title: "Xem chi tiết khoa",
      description: `Đang xem chi tiết khoa: ${khoa.tenKhoa}`,
    })
  }

  const handleAdd = () => {
    setNewKhoa({
      maKhoa: "",
      tenKhoa: "",
      isActive: true,
    })
    setIsAddDialogOpen(true)
  }

  const handleEdit = (khoa: Khoa) => {
    setSelectedKhoa(khoa)
    setNewKhoa({ ...khoa })
    setIsEditDialogOpen(true)
  }

  const handleDelete = (khoa: Khoa) => {
    setSelectedKhoa(khoa)
    setIsDeleteDialogOpen(true)
  }

  const handleSaveAdd = () => {
    if (!newKhoa.maKhoa || !newKhoa.tenKhoa) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin khoa.",
      })
      return
    }

    // Kiểm tra mã khoa đã tồn tại chưa
    if (data.some((khoa) => khoa.maKhoa === newKhoa.maKhoa)) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Mã khoa đã tồn tại. Vui lòng chọn mã khoa khác.",
      })
      return
    }

    const newKhoaItem: Khoa = {
      maKhoa: newKhoa.maKhoa!,
      tenKhoa: newKhoa.tenKhoa!,
      isActive: newKhoa.isActive ?? true,
    }

    setData([...data, newKhoaItem])
    setIsAddDialogOpen(false)
    toast({
      title: "Thêm khoa thành công",
      description: `Đã thêm khoa: ${newKhoaItem.tenKhoa}`,
    })
  }

  const handleSaveEdit = () => {
    if (!selectedKhoa || !newKhoa.maKhoa || !newKhoa.tenKhoa) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ thông tin khoa.",
      })
      return
    }

    // Kiểm tra mã khoa đã tồn tại chưa (nếu đã thay đổi)
    if (newKhoa.maKhoa !== selectedKhoa.maKhoa && data.some((khoa) => khoa.maKhoa === newKhoa.maKhoa)) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Mã khoa đã tồn tại. Vui lòng chọn mã khoa khác.",
      })
      return
    }

    const updatedData = data.map((khoa) =>
      khoa.maKhoa === selectedKhoa.maKhoa
        ? {
            ...khoa,
            maKhoa: newKhoa.maKhoa!,
            tenKhoa: newKhoa.tenKhoa!,
            isActive: newKhoa.isActive ?? khoa.isActive,
          }
        : khoa,
    )

    setData(updatedData)
    setIsEditDialogOpen(false)
    toast({
      title: "Cập nhật khoa thành công",
      description: `Đã cập nhật khoa: ${newKhoa.tenKhoa}`,
    })
  }

  const handleConfirmDelete = () => {
    if (!selectedKhoa) return

    const updatedData = data.filter((khoa) => khoa.maKhoa !== selectedKhoa.maKhoa)
    setData(updatedData)
    setIsDeleteDialogOpen(false)
    toast({
      title: "Xóa khoa thành công",
      description: `Đã xóa khoa: ${selectedKhoa.tenKhoa}`,
    })
  }

  const handleDeleteSelected = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    if (selectedRows.length === 0) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất một khoa để xóa.",
      })
      return
    }

    const selectedIds = selectedRows.map((row) => row.original.maKhoa)
    const updatedData = data.filter((khoa) => !selectedIds.includes(khoa.maKhoa))
    setData(updatedData)
    setRowSelection({})
    toast({
      title: "Xóa khoa thành công",
      description: `Đã xóa ${selectedRows.length} khoa.`,
    })
  }

  return (
    <AppShell navigation={navigation}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-primary">Quản lý khoa</h1>
          <p className="text-muted-foreground">Quản lý thông tin các khoa trong trường</p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Tìm kiếm khoa..."
                value={(table.getColumn("tenKhoa")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("tenKhoa")?.setFilterValue(event.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Upload className="h-4 w-4" />
                Nhập
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Download className="h-4 w-4" />
                Xuất
              </Button>
              <Button size="sm" className="h-8 gap-1 bg-primary hover:bg-primary/90" onClick={handleAdd}>
                <Plus className="h-4 w-4" />
                Thêm khoa
              </Button>
            </div>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      Không có dữ liệu.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} trong {table.getFilteredRowModel().rows.length} hàng
              được chọn.
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Trước
              </Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                Sau
              </Button>
              {table.getFilteredSelectedRowModel().rows.length > 0 && (
                <Button variant="destructive" size="sm" onClick={handleDeleteSelected}>
                  Xóa đã chọn
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialog thêm khoa */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Thêm khoa mới</DialogTitle>
            <DialogDescription>Nhập thông tin chi tiết cho khoa mới.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="maKhoa" className="text-right">
                Mã khoa
              </Label>
              <Input
                id="maKhoa"
                value={newKhoa.maKhoa || ""}
                onChange={(e) => setNewKhoa({ ...newKhoa, maKhoa: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="tenKhoa" className="text-right">
                Tên khoa
              </Label>
              <Input
                id="tenKhoa"
                value={newKhoa.tenKhoa || ""}
                onChange={(e) => setNewKhoa({ ...newKhoa, tenKhoa: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="isActive" className="text-right">
                Hoạt động
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={newKhoa.isActive}
                  onCheckedChange={(checked) => setNewKhoa({ ...newKhoa, isActive: checked })}
                />
                <Label htmlFor="isActive">{newKhoa.isActive ? "Đang hoạt động" : "Không hoạt động"}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveAdd} className="bg-primary hover:bg-primary/90">
              Thêm khoa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog chỉnh sửa khoa */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa khoa</DialogTitle>
            <DialogDescription>Cập nhật thông tin chi tiết cho khoa.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editMaKhoa" className="text-right">
                Mã khoa
              </Label>
              <Input
                id="editMaKhoa"
                value={newKhoa.maKhoa || ""}
                onChange={(e) => setNewKhoa({ ...newKhoa, maKhoa: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editTenKhoa" className="text-right">
                Tên khoa
              </Label>
              <Input
                id="editTenKhoa"
                value={newKhoa.tenKhoa || ""}
                onChange={(e) => setNewKhoa({ ...newKhoa, tenKhoa: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="editIsActive" className="text-right">
                Hoạt động
              </Label>
              <div className="col-span-3 flex items-center space-x-2">
                <Switch
                  id="editIsActive"
                  checked={newKhoa.isActive}
                  onCheckedChange={(checked) => setNewKhoa({ ...newKhoa, isActive: checked })}
                />
                <Label htmlFor="editIsActive">{newKhoa.isActive ? "Đang hoạt động" : "Không hoạt động"}</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveEdit} className="bg-primary hover:bg-primary/90">
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog xác nhận xóa */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>Bạn có chắc chắn muốn xóa khoa này không?</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedKhoa && (
              <p>
                Bạn đang xóa khoa: <strong>{selectedKhoa.tenKhoa}</strong> ({selectedKhoa.maKhoa})
              </p>
            )}
            <p className="mt-2 text-sm text-red-500">Lưu ý: Hành động này không thể hoàn tác.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppShell>
  )
}
