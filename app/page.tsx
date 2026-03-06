'use client'

import { LeftSidebar } from '@/components/LeftSidebar'
import { HeroCard } from '@/components/dashboard/hero-card'
import { ResultsSidebar } from '@/components/dashboard/results-sidebar'
import { Button } from '@/components/ui/button'
import { useElectionResults } from '@/hooks/use-dashboard'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useMemo, useRef, useState } from 'react'

export default function Home() {
  const { data, isLoading: loading } = useElectionResults()

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
    () => data?.partyStats?.toSorted((a, b) => b.seats - a.seats) ?? [],
    [data?.partyStats],
  )

  const top3 = topParties.slice(0, 3)

  return (
    <div className='flex flex-col lg:flex-row min-h-screen bg-[#121212] text-white font-sans overflow-hidden'>
      <LeftSidebar
        countingProgress={data?.countingProgress}
        updateAt={data?.updateAt}
      />

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

        <div className='relative w-full max-w-4xl flex items-center justify-center min-h-[450px] lg:h-[450px] mt-10 lg:mt-0 px-4'>
          {loading ? (
            <div className='flex items-center justify-center h-full'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c5a059]' />
            </div>
          ) : (
            <div className='flex flex-col lg:flex-row items-center lg:items-end justify-center w-full relative gap-6 lg:gap-0 lg:h-[380px] py-10 lg:py-0'>
              {/* 2nd Place (Left on Desktop, 2nd in Stack on Mobile) */}
              {top3[1] && (
                <div
                  className={cn(
                    'relative lg:absolute lg:left-1/2 lg:-translate-x-[135%] lg:bottom-0 w-full max-w-[280px] md:max-w-[240px] lg:w-[240px] transform lg:-rotate-8 lg:origin-bottom-right transition-all duration-500 ease-out hover:-translate-y-4 hover:scale-105',
                    activeZIndex === 1 ? 'z-50' : 'z-10',
                  )}
                  onMouseEnter={() => handleMouseEnter(1)}
                  onMouseLeave={() => handleMouseLeave(1)}
                >
                  <HeroCard party={top3[1]} rank={2} />
                </div>
              )}

              {/* 1st Place (Center on Desktop, 1st in Stack on Mobile) */}
              {top3[0] && (
                <div
                  className={cn(
                    'relative lg:absolute lg:left-1/2 lg:-translate-x-1/2 lg:bottom-8 w-full max-w-[300px] md:max-w-[280px] lg:w-[280px] transform transition-all duration-500 ease-out hover:-translate-y-4 hover:scale-105 order-first lg:order-none',
                    activeZIndex === 0 ? 'z-50' : 'z-30',
                  )}
                  onMouseEnter={() => handleMouseEnter(0)}
                  onMouseLeave={() => handleMouseLeave(0)}
                >
                  <HeroCard party={top3[0]} rank={1} />
                </div>
              )}

              {/* 3rd Place (Right on Desktop, 3rd in Stack on Mobile) */}
              {top3[2] && (
                <div
                  className={cn(
                    'relative lg:absolute lg:left-1/2 lg:translate-x-[35%] lg:bottom-0 w-full max-w-[280px] md:max-w-[240px] lg:w-[240px] transform lg:rotate-8 lg:origin-bottom-left transition-all duration-500 ease-out hover:-translate-y-4 hover:scale-105',
                    activeZIndex === 2 ? 'z-50' : 'z-20',
                  )}
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
        <div className='absolute bottom-4 md:bottom-10 z-40 flex justify-center w-full'>
          <Button
            asChild
            size='lg'
            className='font-bold bg-[#c5a059] hover:bg-[#b08d48] text-black rounded-xl px-8 h-12 shadow-md shadow-[#c5a059]/20 transition-colors'
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
