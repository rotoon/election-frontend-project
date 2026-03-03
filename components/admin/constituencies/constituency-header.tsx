'use client'

import { Button } from '@/components/ui/button'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { Hash, MapPin, Plus, RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// --- Zod Schema ---
const constituencySchema = z.object({
  provinceId: z.string().min(1, 'กรุณาเลือกจังหวัด'),
  zoneNumber: z.number().min(1, 'กรุณาระบุหมายเลขเขต'),
})

type ConstituencyFormValues = z.infer<typeof constituencySchema>

interface Province {
  id: number
  name: string
}

interface ConstituencyHeaderProps {
  provinces: Province[] | undefined
  onCreate: (values: { province: string; zoneNumber: number }) => Promise<void>
  isCreating: boolean
}

export function ConstituencyHeader({
  provinces,
  onCreate,
  isCreating,
}: ConstituencyHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<ConstituencyFormValues>({
    resolver: zodResolver(constituencySchema),
    defaultValues: { provinceId: '', zoneNumber: 0 },
  })

  async function onSubmit(values: ConstituencyFormValues) {
    try {
      await onCreate({
        province: values.provinceId,
        zoneNumber: values.zoneNumber,
      })
      setIsOpen(false)
      form.reset()
    } catch {
      // Error handled in parent/hook
    }
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
        <DialogContent className='rounded-3xl border-none shadow-2xl'>
          <DialogHeader className='space-y-3 pb-4'>
            <div className='w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center'>
              <MapPin className='w-6 h-6 text-primary' />
            </div>
            <div>
              <DialogTitle className='text-2xl font-black'>
                เพิ่มเขตเลือกตั้งใหม่
              </DialogTitle>
              <DialogDescription className='text-muted-foreground font-medium'>
                ระบุรายละเอียดจังหวัดและหมายเลขเขตที่คุณต้องการเพิ่มเข้าระบบ
              </DialogDescription>
            </div>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='provinceId'
                render={({ field }) => (
                  <FormItem className='space-y-1.5'>
                    <FormLabel className='text-xs font-black uppercase tracking-widest text-muted-foreground/80 pl-1'>
                      จังหวัด
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className='h-12 rounded-xl bg-slate-50 border-slate-200 focus:ring-primary/20 transition-all'>
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
                          className='h-12 pl-11 rounded-xl bg-slate-50 border-slate-200 focus:ring-primary/20 transition-all font-bold'
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                        />
                      </div>
                    </FormControl>
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
