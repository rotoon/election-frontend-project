'use client'

import { LoginForm } from '@/components/auth/login-form'
import { RegisterForm } from '@/components/auth/register-form'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function AuthPage() {
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState('login')

  const renderHomeButton = () => (
    <Button
      asChild
      variant='outline'
      size='lg'
      className='w-full max-w-md font-bold mt-4 shadow-sm transition-colors border-white/10 hover:bg-zinc-100 hover:text-zinc-900 group'
    >
      <Link href='/'>
        <ChevronLeft className='mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1' />
        ดูผลเลือกตั้ง
      </Link>
    </Button>
  )

  if (registrationSuccess) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen bg-background p-4'>
        <Card className='w-full max-w-md'>
          <CardHeader className='text-center'>
            <div className='flex justify-center mb-4'>
              <div className='rounded-full bg-green-100 p-3'>
                <CheckCircle2 className='h-8 w-8 text-green-600' />
              </div>
            </div>
            <CardTitle className='text-2xl text-green-700'>
              ลงทะเบียนสำเร็จ
            </CardTitle>
            <CardDescription>
              บัญชีของคุณถูกสร้างเรียบร้อยแล้ว กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='rounded-lg bg-green-100/50 p-4 text-center'>
              <p className='text-sm font-medium text-green-800'>
                รหัสประชาชนของท่านคือชื่อผู้ใช้สำหรับเข้าสู่ระบบ
              </p>
            </div>
            <Button
              className='w-full'
              size='lg'
              onClick={() => {
                setRegistrationSuccess(false)
                setActiveTab('login')
              }}
            >
              เข้าสู่ระบบ
            </Button>
          </CardContent>
        </Card>
        {renderHomeButton()}
      </div>
    )
  }

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-background p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <CardTitle className='text-2xl font-bold text-foreground'>
            ระบบเลือกตั้งออนไลน์
          </CardTitle>
          <CardDescription>เข้าสู่ระบบเพื่อใช้สิทธิเลือกตั้ง</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-2 mb-4'>
              <TabsTrigger value='login'>เข้าสู่ระบบ</TabsTrigger>
              <TabsTrigger value='register'>ลงทะเบียน</TabsTrigger>
            </TabsList>
            <TabsContent value='login'>
              <LoginForm />
            </TabsContent>
            <TabsContent value='register'>
              <RegisterForm onSuccess={() => setRegistrationSuccess(true)} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      {renderHomeButton()}
    </div>
  )
}
