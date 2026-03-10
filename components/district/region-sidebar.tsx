'use client'

import {
  REGION_NAMES,
  REGION_PROVINCES,
  RegionName,
} from '@/lib/constants/regions'
import { cn } from '@/lib/utils'
import { ChevronDown } from 'lucide-react'

interface Province {
  id: number
  name: string
}

interface RegionSidebarProps {
  provinces: Province[]
  regionCounts: Record<RegionName, number>
  provinceCounts: Record<string, number>
  expandedRegion: RegionName | null
  selectedProvince: string | null
  onExpandRegion: (region: RegionName | null) => void
  onSelectProvince: (name: string) => void
}

export function RegionSidebar({
  provinces,
  regionCounts,
  provinceCounts,
  expandedRegion,
  selectedProvince,
  onExpandRegion,
  onSelectProvince,
}: RegionSidebarProps) {
  return (
    <aside className='hidden lg:flex flex-col w-[240px] bg-[#1a1a1a] border-r border-white/5 overflow-y-auto shrink-0 z-10'>
      <div className='flex flex-col'>
        <div className='flex items-center justify-between p-4 bg-[#222] border-b border-white/5'>
          <span className='font-bold text-lg'>ภูมิภาค</span>
          <ChevronDown className='w-5 h-5 text-white/50' />
        </div>
        <div className='flex flex-col text-sm font-medium'>
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
              <div key={region}>
                <button
                  onClick={() => onExpandRegion(isExpanded ? null : region)}
                  className={cn(
                    'text-md w-full flex items-center justify-between px-4 py-3 transition-colors',
                    isExpanded
                      ? 'bg-[#c5a059] text-black font-bold'
                      : 'hover:bg-white/5 border-b border-white/5',
                  )}
                >
                  <div className='flex items-center gap-2'>
                    <ChevronDown
                      className={cn(
                        'w-4 h-4 transition-transform',
                        isExpanded ? 'rotate-180' : '',
                      )}
                    />
                    <span>{region}</span>
                  </div>
                  <span
                    className={isExpanded ? 'text-black/70' : 'text-white/40'}
                  >
                    ({count} เขต)
                  </span>
                </button>

                {isExpanded && (
                  <div className='bg-[#111] border-b border-white/5'>
                    {regionProvinceList.map((province) => {
                      const isSelected = selectedProvince === province.name
                      const provConstituencyCount =
                        provinceCounts[province.name] ?? 0

                      return (
                        <button
                          key={province.id}
                          onClick={() => onSelectProvince(province.name)}
                          className={cn(
                            'w-full flex items-center justify-between px-6 py-2 text-md transition-colors',
                            isSelected
                              ? 'bg-[#c5a059]/20 text-[#c5a059] font-semibold'
                              : 'hover:bg-white/5 text-white/70',
                          )}
                        >
                          <span>{province.name}</span>
                          <span className='text-white/40 '>
                            {provConstituencyCount} เขต
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
    </aside>
  )
}
