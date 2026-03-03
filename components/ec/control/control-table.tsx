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
import { Lock, RefreshCw, Unlock, XCircle } from 'lucide-react'

interface Constituency {
  id: number
  province: string
  zone_number: number
  is_poll_open: boolean
}

interface ControlTableProps {
  constituencies: Constituency[]
  isLoading: boolean
  onToggle: (id: number, currentStatus: boolean) => void
  isToggling: boolean
}

export function ControlTable({
  constituencies,
  isLoading,
  onToggle,
  isToggling,
}: ControlTableProps) {
  return (
    <div className='border border-slate-200/60 rounded-2xl bg-white overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hidden md:block group'>
      <Table>
        <TableHeader className='bg-slate-50/50'>
          <TableRow className='hover:bg-transparent border-b border-slate-200/60'>
            <TableHead className='h-14 font-bold text-slate-900 pl-8'>
              จังหวัด
            </TableHead>
            <TableHead className='h-14 font-bold text-slate-900 px-4'>
              เขตพื้นที่
            </TableHead>
            <TableHead className='h-14 font-bold text-slate-900 text-center uppercase tracking-wider text-[11px] px-4'>
              สถานะปัจจุบัน
            </TableHead>
            <TableHead className='h-14 font-bold text-slate-900 text-right pr-8'>
              ดำเนินการ
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className='h-40 text-center'>
                <div className='flex flex-col items-center justify-center gap-3'>
                  <RefreshCw className='h-8 w-8 text-primary animate-spin opacity-20' />
                  <span className='text-sm font-medium text-muted-foreground'>
                    กำลังเตรียมข้อมูลเขตเลือกตั้ง...
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : constituencies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className='h-40 text-center'>
                <div className='flex flex-col items-center justify-center gap-2'>
                  <div className='bg-slate-100 p-3 rounded-full'>
                    <RefreshCw className='h-6 w-6 text-slate-400' />
                  </div>
                  <span className='text-slate-500 font-medium'>
                    ไม่พบข้อมูลเขตเลือกตั้งในจังหวัดที่เลือก
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
                <TableCell className='font-semibold text-slate-900 h-20 pl-8'>
                  {c.province}
                </TableCell>
                <TableCell className='px-4'>
                  <div className='flex items-center gap-3'>
                    <div className='w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm'>
                      {c.zone_number}
                    </div>
                    <span className='font-semibold text-slate-700'>
                      เขตเลือกตั้งที่ {c.zone_number}
                    </span>
                  </div>
                </TableCell>
                <TableCell className='text-center px-4'>
                  <div className='flex justify-center'>
                    {c.is_poll_open ? (
                      <div className='relative'>
                        <Badge className='bg-green-100 text-green-700 hover:bg-green-100 border-green-200/50 pr-4 pl-3 py-1.5 gap-2 rounded-full shadow-sm font-bold'>
                          <span className='relative flex h-2 w-2'>
                            <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
                            <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
                          </span>
                          OPEN (เปิดหีบ)
                        </Badge>
                      </div>
                    ) : (
                      <Badge className='bg-slate-100 text-slate-500 hover:bg-slate-100 border-slate-200 pr-4 pl-3 py-1.5 gap-2 rounded-full shadow-none font-bold grayscale opacity-80 transition-all group-hover/row:grayscale-0 group-hover/row:opacity-100'>
                        <XCircle className='w-4 h-4 text-slate-400' />
                        CLOSED (ปิดหีบ)
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className='text-right pr-8'>
                  <Button
                    size='sm'
                    onClick={() => onToggle(c.id, c.is_poll_open)}
                    disabled={isToggling}
                    variant='ghost'
                    className={`h-10 px-4 rounded-xl font-bold transition-all ${
                      c.is_poll_open
                        ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                        : 'text-green-600 hover:bg-green-50 hover:text-green-700'
                    }`}
                  >
                    {c.is_poll_open ? (
                      <>
                        <Lock className='w-4 h-4 mr-2' /> ปิดลงคะแนน
                      </>
                    ) : (
                      <>
                        <Unlock className='w-4 h-4 mr-2' /> เปิดลงคะแนน
                      </>
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
