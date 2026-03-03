'use client'

import { Input } from '@/components/ui/input'
import { Search, Users } from 'lucide-react'

interface UserFiltersProps {
  searchInput: string
  onSearchChange: (value: string) => void
  currentUserCount: number
  currentPage: number
}

export function UserFilters({
  searchInput,
  onSearchChange,
  currentUserCount,
  currentPage,
}: UserFiltersProps) {
  return (
    <div className='flex flex-wrap items-center gap-6 bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 shadow-sm'>
      <div className='flex items-center gap-4 w-full sm:w-auto relative group'>
        <div className='absolute left-4 top-1/2 -translate-y-1/2'>
          <Search className='h-4 w-4 text-slate-400 group-focus-within:text-primary transition-colors' />
        </div>
        <Input
          type='text'
          placeholder='ค้นหาด้วยชื่อ, นามสกุล หรือเลขบัตร...'
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          className='h-12 w-full sm:w-[350px] pl-11 rounded-xl bg-slate-50/50 border-slate-200 focus:ring-primary/20 transition-all font-medium placeholder:text-slate-400'
        />
      </div>
      <div className='hidden sm:block h-8 w-[1px] bg-slate-200' />
      <div className='text-sm font-bold text-slate-500 flex items-center gap-2'>
        <Users className='w-4 h-4' />
        กำลังแสดงรายการ {currentUserCount} รายการจากหน้า {currentPage}
      </div>
    </div>
  )
}
