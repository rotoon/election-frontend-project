'use client'

import { getMockConstituencyCount } from '@/lib/mock-data/constituencies'
import { SheetHeader, SheetTitle } from '@/components/ui/sheet'
import {
  REGION_NAMES,
  REGION_PROVINCES,
  RegionName,
} from '@/lib/constants/regions'
import { cn } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface Province {
  id: number
  name: string
}

interface MobileRegionSelectorProps {
  provinces: Province[]
  regionCounts: Record<RegionName, number>
  selectedProvince: string | null
  onSelectProvince: (name: string) => void
  onClose: () => void
}

export function MobileRegionSelector({
  provinces,
  regionCounts,
  selectedProvince,
  onSelectProvince,
  onClose,
}: MobileRegionSelectorProps) {
  const [expandedRegion, setExpandedRegion] = useState<RegionName | null>(null)

  return (
    <div className='flex flex-col h-full'>
      <SheetHeader className='border-b border-white/10'>
        <SheetTitle>เลือกจังหวัด</SheetTitle>
      </SheetHeader>

      <div className='flex-1 overflow-y-auto'>
        {REGION_NAMES.map((region) => {
          const isExpanded = expandedRegion === region
          const count = regionCounts[region] ?? 0

          const regionProvinceList =
            region === 'ทั่วประเทศ'
              ? provinces
              : provinces.filter((p) =>
                  REGION_PROVINCES[region]?.includes(p.name),
                )

          return (
            <div key={region} className='border-b border-white/5'>
              <button
                onClick={() => setExpandedRegion(isExpanded ? null : region)}
                className={cn(
                  'w-full flex items-center justify-between px-5 py-4 transition-colors',
                  isExpanded
                    ? 'bg-[#c5a059] text-black'
                    : 'hover:bg-white/5 text-white',
                )}
              >
                <div className='flex items-center gap-3'>
                  <ChevronRight
                    className={cn(
                      'w-5 h-5 transition-transform',
                      isExpanded && 'rotate-90',
                    )}
                  />
                  <span className='font-semibold'>{region}</span>
                </div>
                <span
                  className={cn(
                    'text-sm',
                    isExpanded ? 'text-black/60' : 'text-white/40',
                  )}
                >
                  {count} เขต
                </span>
              </button>

              {isExpanded && (
                <div className='bg-black/30'>
                  {regionProvinceList.map((province) => {
                    const isSelected = selectedProvince === province.name
                    const provCount = getMockConstituencyCount(province.name)

                    return (
                      <button
                        key={province.id}
                        onClick={() => {
                          onSelectProvince(province.name)
                          onClose()
                        }}
                        className={cn(
                          'w-full flex items-center justify-between px-8 py-3 transition-colors',
                          isSelected
                            ? 'bg-[#c5a059]/20 text-[#c5a059]'
                            : 'hover:bg-white/5 text-white/80',
                        )}
                      >
                        <span className={isSelected ? 'font-semibold' : ''}>
                          {province.name}
                        </span>
                        <span className='text-sm text-white/40'>
                          {provCount} เขต
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
