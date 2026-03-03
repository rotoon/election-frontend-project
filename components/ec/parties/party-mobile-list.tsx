'use client'

import { Button } from '@/components/ui/button'
import { Party } from '@/types/party'
import { AnimatePresence, motion } from 'framer-motion'
import { Edit, Image as ImageIcon, LayoutGrid, Trash } from 'lucide-react'
import Image from 'next/image'

interface PartyMobileListProps {
  parties: Party[] | undefined
  isLoading: boolean
  onEdit: (party: Party) => void
  onDelete: (id: number) => void
}

export function PartyMobileList({
  parties,
  isLoading,
  onEdit,
  onDelete,
}: PartyMobileListProps) {
  return (
    <div className='grid gap-4 md:hidden pt-4 pb-20'>
      <AnimatePresence mode='wait'>
        {isLoading ? (
          <div className='flex flex-col items-center justify-center space-y-3 py-10 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 shadow-sm'>
            <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
            <p className='text-slate-500 font-medium'>กำลังโหลดข้อมูล...</p>
          </div>
        ) : !parties || parties.length === 0 ? (
          <div className='flex flex-col items-center justify-center text-slate-400 space-y-4 italic py-12 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 shadow-sm'>
            <div className='p-4 bg-slate-50 rounded-full'>
              <LayoutGrid className='w-12 h-12 text-slate-200' />
            </div>
            <div className='text-center'>
              <p className='text-lg font-semibold text-slate-500'>
                ไม่พบข้อมูลพรรคการเมือง
              </p>
              <p className='text-sm mt-1'>
                เริ่มต้นด้วยการเพิ่มพรรคการเมืองใหม่ที่ปุ่มด้านบน
              </p>
            </div>
          </div>
        ) : (
          parties.map((p, index) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className='bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-4'
            >
              <div className='flex items-start gap-4'>
                <div className='shrink-0'>
                  {p.logo_url ? (
                    <Image
                      src={p.logo_url}
                      alt={p.name}
                      width={80}
                      height={80}
                      unoptimized
                      className='w-20 h-20 object-cover rounded-lg p-1 bg-white shadow-sm ring-1 ring-slate-100'
                    />
                  ) : (
                    <div className='w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400'>
                      <ImageIcon className='w-8 h-8' />
                    </div>
                  )}
                </div>

                <div className='flex-1 min-w-0 pt-0.5'>
                  <h3 className='font-bold text-slate-900 truncate mb-1'>
                    {p.name}
                  </h3>
                  <div className='text-sm text-slate-600 line-clamp-4 leading-relaxed bg-slate-50 p-2 rounded-lg'>
                    {p.policy || (
                      <span className='italic opacity-50 font-light'>
                        ยังไม่ได้ระบุนโยบาย
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className='flex justify-end gap-2 pt-3 border-t border-slate-50'>
                <Button
                  variant='outline'
                  size='sm'
                  className='rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                  onClick={() => onEdit(p)}
                >
                  <Edit className='h-4 w-4 mr-1.5' /> แก้ไข
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='rounded-full text-slate-500 hover:text-red-500 hover:bg-red-50 hover:border-red-200'
                  onClick={() => onDelete(p.id)}
                >
                  <Trash className='h-4 w-4 mr-1.5' /> ลบ
                </Button>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  )
}
