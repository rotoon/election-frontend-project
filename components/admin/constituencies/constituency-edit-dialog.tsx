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
  useAvailableDistricts,
  type Constituency,
} from '@/hooks/use-constituencies'
import { zodResolver } from '@hookform/resolvers/zod'
import { Hash, Loader2, Pencil, RefreshCw } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// --- Zod Schema ---
const editSchema = z.object({
  zoneNumber: z.coerce.number().min(1, 'กรุณาระบุหมายเลขเขต'),
  districtIds: z.array(z.number()).min(1, 'กรุณาเลือกอำเภออย่างน้อย 1 รายการ'),
})

type EditFormValues = z.infer<typeof editSchema>

interface ConstituencyEditDialogProps {
  constituency: Constituency | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdate: (values: {
    id: number
    zoneNumber: number
    districtIds: number[]
  }) => Promise<void>
  isUpdating: boolean
}

export function ConstituencyEditDialog({
  constituency,
  open,
  onOpenChange,
  onUpdate,
  isUpdating,
}: ConstituencyEditDialogProps) {
  const form = useForm<EditFormValues>({
    resolver: zodResolver(editSchema) as any,
    defaultValues: { zoneNumber: '' as any, districtIds: [] },
  })

  const selectedDistrictIds = form.watch('districtIds')

  // Fetch available districts for this constituency's province
  const provinceId = constituency?.provinceId?.toString() || null
  const { data: availableDistricts, isLoading: isLoadingDistricts } =
    useAvailableDistricts(open ? provinceId : null)

  // Merge: available (unassigned) districts + currently assigned districts
  const allDistricts = useMemo(() => {
    if (!constituency || !availableDistricts) return availableDistricts || []

    const currentDistricts = (constituency.districtIds || []).map(
      (id, idx) => ({
        id,
        name: constituency.districts?.[idx] || `อำเภอ ${id}`,
        provinceId: constituency.provinceId,
        constituencyId: constituency.id,
      }),
    )

    const availableIds = new Set(availableDistricts.map((d) => d.id))
    const merged = [...availableDistricts]
    for (const d of currentDistricts) {
      if (!availableIds.has(d.id)) {
        merged.push(d)
      }
    }
    return merged.sort((a, b) => a.name.localeCompare(b.name, 'th'))
  }, [availableDistricts, constituency])

  // Pre-fill form when constituency changes
  useEffect(() => {
    if (constituency && open) {
      form.reset({
        zoneNumber: constituency.zone_number,
        districtIds: constituency.districtIds || [],
      })
    }
  }, [constituency, open, form])

  async function onSubmit(values: EditFormValues) {
    if (!constituency) return
    try {
      await onUpdate({
        id: constituency.id,
        zoneNumber: values.zoneNumber,
        districtIds: values.districtIds,
      })
      onOpenChange(false)
    } catch {
      // Error handled in parent/hook
    }
  }

  function handleSelectAll() {
    form.setValue(
      'districtIds',
      allDistricts.map((d) => d.id),
      { shouldValidate: true },
    )
  }

  function handleDeselectAll() {
    form.setValue('districtIds', [], { shouldValidate: true })
  }

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className='rounded-3xl border-none shadow-2xl max-h-[85vh] overflow-y-auto'>
        <DialogHeader className='space-y-3 pb-4'>
          <div className='w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center'>
            <Pencil className='w-6 h-6 text-blue-600' />
          </div>
          <div>
            <DialogTitle className='text-2xl font-black'>
              แก้ไขเขตเลือกตั้ง
            </DialogTitle>
            <DialogDescription className='text-muted-foreground font-medium'>
              {constituency
                ? `${constituency.province} — เขตที่ ${constituency.zone_number}`
                : ''}
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
                        className='h-12 pl-11 rounded-xl bg-slate-50 border-slate-200 focus:ring-primary/20 transition-all font-bold'
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
                    {allDistricts.length > 0 && (
                      <div className='flex gap-2'>
                        <button
                          type='button'
                          onClick={handleSelectAll}
                          className='text-xs font-bold text-primary hover:underline'
                        >
                          เลือกทั้งหมด
                        </button>
                        <span className='text-muted-foreground'>|</span>
                        <button
                          type='button'
                          onClick={handleDeselectAll}
                          className='text-xs font-bold text-muted-foreground hover:underline'
                        >
                          ยกเลิกทั้งหมด
                        </button>
                      </div>
                    )}
                  </div>

                  {isLoadingDistricts ? (
                    <div className='flex items-center justify-center gap-2 bg-slate-50 rounded-xl p-4'>
                      <Loader2 className='w-4 h-4 animate-spin text-muted-foreground' />
                      <span className='text-sm text-muted-foreground'>
                        กำลังโหลดอำเภอ...
                      </span>
                    </div>
                  ) : allDistricts.length === 0 ? (
                    <p className='text-sm text-amber-600 bg-amber-50 rounded-xl p-4 text-center font-medium'>
                      ไม่พบข้อมูลอำเภอ
                    </p>
                  ) : (
                    <div className='grid grid-cols-2 gap-2 bg-slate-50 rounded-xl p-4 max-h-48 overflow-y-auto'>
                      {allDistricts.map((district) => {
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
                                    current.filter((id) => id !== district.id),
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
                disabled={isUpdating}
                className='h-12 w-full rounded-xl font-black text-lg shadow-lg'
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className='w-5 h-5 mr-2 animate-spin' />
                    กำลังบันทึก...
                  </>
                ) : (
                  'บันทึกการแก้ไข'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
