'use client'

import { cn } from '@/lib/utils'
import Image from 'next/image'

interface PartyResult {
  id: number
  name: string
  seats: number
  color?: string
  logoUrl: string
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
          <div className='bg-[#c5a059]/10 text-[#c5a059] px-3 py-1 rounded-full text-xs font-bold border border-[#c5a059]/20'>
            LIVE
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
          <div className='space-y-3 mt-4'>
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className='h-14 bg-white/5 animate-pulse rounded-xl'
              />
            ))}
          </div>
        ) : (
          parties.map((party, idx) => (
            <div
              key={party.id}
              className={cn(
                'flex items-center py-3 border border-white/5 transition-colors hover:bg-white/5 rounded-xl px-2 group',
                idx === 0 ? 'bg-white/[0.04] shadow-lg' : 'bg-[#151515]',
              )}
              style={
                idx === 0
                  ? {
                      borderBottomWidth: '2px',
                      borderBottomColor: party.color || '#c5a059',
                    }
                  : {}
              }
            >
              <div className='w-8 flex justify-center'>
                <div className='w-6 h-6 rounded-full bg-black/40 flex items-center justify-center text-[10px] font-bold text-white/60 group-hover:text-white transition-colors'>
                  {idx + 1}
                </div>
              </div>
              <div className='flex-1 px-3 flex items-center space-x-3 overflow-hidden'>
                {party.logoUrl ? (
                  <Image
                    src={party.logoUrl}
                    alt={party.name}
                    width={28}
                    height={28}
                    className='w-7 h-7 rounded-full object-cover bg-white shrink-0'
                    unoptimized
                  />
                ) : (
                  <div
                    className='w-7 h-7 rounded-full shrink-0 flex items-center justify-center shadow-sm'
                    style={{ backgroundColor: party.color || '#c5a059' }}
                  >
                    <span className='text-[9px] font-bold text-white'>
                      {party.name[0]}
                    </span>
                  </div>
                )}
                <span className='font-bold text-sm text-white/90 truncate'>
                  {party.name}
                </span>
              </div>
              <div className='w-16 text-center shrink-0'>
                <span
                  className='font-black text-xl'
                  style={{ color: party.color || '#c5a059' }}
                >
                  {party.seats}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  )
}
