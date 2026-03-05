'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Constituency } from '@/types/constituency'
import { RefreshCw, Search, Pencil, Trash2 } from 'lucide-react'

interface ConstituencyTableProps {
  constituencies: Constituency[]
  isLoading: boolean
  onEdit: (c: Constituency) => void
  onDelete: (id: number) => void
  onViewCandidates: (c: Constituency) => void
  isDeleting: boolean
}

export function ConstituencyTable({
  constituencies,
  isLoading,
  onEdit,
  onDelete,
  onViewCandidates,
  isDeleting,
}: ConstituencyTableProps) {
  return (
    <div className='border border-slate-200/60 rounded-3xl bg-white overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hidden md:block'>
      <Table>
        <TableHeader className='bg-slate-50/50'>
          <TableRow className='hover:bg-transparent border-b border-slate-200/60'>
            <TableHead className='h-14 font-bold text-slate-900 px-10'>
              จังหวัด
            </TableHead>
            <TableHead className='h-14 font-bold text-slate-900 px-4'>
              เขตเลือกตั้ง
            </TableHead>
            <TableHead className='h-14 font-bold text-slate-900 px-4'>
              พื้นที่ / เขต
            </TableHead>
            <TableHead className='h-14 font-bold text-slate-900 text-center px-4'>
              จำนวนผู้สมัคร
            </TableHead>
            <TableHead className='h-14 font-bold text-slate-900 text-center px-4'>
              สถานะระบบลงคะแนน
            </TableHead>
            <TableHead className='h-14 font-bold text-slate-900 text-right pr-8'>
              การจัดการ
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className='h-40 text-center'
              >
                <div className='flex flex-col items-center justify-center gap-3'>
                  <RefreshCw className='h-8 w-8 text-primary animate-spin opacity-20' />
                  <span className='text-sm font-medium text-muted-foreground'>
                    กำลังเรียกข้อมูลเขตเลือกตั้ง...
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : constituencies.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className='h-40 text-center'
              >
                <div className='flex flex-col items-center justify-center gap-2'>
                  <Search className='h-8 w-8 text-slate-200' />
                  <span className='text-slate-500 font-medium'>
                    ไม่พบข้อมูลเขตเลือกตั้ง
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            constituencies.map((c) => (
              <TableRow
                key={c.id}
                className='hover:bg-slate-50/50 transition-colors group/row border-b last:border-0 border-slate-100'
              >
                <TableCell className='font-bold text-slate-800 text-base px-10 shrink-0 whitespace-nowrap'>
                  {c.province}
                </TableCell>
                <TableCell className='px-4 w-[200px]'>
                  <div className='flex items-center gap-2'>
                    <div className='w-8 h-8 rounded-lg bg-primary/5 flex items-center justify-center text-primary font-black text-xs'>
                      {c.zone_number}
                    </div>
                    <span className='font-semibold text-slate-600'>
                      เขตเลือกตั้งที่ {c.zone_number}
                    </span>
                  </div>
                </TableCell>
                <TableCell className='px-4 min-w-[300px]'>
                  <div className='flex flex-wrap gap-1.5'>
                    {c.districts && c.districts.length > 0 ? (
                      c.districts.map((district, idx) => (
                        <Badge
                          key={`${c.id}-${idx}`}
                          variant='outline'
                          className='bg-white border-slate-200 text-slate-700 font-bold text-xs px-3 py-1 border-[1px] shadow-sm'
                        >
                          {district}
                        </Badge>
                      ))
                    ) : (
                      <span className='text-slate-300'>-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className='text-center px-4'>
                  <button
                    type='button'
                    onClick={() => onViewCandidates(c)}
                    title='ดูผู้สมัครทั้งหมด'
                    className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 font-bold text-slate-700 shadow-inner hover:bg-primary/10 hover:text-primary hover:scale-110 active:scale-95 transition-all cursor-pointer'
                  >
                    {c.candidateCount}
                  </button>
                </TableCell>
                <TableCell className='text-center px-4 uppercase tracking-tighter'>
                  {c.is_poll_open ? (
                    <Badge className='bg-green-500 text-white border-0 shadow-lg shadow-green-100 rounded-lg font-black px-3 py-1 gap-1.5'>
                      <span className='w-1.5 h-1.5 rounded-full bg-white animate-pulse' />
                      OPEN
                    </Badge>
                  ) : (
                    <Badge
                      variant='secondary'
                      className='bg-slate-100 text-slate-400 border-0 rounded-lg font-black px-3 py-1 grayscale opacity-70 group-hover/row:grayscale-0 group-hover/row:opacity-100 transition-all'
                    >
                      CLOSED
                    </Badge>
                  )}
                </TableCell>
                <TableCell className='text-right pr-8'>
                  <div className='flex justify-end gap-2'>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-10 w-10 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all active:scale-90 group/edit'
                      onClick={() => onEdit(c)}
                    >
                      <Pencil className='h-4 w-4 text-slate-400 group-hover/edit:text-blue-500 group-hover/edit:scale-110 transition-all' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      className='h-10 w-10 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all active:scale-90 group/del'
                      onClick={() => onDelete(c.id)}
                      disabled={isDeleting}
                    >
                      <Trash2 className='h-5 w-5 text-slate-400 group-hover/del:text-red-500 group-hover/del:scale-110 transition-all' />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
