'use client'

import { Button } from '@/components/ui/button'
import { CandidateItem } from '@/types/candidate'
import { AnimatePresence, motion } from 'framer-motion'
import { Edit, Trash, User, Users } from 'lucide-react'
import Image from 'next/image'

interface CandidateMobileListProps {
  candidates: CandidateItem[]
  isLoading: boolean
  debouncedSearch: string
  setPreviewUrl: (url: string | null) => void
  handleEdit: (c: CandidateItem) => void
  setDeleteTarget: (c: CandidateItem | null) => void
}

export function CandidateMobileList({
  candidates,
  isLoading,
  debouncedSearch,
  setPreviewUrl,
  handleEdit,
  setDeleteTarget,
}: CandidateMobileListProps) {
  return (
    <div className='grid gap-4 md:hidden'>
      <AnimatePresence mode='wait'>
        {isLoading ? (
          <div className='flex flex-col items-center justify-center space-y-3 py-10 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 shadow-sm'>
            <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
            <p className='text-slate-500 font-medium'>กำลังโหลดข้อมูล...</p>
          </div>
        ) : !candidates || candidates.length === 0 ? (
          <div className='flex flex-col items-center justify-center text-slate-400 space-y-4 italic py-12 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 shadow-sm'>
            <div className='p-4 bg-slate-50 rounded-full'>
              <Users className='w-12 h-12 text-slate-200' />
            </div>
            <div className='text-center'>
              <p className='text-lg font-semibold text-slate-500'>
                {debouncedSearch
                  ? 'ไม่พบผู้สมัครตามคำค้นหา'
                  : 'ไม่พบข้อมูลผู้สมัคร'}
              </p>
              <p className='text-sm mt-1'>
                {debouncedSearch
                  ? 'ลองเปลี่ยนคำค้นหาใหม่'
                  : 'เริ่มต้นด้วยการเพิ่มผู้สมัครใหม่ที่ปุ่มด้านบน'}
              </p>
            </div>
          </div>
        ) : (
          candidates.map((c, index) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              className='bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-4'
            >
              <div className='flex items-start gap-4'>
                <div className='shrink-0'>
                  {c.imageUrl ? (
                    <Image
                      src={c.imageUrl}
                      alt={`${c.firstName} ${c.lastName}`}
                      width={64}
                      height={64}
                      unoptimized
                      className='w-16 h-16 object-cover rounded-lg bg-slate-50 ring-1 ring-slate-100 cursor-pointer active:scale-95 transition-transform'
                      onClick={() => setPreviewUrl(c.imageUrl)}
                    />
                  ) : (
                    <div className='w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center'>
                      <User className='w-6 h-6 text-slate-400' />
                    </div>
                  )}
                </div>

                <div className='flex-1 min-w-0 pt-0.5'>
                  <div className='flex items-center gap-2 mb-1.5'>
                    <span className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-bold text-xs ring-1 ring-blue-100 shrink-0'>
                      {c.number}
                    </span>
                    <h3 className='font-bold text-slate-900 truncate'>
                      {c.firstName} {c.lastName}
                    </h3>
                  </div>
                  {c.candidatePolicy && (
                    <p className='text-xs text-muted-foreground line-clamp-2 mb-2'>
                      {c.candidatePolicy}
                    </p>
                  )}
                  <div className='flex flex-col gap-1.5 text-xs text-slate-600'>
                    <div className='flex flex-col gap-2'>
                      <div className='flex items-start gap-3'>
                        <div className='flex flex-col gap-1 min-w-0'>
                          <span className='font-bold text-slate-900 truncate text-sm'>
                            {c.party?.name || '-'}
                          </span>
                          {c.party?.policy && (
                            <p className='text-[11px] text-slate-400 leading-normal italic line-clamp-3'>
                              “{c.party.policy}”
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-1.5'>
                      <Users className='w-3.5 h-3.5 text-slate-400 shrink-0' />
                      <span className='truncate'>
                        {c.constituency
                          ? `${c.constituency.province?.name || '-'} เขต ${c.constituency.number}`
                          : '-'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='flex justify-end gap-2 pt-3 border-t border-slate-50'>
                <Button
                  variant='outline'
                  size='sm'
                  className='rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                  onClick={() => handleEdit(c)}
                >
                  <Edit className='h-3 w-3 mr-1.5' /> แก้ไข
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='rounded-full text-slate-500 hover:text-red-500 hover:bg-red-50 hover:border-red-200'
                  onClick={() => setDeleteTarget(c)}
                >
                  <Trash className='h-3 w-3 mr-1.5' /> ลบ
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  )
}
