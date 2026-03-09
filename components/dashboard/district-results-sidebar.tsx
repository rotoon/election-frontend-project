'use client'

import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'

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
}

export function DistrictResultsSidebar({
  selectedProvince,
  selectedDistrict,
  districts,
  constituencyCount,
  onSelectDistrict,
}: DistrictResultsSidebarProps) {
  return (
    <aside className='w-full lg:w-[350px] xl:w-[400px] bg-[#1a1a1a] flex flex-col h-screen overflow-hidden z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] shrink-0'>
      <div className='p-6 border-b border-white/10 bg-[#1e1e1e]'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-xl font-black text-white'>ผลคะแนนรายเขต</h2>
            <p className='text-sm text-white/50 mt-1'>
              {selectedProvince ?? 'เลือกจังหวัดเพื่อดูผลคะแนน'}
            </p>
          </div>
          {selectedProvince && (
            <div className='bg-[#c5a059]/10 text-[#c5a059] px-3 py-1 rounded-full text-xs font-bold border border-[#c5a059]/20'>
              LIVE
            </div>
          )}
        </div>
      </div>

      <div className='flex-1 overflow-y-auto p-6 flex flex-col gap-4'>
        {selectedProvince ? (
          <>
            {selectedDistrict && (
              <div className='animate-in fade-in slide-in-from-right-4 duration-300'>
                <div className='bg-[#222] rounded-xl p-5 border border-white/10 shadow-lg'>
                  <div className='flex justify-between items-center mb-6 border-b border-white/10 pb-4'>
                    <h3 className='font-black text-xl text-white'>
                      {selectedProvince} เขต {selectedDistrict}
                    </h3>
                    <span className='text-xs font-bold text-[#c5a059] bg-[#c5a059]/10 px-2 py-1 rounded'>
                      นับแล้ว 94%
                    </span>
                  </div>

                  <div className='flex flex-col gap-5'>
                    <CandidateRow
                      rank={1}
                      name='ปารเมศ วิทยา'
                      party='ประชาชน'
                      votes={32564}
                      color='#c5a059'
                      isLeading
                    />
                    <CandidateRow
                      rank={2}
                      name='พีรวุฒิ พิมพ์'
                      party='พรรคอื่น ๆ'
                      votes={14018}
                      color='#3b82f6'
                    />
                    <CandidateRow
                      rank={3}
                      name='สมชาย ใจดี'
                      party='รักชาติ'
                      votes={8450}
                      color='#ef4444'
                    />
                  </div>
                </div>
              </div>
            )}

            <div className='space-y-2'>
              <h4 className='text-sm font-semibold text-white/60 mb-3'>
                {selectedProvince} ({constituencyCount} เขต)
              </h4>
              {districts.map((d) => (
                <button
                  key={d.id}
                  onClick={() => onSelectDistrict(d.id)}
                  className={cn(
                    'w-full flex items-center justify-between p-3 rounded-lg transition-colors',
                    selectedDistrict === d.id
                      ? 'bg-[#c5a059] text-black'
                      : 'bg-[#222] hover:bg-[#333] text-white',
                  )}
                >
                  <span className='font-semibold'>เขต {d.id}</span>
                  <span
                    className={cn(
                      'text-xs px-2 py-1 rounded',
                      selectedDistrict === d.id
                        ? 'bg-black/20 text-black/70'
                        : 'bg-[#c5a059]/20 text-[#c5a059]',
                    )}
                  >
                    นับแล้ว 94%
                  </span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className='text-center text-white/40 h-full flex flex-col items-center justify-center space-y-4'>
            <div className='w-16 h-16 rounded-full bg-white/5 flex items-center justify-center'>
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

function CandidateRow({
  rank,
  name,
  party,
  votes,
  color,
  isLeading,
}: {
  rank: number
  name: string
  party: string
  votes: number
  color: string
  isLeading?: boolean
}) {
  return (
    <div className='flex items-center justify-between'>
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
        className={cn('font-black text-xl', isLeading ? '' : 'text-white/70')}
        style={isLeading ? { color } : undefined}
      >
        {votes.toLocaleString()}
      </span>
    </div>
  )
}
