'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { ImageUpload } from '@/components/ui/image-upload'
import { ImagePreviewDialog } from '@/components/shared/image-preview-dialog'
import {
  useCreatePartyMutation,
  useDeletePartyMutation,
  useParties,
  useUpdatePartyMutation,
} from '@/hooks/use-parties'
import { type Party } from '@/types'
import { AnimatePresence, motion } from 'framer-motion'
import { Edit, Image as ImageIcon, LayoutGrid, Plus, Trash } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export default function ManagePartiesPage() {
  const { data: parties, isLoading } = useParties()
  const createParty = useCreatePartyMutation()
  const updateParty = useUpdatePartyMutation()
  const deleteParty = useDeletePartyMutation()

  const [isOpen, setIsOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)

  // Form state
  const [currentId, setCurrentId] = useState<number | null>(null)
  const [name, setName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [policy, setPolicy] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const resetForm = () => {
    setName('')
    setLogoUrl('')
    setPolicy('')
    setCurrentId(null)
    setIsEdit(false)
  }

  const handleEdit = (party: Party) => {
    setName(party.name)
    setLogoUrl(party.logo_url || '')
    setPolicy(party.policy || '')
    setCurrentId(party.id)
    setIsEdit(true)
    setIsOpen(true)
  }

  const handleSubmit = async () => {
    if (!name) {
      toast.error('กรุณาระบุชื่อพรรค')
      return
    }

    const payload = {
      name,
      logo_url: logoUrl,
      policy,
    }

    try {
      if (isEdit && currentId) {
        await updateParty.mutateAsync({ id: currentId, payload })
      } else {
        await createParty.mutateAsync(payload)
      }
      setIsOpen(false)
      resetForm()
    } catch {
      // Error handled in hook
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('ยืนยันลบพรรคการเมืองนี้?')) return
    try {
      await deleteParty.mutateAsync(id)
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
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className='shadow-lg hover:shadow-xl transition-all duration-300 gap-2 bg-blue-600 hover:bg-blue-700'>
              <Plus className='h-4 w-4' />
              <span>เพิ่มพรรคการเมือง</span>
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[600px] overflow-hidden rounded-xl border-none shadow-2xl'>
            <DialogHeader className='bg-slate-50 -mx-6 -mt-6 p-6 border-b'>
              <DialogTitle className='text-xl'>
                {isEdit ? 'แก้ไขพรรคการเมือง' : 'เพิ่มพรรคการเมือง'}
              </DialogTitle>
              <DialogDescription>
                กำหนดข้อมูลพื้นฐาน และนโยบายหลักของพรรค
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-6 py-6'>
              <div className='space-y-4'>
                <div className='space-y-2'>
                  <Label
                    htmlFor='name'
                    className='text-sm font-semibold'
                  >
                    ชื่อพรรค
                  </Label>
                  <Input
                    id='name'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='เช่น พรรคใจดี'
                    className='bg-slate-50/50 focus:bg-white transition-colors'
                  />
                </div>
                <div className='space-y-2'>
                  <Label className='text-sm font-semibold'>โลโก้พรรค</Label>
                  <ImageUpload
                    value={logoUrl}
                    onChange={setLogoUrl}
                    folder='parties'
                    disabled={createParty.isPending || updateParty.isPending}
                    placeholder='คลิกหรือลากโลโก้พรรคมาวาง'
                  />
                </div>
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='policy'
                  className='text-sm font-semibold'
                >
                  นโยบายของพรรค
                </Label>
                <Textarea
                  id='policy'
                  value={policy}
                  onChange={(e) => setPolicy(e.target.value)}
                  className='min-h-[120px] bg-slate-50/50 focus:bg-white transition-colors'
                  placeholder='ระบุรายละเอียดนโยบายหลักของพรรค...'
                />
              </div>
            </div>
            <DialogFooter className='bg-slate-50 -mx-6 -mb-6 p-6 border-t'>
              <Button
                variant='ghost'
                onClick={() => setIsOpen(false)}
                className='mr-auto'
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createParty.isPending || updateParty.isPending}
                className='min-w-[120px] bg-blue-600 hover:bg-blue-700 shadow-md'
              >
                {createParty.isPending || updateParty.isPending
                  ? 'กำลังบันทึก...'
                  : isEdit
                    ? 'บันทึกการแก้ไข'
                    : 'บันทึกข้อมูล'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className='border-none shadow-xl bg-white/50 backdrop-blur-sm overflow-hidden'>
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
                      <TableCell
                        colSpan={4}
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
                    parties.map((p: Party, index: number) => (
                      <motion.tr
                        key={p.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className='group hover:bg-slate-50/50 transition-colors border-slate-50'
                      >
                        <TableCell className='px-6 py-4'>
                          {p.logo_url ? (
                            <img
                              src={p.logo_url}
                              alt={p.name}
                              className='w-20 h-20 object-cover rounded-lg p-1 bg-white shadow-sm ring-1 ring-slate-100 group-hover:scale-110 transition-transform duration-300 cursor-pointer'
                              onClick={() => setPreviewUrl(p.logo_url || null)}
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src =
                                  'https://placehold.co/80x80?text=No+Image'
                              }}
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
                              className='rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all active:scale-95'
                              onClick={() => handleEdit(p)}
                            >
                              <Edit className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all active:scale-95'
                              onClick={() => handleDelete(p.id)}
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

      <ImagePreviewDialog
        url={previewUrl}
        onClose={() => setPreviewUrl(null)}
      />
    </motion.div>
  )
}
