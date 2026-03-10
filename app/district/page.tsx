'use client'

import { LeftSidebar } from '@/components/LeftSidebar'
import { DistrictResultsSidebar } from '@/components/dashboard/district-results-sidebar'
import {
  DistrictGrid,
  EmptyState,
  MobileRegionSelector,
  RegionSidebar,
} from '@/components/district'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useProvincesWithConstituencies } from '@/hooks/use-dashboard'
import {
  REGION_NAMES,
  REGION_PROVINCES,
  RegionName,
} from '@/lib/constants/regions'
import { ChevronRight, Menu } from 'lucide-react'
import { useMemo, useState } from 'react'

export default function DistrictPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null)
  const [expandedRegion, setExpandedRegion] = useState<RegionName | null>(null)
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
  const [mobileRegionOpen, setMobileRegionOpen] = useState(false)
  const [mobileResultsOpen, setMobileResultsOpen] = useState(false)

  const { data } = useProvincesWithConstituencies()
  const regionsProvinces = data?.provinces

  const { provinces, provinceCounts, regionCounts } = useMemo(() => {
    if (!regionsProvinces) {
      return {
        provinces: [],
        provinceCounts: {},
        regionCounts: {} as Record<RegionName, number>,
      }
    }

    const pList = regionsProvinces.map((p) => ({ id: p.id, name: p.name }))

    const pCounts: Record<string, number> = {}
    regionsProvinces.forEach((p) => {
      pCounts[p.name] = p.constituencies.length
    })

    const rCounts: Record<string, number> = {}
    for (const region of REGION_NAMES) {
      if (region === 'ทั่วประเทศ') {
        rCounts[region] = regionsProvinces.reduce(
          (sum, p) => sum + pCounts[p.name],
          0,
        )
      } else {
        const regionProvinces = REGION_PROVINCES[region]
        const matchedProvinces = regionsProvinces.filter((p) =>
          regionProvinces.includes(p.name),
        )
        rCounts[region] = matchedProvinces.reduce(
          (sum, p) => sum + pCounts[p.name],
          0,
        )
      }
    }

    return {
      provinces: pList,
      provinceCounts: pCounts,
      regionCounts: rCounts as Record<RegionName, number>,
    }
  }, [regionsProvinces])

  const selectedProvinceData = useMemo(() => {
    return regionsProvinces?.find((p) => p.name === selectedProvince)
  }, [regionsProvinces, selectedProvince])

  const constituencyCount = selectedProvinceData?.constituencies.length || 0

  const districts = useMemo(() => {
    if (!selectedProvinceData) return []

    return selectedProvinceData.constituencies.map((c) => ({
      id: c.number, // Front-end uses the 'id' field as the district zone number for display
      color: '', // Provide empty string instead of undefined to satisfy District type
      leadingParty: '',
      realId: c.id,
    }))
  }, [selectedProvinceData])

  const handleSelectDistrict = (id: number) => {
    setSelectedDistrict(id)
    if (window.innerWidth < 1024) {
      setMobileResultsOpen(true)
    }
  }

  const handleSelectProvince = (name: string) => {
    setSelectedProvince(name)
    setSelectedDistrict(null)
  }

  return (
    <div className='flex flex-col lg:flex-row min-h-screen bg-[#121212] text-white font-sans overflow-hidden'>
      <LeftSidebar
        countingProgress={data?.countingProgress}
        updateAt={data?.updateAt}
      />

      <RegionSidebar
        provinces={provinces ?? []}
        regionCounts={regionCounts}
        provinceCounts={provinceCounts}
        expandedRegion={expandedRegion}
        selectedProvince={selectedProvince}
        onExpandRegion={setExpandedRegion}
        onSelectProvince={handleSelectProvince}
      />

      <main className='flex-1 lg:flex-[1.5] flex flex-col bg-[#f5f5f5] text-black overflow-y-auto min-h-0'>
        <div className='lg:hidden sticky top-0 z-30 bg-[#1a1a1a] border-b border-white/10'>
          <div className='flex items-center justify-between p-4'>
            <Sheet
              open={mobileRegionOpen}
              onOpenChange={setMobileRegionOpen}
            >
              <SheetTrigger asChild>
                <button className='flex items-center gap-2 text-white bg-white/10 hover:bg-white/15 px-4 py-2.5 rounded-xl transition-colors'>
                  <Menu className='w-5 h-5' />
                  <span className='font-medium'>
                    {selectedProvince ?? 'เลือกจังหวัด'}
                  </span>
                </button>
              </SheetTrigger>
              <SheetContent
                side='left'
                className='w-[85vw] max-w-[360px] p-0'
              >
                <MobileRegionSelector
                  provinces={provinces ?? []}
                  regionCounts={regionCounts}
                  provinceCounts={provinceCounts}
                  selectedProvince={selectedProvince}
                  onSelectProvince={handleSelectProvince}
                  onClose={() => setMobileRegionOpen(false)}
                />
              </SheetContent>
            </Sheet>

            {selectedProvince && selectedDistrict && (
              <button
                onClick={() => setMobileResultsOpen(true)}
                className='flex items-center gap-2 text-[#c5a059] bg-[#c5a059]/10 px-4 py-2.5 rounded-xl font-medium'
              >
                <span>เขต {selectedDistrict}</span>
                <ChevronRight className='w-4 h-4' />
              </button>
            )}
          </div>
        </div>

        <div className='flex-1 p-4 sm:p-6 lg:p-8'>
          <div className='w-full max-w-5xl mx-auto flex flex-col items-center pt-2 lg:pt-4'>
            {selectedProvince ? (
              <DistrictGrid
                provinceName={selectedProvince}
                districts={districts}
                constituencyCount={constituencyCount}
                selectedDistrict={selectedDistrict}
                onSelectDistrict={handleSelectDistrict}
                onClearSelection={() => setSelectedDistrict(null)}
              />
            ) : (
              <EmptyState
                onOpenMobileSelector={() => setMobileRegionOpen(true)}
              />
            )}
          </div>
        </div>
      </main>

      <div className='hidden lg:block'>
        <DistrictResultsSidebar
          selectedProvince={selectedProvince}
          selectedDistrict={selectedDistrict}
          districts={districts}
          constituencyCount={constituencyCount}
          onSelectDistrict={setSelectedDistrict}
        />
      </div>

      <Sheet
        open={mobileResultsOpen}
        onOpenChange={setMobileResultsOpen}
      >
        <SheetContent
          side='bottom'
          className='h-[70vh] p-0'
        >
          <DistrictResultsSidebar
            selectedProvince={selectedProvince}
            selectedDistrict={selectedDistrict}
            districts={districts}
            constituencyCount={constituencyCount}
            onSelectDistrict={handleSelectDistrict}
            isSheet
          />
        </SheetContent>
      </Sheet>
    </div>
  )
}
