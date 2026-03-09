'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface PartyResult {
  id: number
  name: string
  seats: number
  color?: string
  logoUrl: string
}

function useAnimatedNumber(target: number, duration = 800, delay = 0) {
  const [current, setCurrent] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const delayTimer = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(delayTimer)
  }, [delay])

  useEffect(() => {
    if (!started || target === 0) {
      if (!started) return
      setCurrent(0)
      return
    }

    const startTime = Date.now()
    const startValue = 0

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easeOutCubic = 1 - Math.pow(1 - progress, 3)
      const value = Math.round(startValue + (target - startValue) * easeOutCubic)
      setCurrent(value)

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [target, duration, started])

  return current
}

function PartyRow({
  party,
  rank,
  isFirst,
  animationDelay,
}: {
  party: PartyResult
  rank: number
  isFirst: boolean
  animationDelay: number
}) {
  const animatedSeats = useAnimatedNumber(party.seats, 800, animationDelay)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), animationDelay)
    return () => clearTimeout(timer)
  }, [animationDelay])

  return (
    <div
      className={cn(
        'flex items-center py-3 border border-white/5 rounded-xl px-2 group',
        'transition-all duration-500 ease-out',
        'hover:bg-white/5 hover:scale-[1.02] hover:shadow-lg',
        isFirst ? 'bg-white/[0.04] shadow-lg' : 'bg-[#151515]',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      )}
      style={
        isFirst
          ? {
              borderBottomWidth: '2px',
              borderBottomColor: party.color || '#c5a059',
            }
          : {}
      }
    >
      <div className='w-8 flex justify-center'>
        <div
          className={cn(
            'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300',
            isFirst
              ? 'bg-[#c5a059] text-black'
              : 'bg-black/40 text-white/60 group-hover:text-white group-hover:bg-black/60',
          )}
        >
          {rank}
        </div>
      </div>
      <div className='flex-1 px-3 flex items-center space-x-3 overflow-hidden'>
        {party.logoUrl ? (
          <Image
            src={party.logoUrl}
            alt={party.name}
            width={28}
            height={28}
            className='w-7 h-7 rounded-full object-cover bg-white shrink-0 transition-transform duration-300 group-hover:scale-110'
            unoptimized
          />
        ) : (
          <div
            className='w-7 h-7 rounded-full shrink-0 flex items-center justify-center shadow-sm transition-transform duration-300 group-hover:scale-110'
            style={{ backgroundColor: party.color || '#c5a059' }}
          >
            <span className='text-[9px] font-bold text-white'>
              {party.name[0]}
            </span>
          </div>
        )}
        <span className='font-bold text-sm text-white/90 truncate group-hover:text-white transition-colors'>
          {party.name}
        </span>
      </div>
      <div className='w-16 text-center shrink-0'>
        <span
          className='font-black text-xl tabular-nums'
          style={{ color: party.color || '#c5a059' }}
        >
          {animatedSeats}
        </span>
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className='space-y-3 mt-4'>
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className='h-14 bg-gradient-to-r from-white/5 via-white/10 to-white/5 rounded-xl animate-shimmer'
          style={{
            backgroundSize: '200% 100%',
            animationDelay: `${i * 100}ms`,
          }}
        />
      ))}
    </div>
  )
}

export function ResultsSidebar({
  parties,
  loading,
}: {
  parties: PartyResult[]
  loading: boolean
}) {
  return (
    <aside className='w-full lg:w-[420px] bg-[#1a1a1a] p-6 lg:p-8 flex flex-col h-auto lg:h-screen overflow-y-auto border-t lg:border-l border-white/5 relative z-20 shadow-2xl'>
      <div className='mb-6 sticky top-0 bg-[#1a1a1a] pt-2 pb-4 z-10 border-b border-white/10'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-xl font-black text-white'>ผลคะแนน สส.เขต</h2>
            <p className='text-sm text-white/50 mt-1'>
              จัดอันดับตามจำนวนที่นั่งอย่างไม่เป็นทางการ
            </p>
          </div>
          <div className='relative bg-[#c5a059]/10 text-[#c5a059] px-3 py-1 rounded-full text-xs font-bold border border-[#c5a059]/20 overflow-hidden'>
            <span className='relative z-10'>LIVE</span>
            <span className='absolute inset-0 rounded-full bg-[#c5a059]/30 animate-pulse' />
          </div>
        </div>
      </div>

      <div className='flex-1 overflow-y-auto no-scrollbar space-y-2 pb-10'>
        <div className='flex text-[11px] font-bold text-white/40 uppercase pb-2 px-1'>
          <div className='w-8 text-center'>#</div>
          <div className='flex-1 px-3'>พรรค</div>
          <div className='w-16 text-center'>สส.เขต</div>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          parties.map((party, idx) => (
            <PartyRow
              key={party.id}
              party={party}
              rank={idx + 1}
              isFirst={idx === 0}
              animationDelay={idx * 80}
            />
          ))
        )}
      </div>
    </aside>
  )
}
