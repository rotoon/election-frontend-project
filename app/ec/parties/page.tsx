'use client'

import { PartyFormDialog } from '@/components/ec/party-form-dialog'
import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { ImagePreviewDialog } from '@/components/shared/image-preview-dialog'
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
import { useDeletePartyMutation, useParties } from '@/hooks/use-parties'
import { type Party } from '@/types/party'
import { AnimatePresence, motion } from 'framer-motion'
import { Edit, Image as ImageIcon, LayoutGrid, Trash } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export default function ManagePartiesPage() {
  const { data: parties, isLoading } = useParties()
  const deleteParty = useDeletePartyMutation()

  const [isOpen, setIsOpen] = useState(false)
  const [editParty, setEditParty] = useState<Party | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  const handleEdit = (party: Party) => {
    setEditParty(party)
    setIsOpen(true)
  }

  const handleDelete = async () => {
    if (deleteTarget === null) return
    try {
      await deleteParty.mutateAsync(deleteTarget)
    } catch {
      // Error handled in hook
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='space-y-8 p-1'
    >
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent'>
            จัดการพรรคการเมือง
          </h2>
          <p className='text-muted-foreground mt-1'>
            บริหารจัดการข้อมูลพรรคการเมือง นโยบาย และสัญลักษณ์
          </p>
        </div>
        <PartyFormDialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) setEditParty(null)
          }}
          editParty={editParty}
        />
      </div>

      <Card className='border-none shadow-xl bg-white/50 backdrop-blur-sm overflow-hidden hidden md:block'>
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
                    <TableRow>
                      <TableCell colSpan={4} className='h-40 text-center'>
                        <div className='flex flex-col items-center justify-center space-y-3'>
                          <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
                          <p className='text-slate-500 font-medium'>
                            กำลังโหลดข้อมูล...
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : !parties || parties.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className='h-60 text-center'>
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
                    parties.map((p: Party, index: number) => (
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
                              onClick={() => setPreviewUrl(p.logo_url || null)}
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
                              onClick={() => handleEdit(p)}
                            >
                              <Edit className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-[box-shadow,colors] active:scale-95'
                              onClick={() => setDeleteTarget(p.id)}
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

      {/* Mobile Card Layout */}
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
            parties.map((p: Party, index: number) => (
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

                <div className='flex flex-col justify-center gap-2 pt-3 border-t border-slate-50'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 w-full sm:w-auto'
                    onClick={() => handleEdit(p)}
                  >
                    <Edit className='h-4 w-4 mr-1.5' /> แก้ไข
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='rounded-full text-slate-500 hover:text-red-500 hover:bg-red-50 hover:border-red-200 w-full sm:w-auto'
                    onClick={() => setDeleteTarget(p.id)}
                  >
                    <Trash className='h-4 w-4 mr-1.5' /> ลบ
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <ImagePreviewDialog
        url={previewUrl}
        onClose={() => setPreviewUrl(null)}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title='ยืนยันลบพรรคการเมือง'
        description='คุณต้องการลบพรรคการเมืองนี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้'
        confirmLabel='ลบพรรค'
        onConfirm={handleDelete}
        isPending={deleteParty.isPending}
      />
    </motion.div>
  )
}
