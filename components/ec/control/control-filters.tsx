'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { RefreshCw } from 'lucide-react'

interface Province {
  id: number
  name: string
}

interface ControlFiltersProps {
  provinceId: string
  provinces: Province[] | undefined
  totalCount: number
  isLoading: boolean
  onProvinceChange: (value: string) => void
  onRefresh: () => void
}

export function ControlFilters({
  provinceId,
  provinces,
  totalCount,
  isLoading,
  onProvinceChange,
  onRefresh,
}: ControlFiltersProps) {
  return (
    <div className='flex flex-wrap items-center gap-6 bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 shadow-sm'>
      <div className='flex items-center gap-3 w-full sm:w-auto'>
        <div className='bg-primary/10 p-2 rounded-lg'>
          <RefreshCw
            className={`h-5 w-5 text-primary ${isLoading ? 'animate-spin' : ''} cursor-pointer`}
            onClick={onRefresh}
          />
        </div>
        <div className='flex flex-col'>
          <span className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70'>
            กรองตามพื้นที่
          </span>
          <Select value={provinceId} onValueChange={onProvinceChange}>
            <SelectTrigger className='h-10 w-full sm:w-[220px] bg-transparent border-0 p-0 text-base font-semibold focus:ring-0 shadow-none'>
              <SelectValue placeholder='เลือกจังหวัด' />
            </SelectTrigger>
            <SelectContent className='rounded-xl shadow-xl border-slate-200'>
              <SelectItem value='all' className='font-medium'>
                ทุกจังหวัด
              </SelectItem>
              {provinces?.map((p) => (
                <SelectItem key={p.id} value={p.id.toString()}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className='hidden sm:block h-8 w-[1px] bg-slate-200' />

      <div className='flex-1 flex items-center justify-end sm:justify-start'>
        <div className='flex flex-col sm:items-start'>
          <span className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70'>
            รวมทั้งหมด
          </span>
          <div className='text-xl font-black text-slate-900'>
            {totalCount}{' '}
            <span className='text-sm font-medium text-muted-foreground'>
              เขตเลือกตั้ง
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
