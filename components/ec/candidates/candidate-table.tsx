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
import { CandidateItem } from '@/types/candidate'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpDown, Edit, Trash, User, Users } from 'lucide-react'
import Image from 'next/image'

interface CandidateTableProps {
  candidates: CandidateItem[]
  isLoading: boolean
  debouncedSearch: string
  sortBy: string
  toggleSort: (field: 'number' | 'firstName' | 'lastName') => void
  setPreviewUrl: (url: string | null) => void
  handleEdit: (c: CandidateItem) => void
  setDeleteTarget: (c: CandidateItem | null) => void
}

export function CandidateTable({
  candidates,
  isLoading,
  debouncedSearch,
  sortBy,
  toggleSort,
  setPreviewUrl,
  handleEdit,
  setDeleteTarget,
}: CandidateTableProps) {
  return (
    <Card className='border-none shadow-xl bg-white/50 backdrop-blur-sm overflow-hidden hidden md:block py-0'>
      <CardContent className='p-0'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader className='bg-slate-50/80'>
              <TableRow className='hover:bg-transparent border-slate-100'>
                <TableHead
                  className='w-[80px] font-bold text-slate-700 px-6 py-4 cursor-pointer select-none'
                  onClick={() => toggleSort('number')}
                >
                  <span className='flex items-center gap-1'>
                    เบอร์
                    {sortBy === 'number' && (
                      <ArrowUpDown className='h-3 w-3 text-blue-500' />
                    )}
                  </span>
                </TableHead>
                <TableHead className='font-bold text-slate-700 px-6'>
                  {' '}
                  รูป{' '}
                </TableHead>
                <TableHead
                  className='font-bold text-slate-700 px-6 cursor-pointer select-none'
                  onClick={() => toggleSort('firstName')}
                >
                  <span className='flex items-center gap-1'>
                    ชื่อ-นามสกุล
                    {sortBy === 'firstName' && (
                      <ArrowUpDown className='h-3 w-3 text-blue-500' />
                    )}
                  </span>
                </TableHead>
                <TableHead className='font-bold text-slate-700 px-6'>
                  {' '}
                  สังกัดพรรค{' '}
                </TableHead>
                <TableHead className='font-bold text-slate-700 px-6'>
                  {' '}
                  เขตเลือกตั้ง{' '}
                </TableHead>
                <TableHead className='text-right font-bold text-slate-700 px-6'>
                  การจัดการ
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence mode='wait'>
                {isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className='h-40 text-center'
                    >
                      <div className='flex flex-col items-center justify-center space-y-3'>
                        <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
                        <p className='text-slate-500 font-medium'>
                          กำลังโหลดข้อมูล...
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : !candidates || candidates.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className='h-60 text-center'
                    >
                      <div className='flex flex-col items-center justify-center text-slate-400 space-y-4 italic'>
                        <div className='p-4 bg-slate-50 rounded-full'>
                          <Users className='w-12 h-12 text-slate-200' />
                        </div>
                        <div>
                          <p className='text-lg font-semibold text-slate-500'>
                            {debouncedSearch
                              ? 'ไม่พบผู้สมัครตามคำค้นหา'
                              : 'ไม่พบข้อมูลผู้สมัคร'}
                          </p>
                          <p className='text-sm'>
                            {debouncedSearch
                              ? 'ลองเปลี่ยนคำค้นหาใหม่'
                              : 'เริ่มต้นด้วยการเพิ่มผู้สมัครใหม่ที่ปุ่มด้านบน'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  candidates.map((c, index) => (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className='group hover:bg-slate-50/50 transition-colors border-slate-50'
                      style={{
                        contentVisibility: 'auto',
                        containIntrinsicSize: '0 80px',
                      }}
                    >
                      <TableCell className='px-6 py-4'>
                        <span className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-700 font-bold text-lg ring-2 ring-blue-100'>
                          {c.number}
                        </span>
                      </TableCell>
                      <TableCell>
                        {c.imageUrl ? (
                          <Image
                            src={c.imageUrl}
                            alt={`${c.firstName} ${c.lastName}`}
                            width={80}
                            height={80}
                            unoptimized
                            className='w-20 h-20 object-cover rounded-lg bg-slate-50 ring-1 ring-slate-100 hover:scale-110 transition-transform duration-300 cursor-pointer'
                            onClick={() => setPreviewUrl(c.imageUrl)}
                          />
                        ) : (
                          <div className='w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center'>
                            <User className='w-5 h-5 text-slate-400' />
                          </div>
                        )}
                      </TableCell>
                      <TableCell className='px-6'>
                        <div className='flex flex-col'>
                          <span className='font-bold text-slate-900 group-hover:text-blue-700 transition-colors'>
                            {c.firstName} {c.lastName}
                          </span>
                          {c.candidatePolicy && (
                            <span className='text-xs text-muted-foreground line-clamp-1 mt-0.5'>
                              {c.candidatePolicy}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className='px-6'>
                        <div className='flex items-center gap-4'>
                          {c.party?.logoUrl ? (
                            <Image
                              src={c.party.logoUrl}
                              alt={c.party.name}
                              width={80}
                              height={80}
                              unoptimized
                              onClick={() =>
                                setPreviewUrl(c.party.logoUrl as string)
                              }
                              className='w-20 h-20 object-cover rounded-lg bg-slate-50 ring-1 ring-slate-100 hover:scale-110 transition-transform duration-300 cursor-pointer'
                            />
                          ) : (
                            <div className='w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center'>
                              <Users className='w-8 h-8 text-slate-400' />
                            </div>
                          )}
                          <div className='flex flex-col gap-1'>
                            <span className='text-slate-900 font-semibold text-lg'>
                              {c.party?.name || '-'}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className='px-6'>
                        <span className='text-slate-600'>
                          {c.constituency
                            ? `${c.constituency.province?.name || '-'} เขต ${c.constituency.number}`
                            : '-'}
                        </span>
                      </TableCell>
                      <TableCell className='px-6 text-right'>
                        <div className='flex justify-end gap-2'>
                          <Button
                            variant='outline'
                            size='icon'
                            className='rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-[box-shadow,colors] active:scale-95'
                            onClick={() => handleEdit(c)}
                          >
                            <Edit className='h-4 w-4' />
                          </Button>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-[box-shadow,colors] active:scale-95'
                            onClick={() => setDeleteTarget(c)}
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
