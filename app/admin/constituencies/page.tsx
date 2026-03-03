'use client'

import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { PaginationBar } from '@/components/shared/pagination-bar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  useAdminConstituencies,
  useCreateConstituencyMutation,
  useDeleteConstituencyMutation,
} from '@/hooks/use-constituencies'
import { useProvinces } from '@/hooks/use-location'
import { useURLPagination } from '@/hooks/use-url-pagination'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus, Trash } from 'lucide-react'
import { Suspense, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// --- Zod Schema ---
const constituencySchema = z.object({
  provinceId: z.string().min(1, 'กรุณาเลือกจังหวัด'),
  zoneNumber: z.number().min(1, 'กรุณาระบุหมายเลขเขต'),
})

type ConstituencyFormValues = z.infer<typeof constituencySchema>

// --- Main Export ---
export default function ManageConstituenciesPage() {
  return (
    <Suspense fallback={null}>
      <ConstituenciesPageContent />
    </Suspense>
  )
}

function ConstituenciesPageContent() {
  const { state, actions } = useURLPagination({
    filterKeys: ['provinceId'],
  })

  const provinceId = state.filters.provinceId || 'all'

  // Data hooks
  const { data, isLoading, refetch } = useAdminConstituencies({
    provinceId: provinceId === 'all' ? null : provinceId,
    page: state.page,
    limit: state.limit,
  })
  const { data: provinces } = useProvinces()

  const createConstituency = useCreateConstituencyMutation()
  const deleteConstituency = useDeleteConstituencyMutation()

  const constituencies = data?.constituencies || []
  const meta = data?.meta || {
    total: 0,
    page: 1,
    limit: state.limit,
    totalPages: 1,
  }

  // Dialog state
  const [isOpen, setIsOpen] = useState(false)

  // React Hook Form
  const form = useForm<ConstituencyFormValues>({
    resolver: zodResolver(constituencySchema),
    defaultValues: { provinceId: '', zoneNumber: 0 },
  })

  async function onSubmit(values: ConstituencyFormValues) {
    try {
      await createConstituency.mutateAsync({
        province: values.provinceId,
        zoneNumber: values.zoneNumber,
      })
      setIsOpen(false)
      form.reset()
      refetch()
    } catch {
      // Error handled in hook
    }
  }

  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  async function handleDelete() {
    if (deleteTarget === null) return
    try {
      await deleteConstituency.mutateAsync(deleteTarget)
      refetch()
    } catch {
      // Error handled in hook
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-3xl font-bold tracking-tight'>
          จัดการเขตเลือกตั้ง
        </h2>
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) form.reset()
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className='mr-2 h-4 w-4' /> เพิ่มเขตเลือกตั้ง
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>เพิ่มเขตเลือกตั้งใหม่</DialogTitle>
              <DialogDescription>ระบุจังหวัดและหมายเลขเขต</DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='space-y-4'
              >
                <FormField
                  control={form.control}
                  name='provinceId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>จังหวัด</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className='w-full'>
                            <SelectValue placeholder='เลือกจังหวัด' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {provinces?.map((p) => (
                            <SelectItem key={p.id} value={p.id.toString()}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='zoneNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>เขตที่</FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          placeholder='1'
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type='submit' disabled={createConstituency.isPending}>
                    {createConstituency.isPending ? 'กำลังบันทึก...' : 'บันทึก'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className='flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg border'>
        <div className='flex items-center space-x-2'>
          <span className='text-sm font-medium'>จังหวัด:</span>
          <Select
            value={provinceId}
            onValueChange={(v) => actions.setFilter('provinceId', v)}
          >
            <SelectTrigger className='w-[200px]'>
              <SelectValue placeholder='ทั้งหมด' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>ทั้งหมด</SelectItem>
              {provinces?.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex-1' />

        <div className='text-sm text-muted-foreground'>
          ทั้งหมด {meta.total} เขต
        </div>
      </div>

      <div className='border rounded-md bg-white'>
        <Table>
          <TableHeader>
            <TableRow className='rounded-md bg-slate-50 hover:bg-slate-50'>
              <TableHead className='rounded-md w-[80px] text-center'>
                ID
              </TableHead>
              <TableHead className='text-center'>จังหวัด</TableHead>
              <TableHead className='text-center'>เขต</TableHead>
              <TableHead className='text-center'>สถานะ</TableHead>
              <TableHead className='text-center w-[100px]'>จัดการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='text-center h-24 text-muted-foreground'
                >
                  กำลังโหลด...
                </TableCell>
              </TableRow>
            ) : constituencies.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className='text-center h-24 text-muted-foreground'
                >
                  ไม่พบข้อมูล
                </TableCell>
              </TableRow>
            ) : (
              constituencies.map((c) => (
                <TableRow key={c.id} className='hover:bg-slate-50'>
                  <TableCell className='font-mono text-center text-muted-foreground'>
                    {c.id}
                  </TableCell>
                  <TableCell className='text-center font-medium'>
                    {c.province}
                  </TableCell>
                  <TableCell className='text-center'>
                    เขตที่ {c.zone_number}
                  </TableCell>
                  <TableCell className='text-center'>
                    {c.is_poll_open ? (
                      <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700'>
                        เปิด
                      </span>
                    ) : (
                      <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700'>
                        ปิด
                      </span>
                    )}
                  </TableCell>
                  <TableCell className='text-center'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-8 w-8 hover:bg-red-50'
                      onClick={() => setDeleteTarget(c.id)}
                      disabled={deleteConstituency.isPending}
                    >
                      <Trash className='h-4 w-4 text-red-500' />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationBar
        currentPage={state.page}
        totalPages={meta.totalPages}
        totalItems={meta.total}
        itemsPerPage={state.limit}
        onPageChange={actions.setPage}
        onItemsPerPageChange={actions.setLimit}
      />
      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title='ยืนยันลบเขตเลือกตั้ง'
        description='คุณต้องการลบเขตเลือกตั้งนี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้'
        confirmLabel='ลบเขต'
        onConfirm={handleDelete}
        isPending={deleteConstituency.isPending}
      />
    </div>
  )
}
