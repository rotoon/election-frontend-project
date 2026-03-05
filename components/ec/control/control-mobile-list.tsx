'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Lock, ShieldAlert, ShieldCheck, Unlock } from 'lucide-react'

interface Constituency {
  id: number
  province: string
  zone_number: number
  is_poll_open: boolean
}

interface ControlMobileListProps {
  constituencies: Constituency[]
  isLoading: boolean
  onToggle: (id: number) => void
  isToggling: boolean
}

export function ControlMobileList({
  constituencies,
  isLoading,
  onToggle,
  isToggling,
}: ControlMobileListProps) {
  if (isLoading) {
    return (
      <div className='grid gap-5 md:hidden'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className='bg-white p-5 rounded-2xl border border-slate-100 shadow-sm animate-pulse h-40'
          />
        ))}
      </div>
    )
  }

  if (constituencies.length === 0) {
    return (
      <div className='md:hidden text-center py-12 text-muted-foreground bg-white border border-dashed border-slate-300 rounded-2xl'>
        <div className='bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 italic text-sm'>
          Empty
        </div>
        ไม่พบข้อมูลเขตเลือกตั้ง
      </div>
    )
  }

  return (
    <div className='grid gap-5 md:hidden'>
      {constituencies.map((c) => (
        <div
          key={c.id}
          className='bg-white p-5 rounded-3xl shadow-[0_10px_40px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col gap-5 relative overflow-hidden group active:scale-[0.98] transition-transform'
        >
          <div
            className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full blur-3xl opacity-10 transition-colors ${c.is_poll_open ? 'bg-green-500' : 'bg-red-500'}`}
          />

          <div className='flex justify-between items-start relative z-10'>
            <div className='space-y-1'>
              <h3 className='font-black text-xl text-slate-900'>
                {c.province}
              </h3>
              <p className='text-slate-500 font-bold text-sm bg-slate-100 w-fit px-2 py-0.5 rounded-md'>
                เขตเลือกตั้งที่ {c.zone_number}
              </p>
            </div>
            {c.is_poll_open ? (
              <Badge className='bg-green-500 text-white hover:bg-green-500 border-0 h-8 font-black shadow-lg shadow-green-200 rounded-xl'>
                <ShieldCheck className='w-3.5 h-3.5 mr-1' /> OPEN
              </Badge>
            ) : (
              <Badge className='bg-slate-200 text-slate-600 hover:bg-slate-200 border-0 h-8 font-black rounded-xl'>
                <ShieldAlert className='w-3.5 h-3.5 mr-1' /> CLOSED
              </Badge>
            )}
          </div>

          <div className='relative z-10'>
            <Button
              size='lg'
              onClick={() => onToggle(c.id)}
              disabled={isToggling}
              variant='ghost'
              className={`h-10 px-4 rounded-xl font-bold transition-all w-full ${
                c.is_poll_open
                  ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                  : 'text-green-600 hover:bg-green-50 hover:text-green-700'
              }`}
            >
              {c.is_poll_open ? (
                <>
                  <Lock className='w-5 h-5 mr-2' /> ปิดหีบเลือกตั้ง
                </>
              ) : (
                <>
                  <Unlock className='w-5 h-5 mr-2' /> เปิดหีบเลือกตั้ง
                </>
              )}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
