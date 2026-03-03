'use client'

import { LeftSidebar } from '@/components/LeftSidebar'
import { HeroCard } from '@/components/dashboard/hero-card'
import { ResultsSidebar } from '@/components/dashboard/results-sidebar'
import { Button } from '@/components/ui/button'
import { useDashboardStats } from '@/hooks/use-dashboard'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'

const FALLBACK_PARTIES = [
  {
    id: 1,
    name: 'พลังประชาชน',
    leader: 'อนุทิน ชาญวิริ',
    seats: 193,
    color: '#2d2e83',
    logoUrl: '',
  },
  {
    id: 2,
    name: 'ประชาชน',
    leader: 'ณัฐพล ร่วมประเสริ',
    seats: 118,
    color: '#f04e23',
    logoUrl: '',
  },
  {
    id: 3,
    name: 'เพื่อไทย',
    leader: 'เศรษฐา ทวีสิน',
    seats: 74,
    color: '#e10019',
    logoUrl: '',
  },
  {
    id: 4,
    name: 'รวมไทยสร้างชาติ',
    leader: 'พีระพันธุ์',
    seats: 36,
    color: '#2D328F',
    logoUrl: '',
  },
  {
    id: 5,
    name: 'ประชาธิปัตย์',
    leader: 'เฉลิมชัย',
    seats: 25,
    color: '#00AEEF',
    logoUrl: '',
  },
]

export default function Home() {
  const { data, isLoading: loading } = useDashboardStats()

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [activeZIndex, setActiveZIndex] = useState<number | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (idx: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setHoveredIdx(idx)
    setActiveZIndex(idx)
  }

  const handleMouseLeave = (idx: number) => {
    setHoveredIdx(null)
    timeoutRef.current = setTimeout(() => {
      setActiveZIndex((prev) => (prev === idx ? null : prev))
    }, 500)
  }

  const topParties = useMemo(
    () =>
      data?.partyStats?.toSorted((a, b) => b.seats - a.seats) ??
      FALLBACK_PARTIES,
    [data?.partyStats],
  )

  const top3 = topParties.slice(0, 3)

  return (
    <div className='flex flex-col lg:flex-row min-h-screen bg-[#121212] text-white font-sans overflow-hidden'>
      <LeftSidebar />

      {/* Center Hero Section */}
      <main className='flex-1 relative overflow-hidden flex flex-col items-center justify-center p-8 min-h-[500px] bg-[#151515]'>
        {/* Subtle radial background effect */}
        <div
          className='absolute inset-0 opacity-[0.03] pointer-events-none'
          style={{
            backgroundImage:
              'radial-gradient(circle, #ffffff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
          aria-hidden='true'
        />

        {/* Top Gradient Blur */}
        <div
          className='absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#c5a059]/5 to-transparent pointer-events-none'
          aria-hidden='true'
        />

        <div className='relative w-full max-w-3xl flex items-center justify-center h-[450px] mt-10 lg:mt-0'>
          {loading ? (
            <div className='flex items-center justify-center h-full'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c5a059]' />
            </div>
          ) : (
            <div className='flex items-end justify-center w-full relative h-[380px]'>
              {/* 2nd Place (Left) */}
              {top3[1] && (
                <div
                  className={cn(
                    'absolute left-[5%] md:left-1/2 md:-translate-x-[135%] bottom-0 w-[200px] md:w-[240px] transform -rotate-8 origin-bottom-right transition-[transform,opacity] duration-500 ease-out hover:-translate-y-4 hover:scale-105 animate-in fade-in slide-in-from-right-20',
                    activeZIndex === 1 ? 'z-50' : 'z-10',
                  )}
                  style={{
                    animationDuration: '800ms',
                    animationDelay: '400ms',
                    animationFillMode: 'both',
                  }}
                  onMouseEnter={() => handleMouseEnter(1)}
                  onMouseLeave={() => handleMouseLeave(1)}
                >
                  <HeroCard party={top3[1]} rank={2} />
                </div>
              )}

              {/* 1st Place (Center) */}
              {top3[0] && (
                <div
                  className={cn(
                    'absolute left-1/2 -translate-x-1/2 bottom-8 w-[240px] md:w-[280px] transform transition-[transform,opacity] duration-500 ease-out hover:-translate-y-4 hover:scale-105 animate-in fade-in slide-in-from-bottom-24',
                    activeZIndex === 0 ? 'z-50' : 'z-30',
                  )}
                  style={{
                    animationDuration: '600ms',
                    animationFillMode: 'both',
                  }}
                  onMouseEnter={() => handleMouseEnter(0)}
                  onMouseLeave={() => handleMouseLeave(0)}
                >
                  <HeroCard party={top3[0]} rank={1} />
                </div>
              )}

              {/* 3rd Place (Right) */}
              {top3[2] && (
                <div
                  className={cn(
                    'absolute right-[5%] md:left-1/2 md:translate-x-[35%] bottom-0 w-[200px] md:w-[240px] transform rotate-8 origin-bottom-left transition-[transform,opacity] duration-500 ease-out hover:-translate-y-4 hover:scale-105 animate-in fade-in slide-in-from-left-20',
                    activeZIndex === 2 ? 'z-50' : 'z-20',
                  )}
                  style={{
                    animationDuration: '800ms',
                    animationDelay: '600ms',
                    animationFillMode: 'both',
                  }}
                  onMouseEnter={() => handleMouseEnter(2)}
                  onMouseLeave={() => handleMouseLeave(2)}
                >
                  <HeroCard party={top3[2]} rank={3} />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className='absolute bottom-8 z-40 flex justify-center w-full'>
          <Button
            asChild
            size='lg'
            className='font-bold bg-[#c5a059] hover:bg-[#b08d48] text-black rounded-xl px-8 h-12 shadow-lg shadow-[#c5a059]/20 transition-colors'
          >
            <Link href='/vote'>เข้าสู่ระบบลงคะแนน / จัดการ</Link>
          </Button>
        </div>
      </main>

      {/* Right Sidebar Results */}
      <ResultsSidebar parties={topParties} loading={loading} />
    </div>
  )
}
