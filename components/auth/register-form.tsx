'use client'

import { Button } from '@/components/ui/button'
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
import { useRegisterMutation } from '@/hooks/use-auth'
import {
  useConstituencyByDistrict,
  useDistricts,
  useProvinces,
} from '@/hooks/use-location'
import { formatCitizenId } from '@/lib/utils'
import { RegisterUserInput } from '@/types/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { Resolver, useForm } from 'react-hook-form'
import * as z from 'zod'

const formSchema = z
  .object({
    citizenId: z
      .string()
      .transform((val) => val.replace(/-/g, '')) // Remove hyphens before validation
      .pipe(
        z
          .string()
          .length(13, 'เลขบัตรประชาชนต้องมี 13 หลัก')
          .regex(/^\d+$/, 'ต้องเป็นตัวเลขเท่านั้น'),
      ),
    password: z.string().min(6, 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร'),
    confirmPassword: z.string(),
    firstName: z.string().min(2, 'กรุณาระบุชื่อ'),
    lastName: z.string().min(2, 'กรุณาระบุนามสกุล'),
    address: z.string().min(5, 'กรุณาระบุที่อยู่'),
    provinceId: z.coerce.number().min(1, 'กรุณาเลือกจังหวัด'),
    districtId: z.coerce.number().min(1, 'กรุณาเลือกอำเภอ'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'รหัสผ่านไม่ตรงกัน',
    path: ['confirmPassword'],
  })

interface RegisterFormProps {
  onSuccess: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const registerMutation = useRegisterMutation(onSuccess)

  // Use explicit type RegisterUserInput, but we need to extend it for confirmPassword which is not in API type
  // So we define a local form type
  type RegisterFormValues = RegisterUserInput & { confirmPassword: string }

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema) as Resolver<RegisterFormValues>,
    defaultValues: {
      citizenId: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      address: '',
      provinceId: 0,
      districtId: 0,
    },
  })

  const selectedProvinceId = form.watch('provinceId')
  const selectedDistrictId = form.watch('districtId')

  const { data: provinces = [] } = useProvinces()
  const { data: districts = [] } = useDistricts(selectedProvinceId)
  const { data: constituency, isLoading: loadingConstituency } =
    useConstituencyByDistrict(selectedDistrictId)

  // Reset district when province changes
  useEffect(() => {
    if (selectedProvinceId) {
      form.setValue('districtId', 0)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedProvinceId])

  function onSubmit(values: RegisterFormValues) {
    registerMutation.mutate({
      citizenId: values.citizenId, // Schema transform handles stripping
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      address: values.address,
      provinceId: values.provinceId,
      districtId: values.districtId,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        {/* 1. Citizen ID */}
        <FormField
          control={form.control}
          name='citizenId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>เลขบัตรประจำตัวประชาชน</FormLabel>
              <FormControl>
                <Input
                  placeholder='1-2345-67890-12-3'
                  maxLength={17}
                  {...field}
                  onChange={(e) => {
                    const formatted = formatCitizenId(e.target.value)
                    field.onChange(formatted)
                  }}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 2. Password & Confirm */}
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>รหัสผ่าน</FormLabel>
                <FormControl>
                  <Input type='password' placeholder='******' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='confirmPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>ยืนยันรหัสผ่าน</FormLabel>
                <FormControl>
                  <Input type='password' placeholder='******' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 3. Name */}
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>ชื่อจริง</FormLabel>
                <FormControl>
                  <Input placeholder='สมชาย' {...field} />
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
                <FormLabel>นามสกุล</FormLabel>
                <FormControl>
                  <Input placeholder='ใจดี' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 4. Address */}
        <FormField
          control={form.control}
          name='address'
          render={({ field }) => (
            <FormItem>
              <FormLabel>ที่อยู่</FormLabel>
              <FormControl>
                <Input placeholder='บ้านเลขที่, ถนน...' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* 5. Location: Province & District */}
        <div className='grid grid-cols-2 gap-4'>
          <FormField
            control={form.control}
            name='provinceId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>จังหวัด</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? field.value.toString() : ''}
                >
                  <FormControl className='w-full'>
                    <SelectTrigger>
                      <SelectValue placeholder='เลือกจังหวัด' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {provinces.map((p) => (
                      <SelectItem key={p.id} value={p.id.toString()}>
                        {p.name}
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
            name='districtId'
            render={({ field }) => (
              <FormItem>
                <FormLabel>อำเภอ</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? field.value.toString() : ''}
                  disabled={!selectedProvinceId || districts.length === 0}
                >
                  <FormControl className='w-full'>
                    <SelectTrigger>
                      <SelectValue placeholder='เลือกอำเภอ' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {districts.map((d) => (
                      <SelectItem key={d.id} value={d.id.toString()}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* 6. Constituency Display */}
        {selectedDistrictId ? (
          <div className='p-4 bg-muted rounded-lg border'>
            <h4 className='font-medium mb-1'>เขตเลือกตั้งของคุณ</h4>
            {loadingConstituency ? (
              <p className='text-sm text-muted-foreground'>
                กำลังโหลดข้อมูลเขตเลือกตั้ง...
              </p>
            ) : constituency ? (
              <div>
                <p className='text-lg font-bold text-primary'>
                  เขตที่ {constituency.number}
                </p>
                <p className='text-sm text-muted-foreground'>
                  {
                    provinces.find((p) => p.id === selectedProvinceId)?.name
                  }{' '}
                </p>
              </div>
            ) : (
              <p className='text-sm text-muted-foreground'>
                ไม่พบข้อมูลเขตเลือกตั้ง
              </p>
            )}
          </div>
        ) : (
          <div className='p-4 bg-muted rounded-lg border'>
            <h4 className='font-medium mb-1'>เขตเลือกตั้งของคุณ</h4>
            <p className='text-sm text-muted-foreground'>กรุณาเลือกอำเภอ</p>
          </div>
        )}

        <Button
          type='submit'
          className='w-full'
          disabled={registerMutation.isPending}
        >
          {registerMutation.isPending ? 'กำลังลงทะเบียน...' : 'ลงทะเบียน'}
        </Button>
      </form>
    </Form>
  )
}
