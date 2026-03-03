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
import { ImageUpload } from '@/components/ui/image-upload'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  useCreatePartyMutation,
  useUpdatePartyMutation,
} from '@/hooks/use-parties'
import { type Party } from '@/types/party'
import { zodResolver } from '@hookform/resolvers/zod'
import { Plus } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

// --- Zod Schema ---
const partySchema = z.object({
  name: z.string().min(1, 'กรุณาระบุชื่อพรรค'),
  logoUrl: z.string(),
  policy: z.string(),
})

type PartyFormValues = z.infer<typeof partySchema>

interface PartyFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editParty: Party | null
  onSuccess?: () => void
}

export function PartyFormDialog({
  open,
  onOpenChange,
  editParty,
  onSuccess,
}: PartyFormDialogProps) {
  const createParty = useCreatePartyMutation()
  const updateParty = useUpdatePartyMutation()

  const isEdit = !!editParty
  const isMutating = createParty.isPending || updateParty.isPending

  const form = useForm<PartyFormValues>({
    resolver: zodResolver(partySchema),
    defaultValues: { name: '', logoUrl: '', policy: '' },
  })

  // Populate form when editing
  useEffect(() => {
    if (editParty) {
      form.reset({
        name: editParty.name,
        logoUrl: editParty.logo_url || '',
        policy: editParty.policy || '',
      })
    } else {
      form.reset({ name: '', logoUrl: '', policy: '' })
    }
  }, [editParty, form])

  const onSubmit = async (values: PartyFormValues) => {
    const payload = {
      name: values.name,
      logo_url: values.logoUrl || '',
      policy: values.policy || '',
    }

    try {
      if (isEdit && editParty) {
        await updateParty.mutateAsync({ id: editParty.id, payload })
      } else {
        await createParty.mutateAsync(payload)
      }
      onOpenChange(false)
      onSuccess?.()
    } catch {
      // Error handled in hook
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className='shadow-lg hover:shadow-xl transition-[box-shadow,colors] duration-300 gap-2 bg-blue-600 hover:bg-blue-700'>
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
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='grid gap-6 py-6'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold'>
                    ชื่อพรรค
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='เช่น พรรคใจดี'
                      className='bg-slate-50/50 focus:bg-white transition-colors'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='logoUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold'>
                    โลโก้พรรค
                  </FormLabel>
                  <FormControl>
                    <ImageUpload
                      value={field.value || ''}
                      onChange={field.onChange}
                      folder='parties'
                      disabled={isMutating}
                      placeholder='คลิกหรือลากโลโก้พรรคมาวาง'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='policy'
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-sm font-semibold'>
                    นโยบายของพรรค
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className='min-h-[120px] bg-slate-50/50 focus:bg-white transition-colors'
                      placeholder='ระบุรายละเอียดนโยบายหลักของพรรค...'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className='bg-slate-50 -mx-6 -mb-6 p-6 border-t'>
          <Button
            variant='ghost'
            onClick={() => onOpenChange(false)}
            className='mr-auto'
          >
            ยกเลิก
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={isMutating}
            className='min-w-[120px] bg-blue-600 hover:bg-blue-700 shadow-md'
          >
            {isMutating
              ? 'กำลังบันทึก...'
              : isEdit
                ? 'บันทึกการแก้ไข'
                : 'บันทึกข้อมูล'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
