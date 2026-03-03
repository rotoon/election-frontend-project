'use client'

import { Button } from '@/components/ui/button'
import { Lock, Unlock } from 'lucide-react'

interface ControlHeaderProps {
  onToggleAll: (open: boolean) => void
  isPending: boolean
}

export function ControlHeader({ onToggleAll, isPending }: ControlHeaderProps) {
  return (
    <div className='flex flex-col md:flex-row md:justify-between md:items-end gap-6'>
      <div className='space-y-1.5'>
        <h2 className='text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900'>
          ควบคุมการเลือกตั้ง
        </h2>
        <p className='text-muted-foreground font-medium'>
          จัดการสถานะการเปิด-ปิดหีบเลือกตั้งในแต่ละเขตพื้นที่
        </p>
      </div>
      <div className='flex flex-wrap gap-3'>
        <Button
          variant='outline'
          className='h-11 px-5 rounded-xl border-green-200 bg-green-50/50 text-green-700 hover:bg-green-100 hover:text-green-800 hover:border-green-300 transition-all active:scale-95 shadow-sm group'
          onClick={() => onToggleAll(true)}
          disabled={isPending}
        >
          <Unlock className='w-4 h-4 mr-2 group-hover:rotate-12 transition-transform' />{' '}
          เปิดทุกเขต
        </Button>
        <Button
          variant='outline'
          className='h-11 px-5 rounded-xl border-red-200 bg-red-50/50 text-red-700 hover:bg-red-100 hover:text-red-800 hover:border-red-300 transition-all active:scale-95 shadow-sm group'
          onClick={() => onToggleAll(false)}
          disabled={isPending}
        >
          <Lock className='w-4 h-4 mr-2 group-hover:-rotate-12 transition-transform' />{' '}
          ปิดทุกเขต
        </Button>
      </div>
    </div>
  )
}
