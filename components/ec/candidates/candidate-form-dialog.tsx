'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { ImageUpload } from '@/components/ui/image-upload'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  useCreateCandidateMutation,
  useUpdateCandidateMutation,
} from '@/hooks/use-candidates'
import { useConstituencies } from '@/hooks/use-constituencies'
import { useProvinces } from '@/hooks/use-location'
import { useParties } from '@/hooks/use-parties'
import { CandidateItem, CreateCandidatePayload } from '@/types/candidate'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

// --- Zod Schema ---
const candidateSchema = z.object({
  citizenId: z
    .string()
    .length(13, 'เลขบัตรประชาชนต้องมี 13 หลัก')
    .regex(/^\d+$/, 'ต้องเป็นตัวเลขเท่านั้น'),
  firstName: z.string().min(1, 'กรุณาระบุชื่อ'),
  lastName: z.string().min(1, 'กรุณาระบุนามสกุล'),
  number: z.coerce.number().min(1, 'เบอร์ผู้สมัครต้องมากกว่า 0'),
  partyId: z.string().min(1, 'กรุณาเลือกพรรค'),
  provinceId: z.string().min(1, 'กรุณาเลือกจังหวัด'),
  constituencyId: z.string().min(1, 'กรุณาเลือกเขตเลือกตั้ง'),
  imageUrl: z.string().min(1, 'กรุณาอัพโหลดรูปโปรไฟล์'),
  candidatePolicy: z.string().optional(),
})

type CandidateFormValues = z.infer<typeof candidateSchema>

interface CandidateFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editCandidate?: CandidateItem | null
}

export function CandidateFormDialog({
  open,
  onOpenChange,
  editCandidate,
}: CandidateFormDialogProps) {
  const isEdit = !!editCandidate

  const form = useForm<CandidateFormValues>({
    resolver: zodResolver(candidateSchema) as any,
    defaultValues: {
      citizenId: '',
      firstName: '',
      lastName: '',
      number: '' as any,
      partyId: '',
      provinceId: '',
      constituencyId: '',
      imageUrl: '',
      candidatePolicy: '',
    },
  })

  const selectedProvinceId = form.watch('provinceId')

  // Data hooks
  const { data: parties } = useParties()
  const { data: provinces } = useProvinces()
  const { data: constituencies } = useConstituencies(selectedProvinceId)

  // Mutations
  const createMutation = useCreateCandidateMutation()
  const updateMutation = useUpdateCandidateMutation()
  const isMutating = createMutation.isPending || updateMutation.isPending

  // Populate form when editing or opening
  useEffect(() => {
    if (open) {
      if (editCandidate) {
        form.reset({
          citizenId: editCandidate.citizenId || '',
          firstName: editCandidate.firstName,
          lastName: editCandidate.lastName,
          number: editCandidate.number,
          partyId: editCandidate.party?.id?.toString() || '',
          provinceId:
            editCandidate.constituency?.province?.id?.toString() || '',
          constituencyId: editCandidate.constituency?.id?.toString() || '',
          imageUrl: editCandidate.imageUrl || '',
          candidatePolicy: editCandidate.candidatePolicy || '',
        })
      } else {
        form.reset({
          citizenId: '',
          firstName: '',
          lastName: '',
          number: '' as any,
          partyId: '',
          provinceId: '',
          constituencyId: '',
          imageUrl: '',
          candidatePolicy: '',
        })
      }
    }
  }, [editCandidate, form, open])

  // Reset constituency when province changes
  useEffect(() => {
    if (selectedProvinceId && !editCandidate) {
      form.setValue('constituencyId', '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvinceId])

  function onSubmit(values: CandidateFormValues) {
    if (isEdit && editCandidate) {
      updateMutation.mutate(
        {
          id: editCandidate.id,
          payload: {
            citizenId: values.citizenId,
            number: values.number,
            firstName: values.firstName,
            lastName: values.lastName,
            candidatePolicy: values.candidatePolicy || undefined,
            imageUrl: values.imageUrl,
            partyId: parseInt(values.partyId),
            constituencyId: parseInt(values.constituencyId),
          },
        },
        { onSuccess: () => onOpenChange(false) },
      )
    } else {
      const payload: CreateCandidatePayload = {
        citizenId: values.citizenId,
        number: values.number,
        firstName: values.firstName,
        lastName: values.lastName,
        imageUrl: values.imageUrl,
        partyId: parseInt(values.partyId),
        constituencyId: parseInt(values.constituencyId),
      }
      if (values.candidatePolicy)
        payload.candidatePolicy = values.candidatePolicy

      createMutation.mutate(payload, {
        onSuccess: () => onOpenChange(false),
      })
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className='sm:max-w-[600px] rounded-xl border-none shadow-2xl flex flex-col max-h-[96vh] p-0'>
        <DialogHeader className='bg-slate-50 p-6 border-b shrink-0'>
          <DialogTitle className='text-xl'>
            {isEdit ? 'แก้ไขผู้สมัคร' : 'เพิ่มผู้สมัครใหม่'}
          </DialogTitle>
          <DialogDescription>
            กำหนดข้อมูลผู้สมัคร สังกัดพรรค และเขตเลือกตั้ง
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col flex-1 overflow-hidden'
          >
            <div className='flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar'>
              {/* เลขบัตรประชาชน */}
              <FormField
                control={form.control}
                name='citizenId'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-semibold'>
                      เลขบัตรประชาชน 13 หลัก
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value.replace(/\D/g, '').slice(0, 13),
                          )
                        }
                        placeholder='เช่น 1234567890123'
                        maxLength={13}
                        className='bg-slate-50/50 focus:bg-white transition-colors font-mono tracking-widest'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ชื่อ-นามสกุล */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='firstName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-semibold'>
                        ชื่อ
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='เช่น สมชาย'
                          className='bg-slate-50/50 focus:bg-white transition-colors'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='lastName'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-semibold'>
                        นามสกุล
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder='เช่น ใจดี'
                          className='bg-slate-50/50 focus:bg-white transition-colors'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* จังหวัด, เขตเลือกตั้ง */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='provinceId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-semibold'>
                        จังหวัด
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl className='w-full'>
                          <SelectTrigger className='bg-slate-50/50'>
                            <SelectValue placeholder='เลือกจังหวัด' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className='max-h-[250px]'>
                          {provinces?.map((pv) => (
                            <SelectItem
                              key={pv.id}
                              value={pv.id.toString()}
                            >
                              {pv.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='constituencyId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-semibold'>
                        เขตเลือกตั้ง
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!selectedProvinceId}
                      >
                        <FormControl className='w-full'>
                          <SelectTrigger className='bg-slate-50/50'>
                            <SelectValue
                              placeholder={
                                selectedProvinceId
                                  ? 'เลือกเขต'
                                  : 'เลือกจังหวัดก่อน'
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className='max-h-[200px]'>
                          {constituencies?.map((c) => (
                            <SelectItem
                              key={c.id}
                              value={c.id.toString()}
                            >
                              เขต {c.zone_number}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* เบอร์ผู้สมัคร, พรรคสังกัด */}
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='number'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-semibold'>
                        หมายเลขผู้สมัคร
                      </FormLabel>
                      <FormControl>
                        <Input
                          type='number'
                          min={1}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value)}
                          placeholder='เช่น 1'
                          className='bg-slate-50/50 focus:bg-white transition-colors'
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='partyId'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-semibold'>
                        พรรคสังกัด
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl className='w-full'>
                          <SelectTrigger className='bg-slate-50/50 w-full overflow-hidden'>
                            <div className='truncate text-left'>
                              <SelectValue placeholder='เลือกพรรค' />
                            </div>
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {parties?.map((p) => (
                            <SelectItem
                              key={p.id}
                              value={p.id.toString()}
                            >
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* รูปโปรไฟล์ */}
              <FormField
                control={form.control}
                name='imageUrl'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-semibold'>
                      รูปโปรไฟล์
                    </FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        folder='candidates'
                        disabled={isMutating}
                        placeholder='คลิกหรือลากรูปผู้สมัครมาวาง'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* นโยบายส่วนตัว */}
              <FormField
                control={form.control}
                name='candidatePolicy'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-semibold'>
                      นโยบายส่วนตัว{' '}
                      <span className='text-xs text-muted-foreground font-normal'>
                        (ถ้าไม่ระบุ จะใช้นโยบายของพรรค)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={3}
                        placeholder='ระบุนโยบายส่วนตัวของผู้สมัคร...'
                        className='bg-slate-50/50 focus:bg-white transition-colors'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className='bg-slate-50 p-6 border-t flex flex-col-reverse sm:flex-row items-center gap-3 shrink-0'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                className='w-full sm:w-auto sm:mr-auto'
              >
                ยกเลิก
              </Button>
              <Button
                type='submit'
                disabled={isMutating}
                className='w-full sm:w-auto bg-blue-600 hover:bg-blue-700 shadow-md'
              >
                {isMutating
                  ? 'กำลังบันทึก...'
                  : isEdit
                    ? 'บันทึกการแก้ไข'
                    : 'บันทึกข้อมูล'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
