'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Party } from '@/types/party'
import { TableLoadingSpinner } from '@/components/shared/table-loading-spinner'
import { AnimatePresence, motion } from 'framer-motion'
import { Edit, Image as ImageIcon, LayoutGrid, Trash } from 'lucide-react'
import Image from 'next/image'

interface PartyTableProps {
  parties: Party[] | undefined
  isLoading: boolean
  onEdit: (party: Party) => void
  onDelete: (id: number) => void
  onPreview: (url: string) => void
}

export function PartyTable({
  parties,
  isLoading,
  onEdit,
  onDelete,
  onPreview,
}: PartyTableProps) {
  return (
    <Card className='border-none shadow-xl bg-white/50 backdrop-blur-sm overflow-hidden hidden md:block py-0'>
      <CardContent className='p-0'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader className='bg-slate-50/80'>
              <TableRow className='hover:bg-transparent border-slate-100'>
                <TableHead className='font-bold text-slate-700 px-6 py-4'>
                  สัญลักษณ์
                </TableHead>
                <TableHead className='font-bold text-slate-700 px-6'>
                  ชื่อพรรคการเมือง
                </TableHead>
                <TableHead className='font-bold text-slate-700 px-6'>
                  นโยบายที่สำคัญ
                </TableHead>
                <TableHead className='text-right font-bold text-slate-700 px-6'>
                  การจัดการ
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode='wait'>
                {isLoading ? (
                  <TableLoadingSpinner colSpan={4} />
                ) : !parties || parties.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className='h-60 text-center'
                    >
                      <div className='flex flex-col items-center justify-center text-slate-400 space-y-4 italic'>
                        <div className='p-4 bg-slate-50 rounded-full'>
                          <LayoutGrid className='w-12 h-12 text-slate-200' />
                        </div>
                        <div>
                          <p className='text-lg font-semibold text-slate-500'>
                            ไม่พบข้อมูลพรรคการเมือง
                          </p>
                          <p className='text-sm'>
                            เริ่มต้นด้วยการเพิ่มพรรคการเมืองใหม่ที่ปุ่มด้านบน
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  parties.map((p, index) => (
                    <motion.tr
                      key={p.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className='group hover:bg-slate-50/50 transition-colors border-slate-50'
                      style={{
                        contentVisibility: 'auto',
                        containIntrinsicSize: '0 80px',
                      }}
                    >
                      <TableCell className='px-6 py-4'>
                        {p.logo_url ? (
                          <Image
                            src={p.logo_url}
                            alt={p.name}
                            width={80}
                            height={80}
                            unoptimized
                            className='w-20 h-20 object-cover rounded-lg p-1 bg-white shadow-sm ring-1 ring-slate-100 group-hover:scale-110 transition-transform duration-300 cursor-pointer'
                            onClick={() => onPreview(p.logo_url!)}
                          />
                        ) : (
                          <div className='w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400'>
                            <ImageIcon className='w-6 h-6' />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className='px-6'>
                        <div className='flex flex-col'>
                          <span className='font-bold text-slate-900 group-hover:text-blue-700 transition-colors'>
                            {p.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className='px-6'>
                        <div className='max-w-[400px] text-slate-600 line-clamp-2 leading-relaxed text-sm bg-slate-100/50 p-2 rounded-lg group-hover:bg-white transition-colors'>
                          {p.policy || (
                            <span className='italic opacity-50 font-light'>
                              ยังไม่ได้ระบุนโยบาย
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className='px-6 text-right'>
                        <div className='flex justify-end gap-2'>
                          <Button
                            variant='outline'
                            size='icon'
                            className='rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-[box-shadow,colors] active:scale-95'
                            onClick={() => onEdit(p)}
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-[box-shadow,colors] active:scale-95'
                            onClick={() => onDelete(p.id)}
                          >
                            <Trash className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
