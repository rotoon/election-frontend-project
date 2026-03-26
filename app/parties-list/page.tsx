'use client'

import { LeftSidebar } from '@/components/LeftSidebar'
import { ImagePreviewDialog } from '@/components/shared/image-preview-dialog'
import { useElectionResults } from '@/hooks/use-dashboard'
import { usePartyStats } from '@/hooks/use-parties'
import { Users } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export default function PartiesListPage() {
  const { data: parties, isLoading } = usePartyStats()
  const { data: dashboardData } = useElectionResults()
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  return (
    <div className='flex flex-col lg:flex-row min-h-screen lg:h-screen bg-[#121212] text-white font-sans overflow-hidden'>
      <LeftSidebar
        countingProgress={dashboardData?.countingProgress}
        updateAt={dashboardData?.updateAt}
      />

      <main className='flex-1 overflow-y-auto bg-[#151515] lg:min-h-0'>
        {/* Header */}
        <div className='border-b border-white/5 bg-[#121212]'>
          <div className='max-w-6xl mx-auto px-6 py-8'>
            <h1 className='text-3xl font-black tracking-tight'>
              พรรคการเมือง
            </h1>
            <p className='text-white/40 mt-2 text-sm'>
              รายชื่อพรรคการเมืองทั้งหมดที่ลงสมัครรับเลือกตั้ง
            </p>
          </div>
        </div>

        {/* Content */}
        <div className='max-w-6xl mx-auto px-6 py-8'>
          {isLoading ? (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className='bg-[#1e1e1e] rounded-2xl border border-white/5 p-6 animate-pulse'
                >
                  <div className='flex items-center gap-4 mb-4'>
                    <div className='w-14 h-14 rounded-xl bg-white/10' />
                    <div className='flex-1 space-y-2'>
                      <div className='h-5 w-32 bg-white/10 rounded' />
                      <div className='h-3 w-20 bg-white/5 rounded' />
                    </div>
                  </div>
                  <div className='h-4 w-full bg-white/5 rounded mt-4' />
                  <div className='h-4 w-3/4 bg-white/5 rounded mt-2' />
                </div>
              ))}
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
              {parties?.map((party) => (
                <div
                  key={party.id}
                  className='group flex flex-col bg-[#1a1a1a] rounded-2xl border border-white/10 overflow-hidden text-left w-full'
                >
                  {/* Top Image / Hero Area */}
                  <button
                    type='button'
                    onClick={() => {
                      if (party.logo_url) setPreviewUrl(party.logo_url)
                    }}
                    className={`w-full h-64 bg-[#252528] flex items-center justify-center relative overflow-hidden shrink-0 ${
                      party.logo_url ? 'cursor-pointer select-none' : 'cursor-default'
                    }`}
                  >
                    {party.logo_url ? (
                      <Image
                        src={party.logo_url}
                        alt={party.name}
                        width={400}
                        height={300}
                        unoptimized
                        className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
                      />
                    ) : (
                      <Users className='w-16 h-16 text-white/20' />
                    )}
                  </button>

                  {/* Body Content */}
                  <div className='p-6 flex-1 flex flex-col bg-[#18181b]'>
                    <div className='flex justify-between items-start gap-4'>
                      <h3 className='font-semibold text-lg text-white leading-tight line-clamp-1'>
                        {party.name}
                      </h3>
                    </div>

                    {/* Policy preview text */}
                    <div className='mt-3'>
                      {party.policy ? (
                        <p className='text-[#a1a1aa] text-[15px] leading-relaxed line-clamp-2'>
                          {party.policy}
                        </p>
                      ) : (
                        <p className='text-[#a1a1aa]/50 text-[15px] italic'>
                          ยังไม่มีข้อมูลนโยบาย
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <ImagePreviewDialog
        url={previewUrl}
        onClose={() => setPreviewUrl(null)}
      />
    </div>
  )
}
