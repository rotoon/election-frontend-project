'use client'

import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface District {
  id: number
  color: string
  leadingParty: string
}

interface DistrictResultsSidebarProps {
  selectedProvince: string | null
  selectedDistrict: number | null
  districts: District[]
  constituencyCount: number
  onSelectDistrict: (id: number) => void
  loading?: boolean
}

function useAnimatedNumber(target: number, duration = 800, delay = 0) {
  const [current, setCurrent] = useState(0)
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    setCurrent(0)

    const delayTimer = setTimeout(() => {
      const startTime = performance.now()

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easeOutCubic = 1 - Math.pow(1 - progress, 3)
        setCurrent(Math.round(target * easeOutCubic))

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(delayTimer)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [target, duration, delay])

  return current
}

function LoadingSkeleton() {
  return (
    <div className='space-y-4'>
      <div className='bg-[#222] rounded-xl p-5 border border-white/10'>
        <div className='flex justify-between items-center mb-6 border-b border-white/10 pb-4'>
          <div
            className='h-6 w-32 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded animate-shimmer'
            style={{ backgroundSize: '200% 100%' }}
          />
          <div
            className='h-5 w-20 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded animate-shimmer'
            style={{ backgroundSize: '200% 100%' }}
          />
        </div>
        <div className='space-y-5'>
          {[1, 2, 3].map((i) => (
            <div key={i} className='flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <div className='w-4 h-6 bg-white/5 rounded animate-pulse' />
                <div className='w-1.5 h-10 bg-white/10 rounded-full' />
                <div className='space-y-2'>
                  <div
                    className='h-4 w-24 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded animate-shimmer'
                    style={{
                      backgroundSize: '200% 100%',
                      animationDelay: `${i * 100}ms`,
                    }}
                  />
                  <div className='h-3 w-16 bg-white/5 rounded animate-pulse' />
                </div>
              </div>
              <div
                className='h-6 w-16 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded animate-shimmer'
                style={{ backgroundSize: '200% 100%' }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className='space-y-2'>
        <div className='h-4 w-32 bg-white/5 rounded animate-pulse mb-3' />
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className='h-12 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-lg animate-shimmer'
            style={{
              backgroundSize: '200% 100%',
              animationDelay: `${i * 80}ms`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function CandidateRow({
  rank,
  name,
  party,
  votes,
  color,
  isLeading,
  index = 0,
}: {
  rank: number
  name: string
  party: string
  votes: number
  color: string
  isLeading?: boolean
  index?: number
}) {
  const animatedVotes = useAnimatedNumber(votes, 1000, index * 150)

  return (
    <div
      className='flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both'
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className='flex items-center gap-4'>
        <span className='font-black text-xl w-4 text-white/50'>{rank}</span>
        <div
          className='w-1.5 h-10 rounded-full'
          style={{ backgroundColor: color }}
        />
        <div>
          <p className='font-bold text-[15px]'>{name}</p>
          <p className='text-xs text-white/50 mt-0.5'>{party}</p>
        </div>
      </div>
      <span
        className={cn('font-black text-xl tabular-nums', isLeading ? '' : 'text-white/70')}
        style={isLeading ? { color } : undefined}
      >
        {animatedVotes.toLocaleString()}
      </span>
    </div>
  )
}

export function DistrictResultsSidebar({
  selectedProvince,
  selectedDistrict,
  districts,
  constituencyCount,
  onSelectDistrict,
  loading = false,
  isSheet = false,
}: DistrictResultsSidebarProps & { isSheet?: boolean }) {
  const [showResults, setShowResults] = useState(false)

  useEffect(() => {
    if (selectedDistrict) {
      setShowResults(false)
      const timer = setTimeout(() => setShowResults(true), 50)
      return () => clearTimeout(timer)
    }
    setShowResults(false)
  }, [selectedDistrict])

  return (
    <aside className='w-full lg:w-[350px] xl:w-[400px] bg-[#1a1a1a] flex flex-col h-full lg:h-screen overflow-hidden z-20 lg:shadow-[-10px_0_30px_rgba(0,0,0,0.5)] shrink-0'>
      <div className={cn(
        'p-4 sm:p-6 border-b border-white/10 bg-[#1e1e1e]',
        isSheet && 'pr-14'
      )}>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-xl font-black text-white'>ผลคะแนนรายเขต</h2>
            <p className='text-sm text-white/50 mt-1'>
              {selectedProvince ?? 'เลือกจังหวัดเพื่อดูผลคะแนน'}
            </p>
          </div>
          {selectedProvince && (
            <div className='relative bg-[#c5a059]/10 text-[#c5a059] px-3 py-1 rounded-full text-xs font-bold border border-[#c5a059]/20 overflow-hidden'>
              <span className='relative z-10'>LIVE</span>
              <span className='absolute inset-0 rounded-full bg-[#c5a059]/30 animate-pulse' />
            </div>
          )}
        </div>
      </div>

      <div className='flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-4'>
        {loading ? (
          <LoadingSkeleton />
        ) : selectedProvince ? (
          <>
            {selectedDistrict && showResults && (
              <div className='animate-in fade-in slide-in-from-right-4 duration-300'>
                <div className='bg-[#222] rounded-xl p-5 border border-white/10 shadow-lg'>
                  <div className='flex justify-between items-center mb-6 border-b border-white/10 pb-4'>
                    <h3 className='font-black text-xl text-white'>
                      {selectedProvince} เขต {selectedDistrict}
                    </h3>
                  </div>

                  <div className='flex flex-col gap-5'>
                    <CandidateRow
                      rank={1}
                      name='ปารเมศ วิทยา'
                      party='ประชาชน'
                      votes={32564}
                      color='#c5a059'
                      isLeading
                      index={0}
                    />
                    <CandidateRow
                      rank={2}
                      name='พีรวุฒิ พิมพ์'
                      party='พรรคอื่น ๆ'
                      votes={14018}
                      color='#3b82f6'
                      index={1}
                    />
                    <CandidateRow
                      rank={3}
                      name='สมชาย ใจดี'
                      party='รักชาติ'
                      votes={8450}
                      color='#ef4444'
                      index={2}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className='text-center text-white/40 h-full flex flex-col items-center justify-center space-y-4'>
            <div className='w-16 h-16 rounded-full bg-white/5 flex items-center justify-center animate-pulse'>
              <Search className='w-8 h-8 text-white/20' />
            </div>
            <p className='font-medium'>
              เลือกจังหวัดจากเมนูทางซ้าย
              <br />
              เพื่อดูผลคะแนนรายเขต
            </p>
          </div>
        )}
      </div>
    </aside>
  )
}
