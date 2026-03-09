'use client'

import { LeftSidebar } from '@/components/LeftSidebar'
import { DistrictResultsSidebar } from '@/components/dashboard/district-results-sidebar'
import { useProvinces } from '@/hooks/use-location'
import {
  REGION_NAMES,
  REGION_PROVINCES,
  RegionName,
} from '@/lib/constants/regions'
import { cn } from '@/lib/utils'
import { ChevronDown, Search } from 'lucide-react'
import { useMemo, useState } from 'react'

// TODO: Replace with real constituency count from API when backend is ready
const MOCK_CONSTITUENCY_COUNT: Record<string, number> = {
  กรุงเทพมหานคร: 33,
  นนทบุรี: 8,
  ปทุมธานี: 7,
  สมุทรปราการ: 8,
  นครปฐม: 6,
  เชียงใหม่: 10,
  เชียงราย: 7,
  ลำปาง: 5,
  นครราชสีมา: 16,
  ขอนแก่น: 11,
  อุดรธานี: 10,
  อุบลราชธานี: 11,
  ชลบุรี: 10,
  ระยอง: 4,
  สงขลา: 9,
  สุราษฎร์ธานี: 6,
  นครศรีธรรมราช: 9,
}

function getMockConstituencyCount(provinceName: string): number {
  return (
    MOCK_CONSTITUENCY_COUNT[provinceName] ?? Math.floor(Math.random() * 5) + 1
  )
}

export default function DistrictPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null)
  const [expandedRegion, setExpandedRegion] = useState<RegionName | null>(null)
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)

  const { data: provinces } = useProvinces()

  const regionCounts = useMemo(() => {
    if (!provinces) return {} as Record<RegionName, number>

    const counts: Record<string, number> = {}
    for (const region of REGION_NAMES) {
      if (region === 'ทั่วประเทศ') {
        counts[region] = provinces.reduce(
          (sum, p) => sum + getMockConstituencyCount(p.name),
          0,
        )
      } else {
        const regionProvinces = REGION_PROVINCES[region]
        const matchedProvinces = provinces.filter((p) =>
          regionProvinces.includes(p.name),
        )
        counts[region] = matchedProvinces.reduce(
          (sum, p) => sum + getMockConstituencyCount(p.name),
          0,
        )
      }
    }
    return counts as Record<RegionName, number>
  }, [provinces])

  const constituencyCount = selectedProvince
    ? getMockConstituencyCount(selectedProvince)
    : 0

  const districts = useMemo(() => {
    if (!selectedProvince) return []

    return Array.from({ length: constituencyCount }, (_, i) => ({
      id: i + 1,
      color: '#c5a059',
      leadingParty: 'ประชาชน',
    }))
  }, [selectedProvince, constituencyCount])

  return (
    <div className='flex flex-col lg:flex-row min-h-screen bg-[#121212] text-white font-sans overflow-hidden'>
      {/* 1. Main Nav (Leftmost) */}
      <LeftSidebar />

      {/* 2. Filter Sidebar (ภูมิภาค) */}
      <aside className='hidden lg:flex flex-col w-[240px] bg-[#1a1a1a] border-r border-white/5 overflow-y-auto shrink-0 z-10'>
        {/* Regions */}
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
                  ? (provinces ?? [])
                  : (provinces ?? []).filter((p) =>
                      REGION_PROVINCES[region]?.includes(p.name),
                    )

              return (
                <div key={region}>
                  <button
                    onClick={() => setExpandedRegion(isExpanded ? null : region)}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 transition-colors',
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
                    <span className={isExpanded ? 'text-black/70' : 'text-white/40'}>
                      ({count} เขต)
                    </span>
                  </button>

                  {isExpanded && (
                    <div className='bg-[#111] border-b border-white/5'>
                      {regionProvinceList.map((province) => {
                        const isSelected = selectedProvince === province.name
                        const provConstituencyCount = getMockConstituencyCount(province.name)

                        return (
                          <button
                            key={province.id}
                            onClick={() => {
                              setSelectedProvince(province.name)
                              setSelectedDistrict(null)
                            }}
                            className={cn(
                              'w-full flex items-center justify-between px-6 py-2 text-xs transition-colors',
                              isSelected
                                ? 'bg-[#c5a059]/20 text-[#c5a059] font-semibold'
                                : 'hover:bg-white/5 text-white/70',
                            )}
                          >
                            <span>{province.name}</span>
                            <span className='text-white/40'>
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

      {/* 3. Center Grid Area (~45%) */}
      <main className='flex-[1.5] flex flex-col p-8 bg-[#f5f5f5] text-black overflow-y-auto max-h-screen border-r border-white/5'>
        <div className='w-full max-w-4xl mx-auto flex flex-col items-center pt-4'>
          {selectedProvince ? (
            <>
              <h2 className='text-4xl font-black mb-2 tracking-tight text-[#333]'>
                {selectedProvince}
              </h2>
              <p className='text-lg text-slate-500 mb-8'>
                {constituencyCount} เขตเลือกตั้ง
              </p>

              <div
                className='grid gap-3 w-full max-w-[800px]'
                style={{
                  gridTemplateColumns: `repeat(auto-fill, minmax(${constituencyCount > 20 ? '60px' : '70px'}, 1fr))`,
                }}
              >
                {districts.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedDistrict(d.id)}
                    className={cn(
                      'aspect-square flex flex-col items-center justify-center font-black text-2xl transition-all duration-200 rounded-lg shadow-md',
                      'hover:scale-[1.05] hover:z-10 focus:outline-none hover:brightness-110',
                      selectedDistrict === d.id
                        ? 'bg-white text-[#c5a059] scale-[1.15] z-10 shadow-[0_10px_25px_rgba(0,0,0,0.3)] ring-4 ring-[#c5a059]'
                        : 'bg-[#c5a059] text-white',
                    )}
                  >
                    {d.id}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className='flex flex-col items-center justify-center h-full text-center'>
              <div className='w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center mb-6'>
                <Search className='w-12 h-12 text-slate-400' />
              </div>
              <h3 className='text-2xl font-bold text-slate-700 mb-2'>
                เลือกจังหวัด
              </h3>
              <p className='text-slate-500'>
                คลิกที่ภูมิภาคทางซ้ายแล้วเลือกจังหวัด
                <br />
                เพื่อดูเขตเลือกตั้ง
              </p>
            </div>
          )}
        </div>
      </main>

      <DistrictResultsSidebar
        selectedProvince={selectedProvince}
        selectedDistrict={selectedDistrict}
        districts={districts}
        constituencyCount={constituencyCount}
        onSelectDistrict={setSelectedDistrict}
      />
    </div>
  )
}
