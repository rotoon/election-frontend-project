'use client'

import { LeftSidebar } from '@/components/LeftSidebar'
import { cn } from '@/lib/utils'
import { ChevronDown, Search } from 'lucide-react'
import { useState } from 'react'

export default function DistrictPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null)

  // Map 33 districts into 9 columns x 4 rows
  const districts = Array.from({ length: 33 }, (_, i) => {
    const id = i + 1
    let col = 1,
      row = 1
    if (id >= 1 && id <= 8) {
      col = id
      row = 1
    } else if (id >= 9 && id <= 17) {
      col = id - 8
      row = 2
    } else if (id >= 18 && id <= 26) {
      col = id - 17
      row = 3
    } else if (id >= 27 && id <= 33) {
      col = id - 24
      row = 4
    } // 27 -> col 3

    return {
      id,
      col,
      row,
      // For visual accuracy with the screenshot, we use the same orange color
      color: '#f97316',
      leadingParty: 'ประชาชน',
    }
  })

  return (
    <div className='flex flex-col lg:flex-row min-h-screen bg-[#121212] text-white font-sans overflow-hidden'>
      {/* 1. Main Nav (Leftmost) */}
      <LeftSidebar />

      {/* 2. Filter Sidebar (ภูมิภาค) */}
      <aside className='hidden lg:flex flex-col w-[240px] bg-[#1a1a1a] border-r border-white/5 overflow-y-auto shrink-0 z-10'>
        {/* Regions */}
        <div className='flex flex-col'>
          <div className='flex items-center justify-between p-4 bg-[#222] border-b border-white/5'>
            <span className='font-bold text-lg'>ภูมิภาค</span>
            <ChevronDown className='w-5 h-5 text-white/50' />
          </div>
          <div className='flex flex-col text-sm font-medium'>
            <button className='flex items-center justify-between px-4 py-4 hover:bg-white/5 border-b border-white/5 transition-colors'>
              <span>ทั่วประเทศ</span>
              <span className='text-white/40'>(400 เขต)</span>
            </button>
            <button className='flex items-center justify-between px-4 py-4 bg-[#c5a059] text-black font-bold shadow-sm'>
              <span>กรุงเทพฯ</span>
              <span className='text-black/70'>(33 เขต)</span>
            </button>
            <button className='flex items-center justify-between px-4 py-4 hover:bg-white/5 border-b border-white/5 transition-colors'>
              <span>กลาง</span>
              <span className='text-white/40'>(76 เขต)</span>
            </button>
            <button className='flex items-center justify-between px-4 py-4 hover:bg-white/5 border-b border-white/5 transition-colors'>
              <span>ตะวันออก</span>
              <span className='text-white/40'>(29 เขต)</span>
            </button>
            <button className='flex items-center justify-between px-4 py-4 hover:bg-white/5 border-b border-white/5 transition-colors'>
              <span>เหนือ</span>
              <span className='text-white/40'>(70 เขต)</span>
            </button>
            <button className='flex items-center justify-between px-4 py-4 hover:bg-white/5 border-b border-white/5 transition-colors'>
              <span>อีสาน</span>
              <span className='text-white/40'>(133 เขต)</span>
            </button>
            <button className='flex items-center justify-between px-4 py-4 hover:bg-white/5 border-b border-white/5 transition-colors'>
              <span>ใต้</span>
              <span className='text-white/40'>(59 เขต)</span>
            </button>
          </div>
        </div>
      </aside>

      {/* 3. Center Grid Area (~45%) */}
      <main className='flex-[1.5] flex flex-col p-8 bg-[#f5f5f5] text-black overflow-y-auto max-h-screen border-r border-white/5'>
        <div className='w-full max-w-4xl mx-auto flex flex-col items-center pt-4'>
          <h2 className='text-5xl font-black mb-12 tracking-tight text-[#333]'>
            กรุงเทพมหานคร
          </h2>

          {/* Map Grid */}
          <div
            className='grid gap-3 w-full max-w-[800px]'
            style={{
              gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))',
            }}
          >
            {districts.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDistrict(d.id)}
                style={{
                  backgroundColor:
                    selectedDistrict === d.id ? '#c5a059' : d.color,
                }}
                className={cn(
                  'aspect-square flex flex-col items-center justify-center font-black text-3xl text-white transition-colors duration-200',
                  'hover:scale-[1.05] hover:z-10 focus:outline-none shadow-md',
                  selectedDistrict === d.id &&
                    'scale-[1.1] z-10 shadow-[0_10px_20px_rgba(197,160,89,0.4)] border-4 border-white',
                )}
              >
                {d.id}
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* 4. Right Results Sidebar (~25%) */}
      <aside className='w-full lg:w-[350px] xl:w-[400px] bg-[#1a1a1a] flex flex-col h-screen overflow-hidden z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] shrink-0'>
        {/* Search */}
        <div className='p-6 border-b border-white/10 bg-[#1e1e1e]'>
          <h2 className='text-xl font-bold mb-4 text-[#c5a059] flex items-center space-x-2'>
            <span>ผลคะแนนรายเขต</span>
          </h2>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50' />
            <input
              type='text'
              placeholder='ค้นหาด้วยชื่อจังหวัด เขต อำเภอ แขวง...'
              className='w-full bg-[#121212] border border-white/10 text-white rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-[#c5a059] focus:ring-1 focus:ring-[#c5a059] transition-colors placeholder:text-white/30'
            />
          </div>
        </div>

        {/* Selected District Detail / List */}
        <div className='flex-1 overflow-y-auto p-6 flex flex-col gap-6'>
          {selectedDistrict ? (
            <div className='animate-in fade-in slide-in-from-right-4 duration-300'>
              <div className='bg-[#222] rounded-xl p-5 border border-white/10 shadow-lg'>
                <div className='flex justify-between items-center mb-6 border-b border-white/10 pb-4'>
                  <h3 className='font-black text-xl text-white'>
                    กรุงเทพฯ เขต {selectedDistrict}
                  </h3>
                  <span className='text-xs font-bold text-[#c5a059] bg-[#c5a059]/10 px-2 py-1 rounded'>
                    นับแล้ว 94%
                  </span>
                </div>

                <div className='flex flex-col gap-5'>
                  {/* Candidate 1 */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                      <span className='font-black text-xl w-4 text-white/50'>
                        1
                      </span>
                      <div className='w-1.5 h-10 bg-[#f97316] rounded-full'></div>
                      <div>
                        <p className='font-bold text-[15px]'>ปารเมศ วิทยา</p>
                        <p className='text-xs text-white/50 mt-0.5'>ประชาชน</p>
                      </div>
                    </div>
                    <span className='font-black text-[#f97316] text-xl'>
                      32,564
                    </span>
                  </div>

                  {/* Candidate 2 */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                      <span className='font-black text-xl w-4 text-white/50'>
                        2
                      </span>
                      <div className='w-1.5 h-10 bg-blue-500 rounded-full'></div>
                      <div>
                        <p className='font-bold text-[15px]'>พีรวุฒิ พิมพ์</p>
                        <p className='text-xs text-white/50 mt-0.5'>
                          พรรคอื่น ๆ
                        </p>
                      </div>
                    </div>
                    <span className='font-black text-white/90 text-xl'>
                      14,018
                    </span>
                  </div>

                  {/* Candidate 3 */}
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center gap-4'>
                      <span className='font-black text-xl w-4 text-white/50'>
                        3
                      </span>
                      <div className='w-1.5 h-10 bg-red-500 rounded-full'></div>
                      <div>
                        <p className='font-bold text-[15px]'>สมชาย ใจดี</p>
                        <p className='text-xs text-white/50 mt-0.5'>รักชาติ</p>
                      </div>
                    </div>
                    <span className='font-black text-white/70 text-xl'>
                      8,450
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className='text-center text-white/40 h-full flex flex-col items-center justify-center space-y-4'>
              <div className='w-16 h-16 rounded-full bg-white/5 flex items-center justify-center'>
                <Search className='w-8 h-8 text-white/20' />
              </div>
              <p className='font-medium'>
                คลิกเลือกเขตเลือกตั้งตรงกลาง
                <br />
                เพื่อดูผลคะแนนแบบละเอียด
              </p>
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
