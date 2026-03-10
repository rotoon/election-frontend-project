'use client'

import { cn } from '@/lib/utils'
import { MapPin, X } from 'lucide-react'

interface District {
  id: number
  color: string
  leadingParty: string
}

interface DistrictGridProps {
  provinceName: string
  districts: District[]
  constituencyCount: number
  selectedDistrict: number | null
  onSelectDistrict: (id: number) => void
  onClearSelection: () => void
  showClearButton?: boolean
}

export function DistrictGrid({
  provinceName,
  districts,
  constituencyCount,
  selectedDistrict,
  onSelectDistrict,
  onClearSelection,
  showClearButton = true,
}: DistrictGridProps) {
  const sortedDistricts = [...districts].sort((a, b) => a.id - b.id)

  return (
    <>
      <div className='flex items-center gap-2 text-[#c5a059] mb-2'>
        <MapPin className='w-5 h-5' />
        <span className='text-sm font-medium'>จังหวัด</span>
      </div>
      <h2 className='text-2xl sm:text-3xl lg:text-4xl font-black mb-2 tracking-tight text-[#333] text-center'>
        {provinceName}
      </h2>
      <p className='text-base sm:text-lg text-slate-500 mb-6 sm:mb-8'>
        {constituencyCount} เขตเลือกตั้ง
      </p>

      <div className='flex flex-wrap justify-center gap-3 sm:gap-4 w-full'>
        {sortedDistricts.map((d) => (
          <button
            key={d.id}
            onClick={() => onSelectDistrict(d.id)}
            className={cn(
              'w-[60px] h-[60px] sm:w-[72px] sm:h-[72px] flex flex-col items-center justify-center font-black text-xl sm:text-2xl transition-all duration-200 rounded-lg shadow-md shrink-0',
              'hover:scale-[1.05] hover:z-10 focus:outline-none hover:brightness-110 active:scale-95',
              selectedDistrict === d.id
                ? 'bg-white text-[#c5a059] scale-105 sm:scale-110 z-10 shadow-[0_8px_20px_rgba(0,0,0,0.25)] sm:shadow-[0_10px_25px_rgba(0,0,0,0.3)] ring-2 sm:ring-4 ring-[#c5a059]'
                : 'bg-[#c5a059] text-white',
            )}
          >
            {d.id}
          </button>
        ))}
      </div>

      {showClearButton && selectedDistrict && (
        <button
          onClick={onClearSelection}
          className='mt-6 flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors lg:hidden'
        >
          <X className='w-4 h-4' />
          <span className='text-sm'>ยกเลิกการเลือก</span>
        </button>
      )}
    </>
  )
}
