'use client'

import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useConstituencyResult } from '@/hooks/use-dashboard'

interface District {
  id: number
  color: string
  leadingParty: string
  realId?: number
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
            <div
              key={i}
              className='flex items-center justify-between'
            >
              <div className='flex items-center gap-4'>
                <div className='w-4 h-6 bg-white/5 rounded animate-pulse shrink-0' />
                <div className='w-1.5 h-10 bg-white/10 rounded-full shrink-0' />
                <div className='w-10 h-10 rounded-full bg-white/5 animate-pulse shrink-0' />
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
  candidateNumber,
  imageUrl,
}: {
  rank: number
  name: string
  party: string
  votes: number
  color: string
  isLeading?: boolean
  index?: number
  candidateNumber?: number
  imageUrl?: string
}) {
  const animatedVotes = useAnimatedNumber(votes, 1000, index * 150)

  return (
    <div
      className='flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-500 fill-mode-both'
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className='flex items-center gap-3 sm:gap-4'>
        <span
          className={cn(
            'font-black text-xl w-4 shrink-0',
            rank === 1
              ? 'text-[#FFD700]'
              : rank === 2
                ? 'text-[#C0C0C0]'
                : rank === 3
                  ? 'text-[#CD7F32]'
                  : 'text-white/50',
          )}
        >
          {rank}
        </span>
        <div
          className='w-1.5 h-10 rounded-full shrink-0'
          style={{ backgroundColor: color }}
        />
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className='w-10 h-10 rounded-full object-cover bg-white/10 shrink-0 border border-white/10'
          />
        ) : (
          <div className='w-10 h-10 rounded-full bg-white/10 shrink-0 border border-white/10' />
        )}
        <div className='min-w-0 text-white'>
          <p className='font-bold text-[15px] truncate'>
            {candidateNumber ? (
              <span className='text-[#c5a059] mr-1.5'>
                เบอร์ {candidateNumber}
              </span>
            ) : null}
            {name}
          </p>
          <p className='text-xs text-white/50 mt-0.5 truncate'>{party}</p>
        </div>
      </div>
      <span
        className={cn(
          'font-black text-xl tabular-nums shrink-0 ml-2',
          isLeading ? 'text-white' : 'text-white/70',
        )}
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
  loading: parentLoading = false,
  isSheet = false,
}: DistrictResultsSidebarProps & { isSheet?: boolean }) {
  const [showResults, setShowResults] = useState(false)

  const selectedRealId =
    districts.find((d) => d.id === selectedDistrict)?.realId || null
  const { data: constituencyData, isLoading: fetchLoading } =
    useConstituencyResult(selectedRealId)

  const sortedCandidates = [...(constituencyData?.candidates || [])].sort(
    (a, b) => b.votes - a.votes,
  )

  let currentRank = 1
  let previousVotes = -1
  const rankedCandidates = sortedCandidates.map((candidate, index) => {
    if (candidate.votes !== previousVotes) {
      currentRank = index + 1
      previousVotes = candidate.votes
    }
    return {
      ...candidate,
      rank: currentRank,
    }
  })

  useEffect(() => {
    if (selectedDistrict) {
      setShowResults(false)
      const timer = setTimeout(() => setShowResults(true), 50)
      return () => clearTimeout(timer)
    }
    setShowResults(false)
  }, [selectedDistrict])

  return (
    <aside className='w-full lg:w-[450px] xl:w-[500px] bg-[#1a1a1a] flex flex-col h-full lg:h-screen overflow-hidden z-20 lg:shadow-[-10px_0_30px_rgba(0,0,0,0.5)] shrink-0'>
      <div
        className={cn(
          'p-4 sm:p-6 border-b border-white/10 bg-[#1e1e1e]',
          isSheet && 'pr-14',
        )}
      >
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
        {parentLoading || (selectedDistrict && fetchLoading) ? (
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
                    {rankedCandidates.length > 0 ? (
                      rankedCandidates.map((candidate, index) => (
                        <CandidateRow
                          key={candidate.id}
                          rank={candidate.rank}
                          name={candidate.fullName}
                          party={candidate.party.name}
                          votes={candidate.votes}
                          color={candidate.party.color || '#c5a059'} // Fallback color
                          isLeading={candidate.rank === 1}
                          index={index}
                          candidateNumber={candidate.number}
                          imageUrl={candidate.imageUrl}
                        />
                      ))
                    ) : (
                      <div className='text-center text-white/50 py-4 text-sm font-medium'>
                        รอการนับคะแนน...
                      </div>
                    )}
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
