'use client'

import { MapPin, Search } from 'lucide-react'

interface EmptyStateProps {
  onOpenMobileSelector: () => void
}

export function EmptyState({ onOpenMobileSelector }: EmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center min-h-[50vh] lg:h-full text-center px-4'>
      <div className='w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-200 flex items-center justify-center mb-4 sm:mb-6'>
        <Search className='w-10 h-10 sm:w-12 sm:h-12 text-slate-400' />
      </div>
      <h3 className='text-xl sm:text-2xl font-bold text-slate-700 mb-2'>
        เลือกจังหวัด
      </h3>
      <p className='text-slate-500 text-sm sm:text-base'>
        <span className='lg:hidden'>แตะปุ่มด้านบนเพื่อเลือกจังหวัด</span>
        <span className='hidden lg:inline'>
          คลิกที่ภูมิภาคทางซ้ายแล้วเลือกจังหวัด
          <br />
          เพื่อดูเขตเลือกตั้ง
        </span>
      </p>

      <button
        onClick={onOpenMobileSelector}
        className='mt-6 lg:hidden flex items-center gap-2 bg-[#c5a059] text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-[#c5a059]/20 active:scale-95 transition-transform'
      >
        <MapPin className='w-5 h-5' />
        <span>เลือกจังหวัด</span>
      </button>
    </div>
  )
}
