'use client'

import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Users } from 'lucide-react'

interface Province {
  id: number
  name: string
}

interface UserFiltersProps {
  searchInput: string
  onSearchChange: (value: string) => void
  provinceId: string
  provinces: Province[] | undefined
  onProvinceChange: (value: string) => void
  currentUserCount: number
  currentPage: number
}

export function UserFilters({
  searchInput,
  onSearchChange,
  provinceId,
  provinces,
  onProvinceChange,
  currentUserCount,
  currentPage,
}: UserFiltersProps) {
  return (
    <div className='flex flex-wrap items-center gap-6 bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 shadow-sm'>
      <div className='w-full sm:w-[320px] relative group'>
        <div className='absolute left-4 top-1/2 -translate-y-1/2 z-10'>
          <Search className='h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors' />
        </div>
        <Input
          type='text'
          placeholder='ค้นหาด้วยชื่อ, นามสกุล หรือเลขบัตร...'
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          className='w-full pl-11 rounded-2xl bg-slate-50/50 border-slate-200 focus:ring-primary/20 transition-all font-medium placeholder:text-slate-400'
        />
      </div>

      <div className='w-full sm:w-[320px]'>
        <Select
          value={provinceId}
          onValueChange={onProvinceChange}
        >
          <SelectTrigger className='h-12 w-full rounded-2xl bg-slate-50/50 border-slate-200 focus:ring-primary/20 transition-all font-medium relative group'>
            <SelectValue placeholder='กรองตามจังหวัด' />
          </SelectTrigger>
          <SelectContent className='rounded-2xl shadow-xl max-h-[250px]'>
            <SelectItem
              value='all'
              className='font-medium text-primary'
            >
              แสดงทุกจังหวัด
            </SelectItem>
            {provinces?.map((p) => (
              <SelectItem
                key={p.id}
                value={p.id.toString()}
              >
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='hidden sm:block h-8 w-[1px] bg-slate-200' />
      <div className='text-sm font-bold text-slate-500 flex items-center gap-2'>
        <Users className='w-4 h-4' />
        กำลังแสดงรายการ {currentUserCount} รายการจากหน้า {currentPage}
      </div>
    </div>
  )
}
