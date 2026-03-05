'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAvailableDistricts } from '@/hooks/use-constituencies'
import { zodResolver } from '@hookform/resolvers/zod'
import { Hash, Loader2, MapPin, Plus, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// --- Zod Schema ---
const constituencySchema = z.object({
  provinceId: z.string().min(1, 'กรุณาเลือกจังหวัด'),
  zoneNumber: z.coerce.number().min(1, 'กรุณาระบุหมายเลขเขต'),
  districtIds: z.array(z.number()).min(1, 'กรุณาเลือกอำเภออย่างน้อย 1 รายการ'),
})

type ConstituencyFormValues = z.infer<typeof constituencySchema>

interface Province {
  id: number
  name: string
}

interface ConstituencyHeaderProps {
  provinces: Province[] | undefined
  onCreate: (values: {
    province: string
    zoneNumber: number
    districtIds: number[]
  }) => Promise<void>
  isCreating: boolean
}

export function ConstituencyHeader({
  provinces,
  onCreate,
  isCreating,
}: ConstituencyHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<ConstituencyFormValues>({
    resolver: zodResolver(constituencySchema) as any,
    defaultValues: { provinceId: '', zoneNumber: '' as any, districtIds: [] },
  })

  const selectedProvinceId = form.watch('provinceId')
  const selectedDistrictIds = form.watch('districtIds')

  const { data: availableDistricts, isLoading: isLoadingDistricts } =
    useAvailableDistricts(selectedProvinceId || null)

  async function onSubmit(values: ConstituencyFormValues) {
    try {
      await onCreate({
        province: values.provinceId,
        zoneNumber: values.zoneNumber,
        districtIds: values.districtIds,
      })
      setIsOpen(false)
      form.reset()
    } catch {
      // Error handled in parent/hook
    }
  }

  function handleSelectAll() {
    if (!availableDistricts) return
    form.setValue(
      'districtIds',
      availableDistricts.map((d) => d.id),
      { shouldValidate: true },
    )
  }

  function handleDeselectAll() {
    form.setValue('districtIds', [], { shouldValidate: true })
  }

  return (
    <div className='flex flex-col md:flex-row md:justify-between md:items-end gap-6'>
      <div className='space-y-1.5'>
        <h2 className='text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900'>
          จัดการเขตเลือกตั้ง
        </h2>
        <p className='text-muted-foreground font-medium'>
          เพิ่ม ลบ หรือแก้ไขข้อมูลเขตเลือกตั้งในแต่ละจังหวัด
        </p>
      </div>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) form.reset()
        }}
      >
        <DialogTrigger asChild>
          <Button className='h-12 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold shadow-xl shadow-slate-200 transition-all active:scale-95 group'>
            <Plus className='mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300' />{' '}
            เพิ่มเขตเลือกตั้ง
          </Button>
        </DialogTrigger>
        <DialogContent className='rounded-3xl border-none shadow-2xl max-h-[85vh] overflow-y-auto'>
          <DialogHeader className='space-y-3 pb-4'>
            <div className='w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center'>
              <MapPin className='w-6 h-6 text-primary' />
            </div>
            <div>
              <DialogTitle className='text-2xl font-black'>
                เพิ่มเขตเลือกตั้งใหม่
              </DialogTitle>
              <DialogDescription className='text-muted-foreground font-medium'>
                ระบุรายละเอียดจังหวัด หมายเลขเขต และเลือกอำเภอที่อยู่ในเขตนี้
              </DialogDescription>
            </div>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-6'
            >
              <FormField
                control={form.control}
                name='provinceId'
                render={({ field }) => (
                  <FormItem className='space-y-1.5'>
                    <FormLabel className='text-xs font-black uppercase tracking-widest text-muted-foreground/80 pl-1'>
                      จังหวัด
                    </FormLabel>
                    <Select
                      onValueChange={(val) => {
                        field.onChange(val)
                        // Reset districts when province changes
                        form.setValue('districtIds', [])
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='w-full h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-primary/20 transition-all'>
                          <SelectValue placeholder='เลือกจังหวัด' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className='rounded-xl shadow-xl'>
                        {provinces?.map((p) => (
                          <SelectItem
                            key={p.id}
                            value={p.id.toString()}
                            className='font-medium'
                          >
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className='text-xs font-bold' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='zoneNumber'
                render={({ field }) => (
                  <FormItem className='space-y-1.5'>
                    <FormLabel className='text-xs font-black uppercase tracking-widest text-muted-foreground/80 pl-1'>
                      เลขเขตเลือกตั้ง
                    </FormLabel>
                    <FormControl>
                      <div className='relative'>
                        <Hash className='absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400' />
                        <Input
                          type='number'
                          placeholder='ระบุเป็นตัวเลข (เช่น 1, 2, 3)'
                          className='pl-11 rounded-xl bg-slate-50 border-slate-200 focus:ring-primary/20 transition-all font-bold'
                          {...field}
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className='text-xs font-bold' />
                  </FormItem>
                )}
              />

              {/* District Selection */}
              <FormField
                control={form.control}
                name='districtIds'
                render={() => (
                  <FormItem className='space-y-1.5'>
                    <div className='flex items-center justify-between'>
                      <FormLabel className='text-xs font-black uppercase tracking-widest text-muted-foreground/80 pl-1'>
                        อำเภอในเขตนี้
                      </FormLabel>
                      {availableDistricts && availableDistricts.length > 0 && (
                        <div className='flex gap-2'>
                          <button
                            type='button'
                            onClick={handleSelectAll}
                            className='cursor-pointer text-xs font-bold text-primary hover:underline'
                          >
                            เลือกทั้งหมด
                          </button>
                          <span className='text-muted-foreground'>|</span>
                          <button
                            type='button'
                            onClick={handleDeselectAll}
                            className='cursor-pointer text-xs font-bold text-muted-foreground hover:underline'
                          >
                            ยกเลิกทั้งหมด
                          </button>
                        </div>
                      )}
                    </div>

                    {!selectedProvinceId ? (
                      <p className='text-sm text-muted-foreground bg-slate-50 rounded-xl p-4 text-center'>
                        กรุณาเลือกจังหวัดก่อน
                      </p>
                    ) : isLoadingDistricts ? (
                      <div className='flex items-center justify-center gap-2 bg-slate-50 rounded-xl p-4'>
                        <Loader2 className='w-4 h-4 animate-spin text-muted-foreground' />
                        <span className='text-sm text-muted-foreground'>
                          กำลังโหลดอำเภอ...
                        </span>
                      </div>
                    ) : !availableDistricts ||
                      availableDistricts.length === 0 ? (
                      <p className='text-sm text-amber-600 bg-amber-50 rounded-xl p-4 text-center font-medium'>
                        ไม่มีอำเภอว่างในจังหวัดนี้
                      </p>
                    ) : (
                      <div className='grid grid-cols-2 gap-2 bg-slate-50 rounded-xl p-4 max-h-48 overflow-y-auto'>
                        {availableDistricts.map((district) => {
                          const isChecked = selectedDistrictIds.includes(
                            district.id,
                          )
                          return (
                            <label
                              key={district.id}
                              className={`flex items-center gap-2.5 rounded-lg px-3 py-2 cursor-pointer transition-colors ${
                                isChecked
                                  ? 'bg-primary/10 ring-1 ring-primary/30'
                                  : 'hover:bg-white'
                              }`}
                            >
                              <Checkbox
                                checked={isChecked}
                                onCheckedChange={(checked) => {
                                  const current = form.getValues('districtIds')
                                  if (checked) {
                                    form.setValue(
                                      'districtIds',
                                      [...current, district.id],
                                      { shouldValidate: true },
                                    )
                                  } else {
                                    form.setValue(
                                      'districtIds',
                                      current.filter(
                                        (id) => id !== district.id,
                                      ),
                                      { shouldValidate: true },
                                    )
                                  }
                                }}
                              />
                              <span className='text-sm font-medium leading-none'>
                                {district.name}
                              </span>
                            </label>
                          )
                        })}
                      </div>
                    )}

                    {selectedDistrictIds.length > 0 && (
                      <p className='text-xs text-muted-foreground pl-1'>
                        เลือกแล้ว{' '}
                        <span className='font-bold text-primary'>
                          {selectedDistrictIds.length}
                        </span>{' '}
                        อำเภอ
                      </p>
                    )}

                    <FormMessage className='text-xs font-bold' />
                  </FormItem>
                )}
              />

              <DialogFooter className='pt-2'>
                <Button
                  type='submit'
                  disabled={isCreating}
                  className='h-12 w-full rounded-xl font-black text-lg shadow-lg'
                >
                  {isCreating ? (
                    <>
                      <RefreshCw className='w-5 h-5 mr-2 animate-spin' />
                      กำลังบันทึก...
                    </>
                  ) : (
                    'บันทึกข้อมูล'
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
