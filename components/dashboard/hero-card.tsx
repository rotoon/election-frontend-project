'use client'

import { User } from 'lucide-react'
import Image from 'next/image'

interface HeroParty {
  id: number
  name: string
  leader?: string
  seats: number
  color: string
  logoUrl: string
  [key: string]: string | number | undefined
}

export function HeroCard({ party, rank }: { party: HeroParty; rank: number }) {
  return (
    <div className='bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col h-full group'>
      {/* Top Banner */}
      <div
        className='h-12 bg-white/5 flex items-center justify-between px-4 border-b border-white/5 transition-colors group-hover:bg-white/10'
        style={{ borderTop: `4px solid ${party.color}` }}
      >
        <div className='flex items-center space-x-2'>
          {party.logoUrl ? (
            <Image
              src={party.logoUrl}
              alt={party.name}
              width={28}
              height={28}
              className='w-7 h-7 rounded-full object-cover bg-white shadow-sm'
              unoptimized
            />
          ) : (
            <div
              className='w-7 h-7 rounded-full shrink-0 flex items-center justify-center shadow-sm'
              style={{ backgroundColor: party.color }}
            >
              <span className='text-[10px] font-bold text-white'>
                {party.name[0]}
              </span>
            </div>
          )}
          <span className='text-sm font-bold text-white truncate max-w-[120px]'>
            {party.name}
          </span>
        </div>
      </div>

      {/* Candidate Image Placeholder */}
      <div className='flex-1 relative bg-gradient-to-t from-black/90 via-black/40 to-black/10 flex flex-col justify-end aspect-[5/4]'>
        <div
          className='absolute inset-0 opacity-20'
          style={{ backgroundColor: party.color }}
          aria-hidden='true'
        />

        <div className='absolute inset-0 flex items-end justify-center pb-8 z-0'>
          <User className='w-32 h-32 text-white/10' aria-hidden='true' />
        </div>

        <div className='relative w-full text-center z-10 pb-4 px-2'>
          <div className='inline-block bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/10'>
            <span className='text-xs font-bold text-white/90 drop-shadow-md'>
              {party.leader}
            </span>
          </div>
        </div>
      </div>

      {/* Seat Count */}
      <div className='bg-[#fdf3e7] p-5 text-center flex flex-col items-center justify-center relative overflow-hidden transition-colors group-hover:bg-white'>
        <div
          className='absolute top-0 right-0 w-24 h-24 bg-black/[0.03] rounded-bl-[100px] -mr-8 -mt-8'
          aria-hidden='true'
        />
        <span className='text-[11px] font-bold text-[#1a110a]/50 uppercase tracking-widest mb-1 relative z-10'>
          สส.เขต
        </span>
        <span className='text-6xl font-black text-[#1a110a] leading-none tracking-tighter relative z-10'>
          {party.seats}
        </span>
      </div>
    </div>
  )
}
