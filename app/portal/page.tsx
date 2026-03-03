'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { usePermission } from '@/hooks/use-permission'
import { useAuthStore } from '@/store/useAuthStore'
import { Role } from '@/types/auth'
import { motion } from 'framer-motion'
import { Briefcase, ChevronRight, ShieldAlert, Vote } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function PortalPage() {
  const router = useRouter()
  const { user, isAuthenticated, _hasHydrated, logout } = useAuthStore()
  const { roles } = usePermission()

  const handleLogout = async () => {
    logout()
    router.push('/auth')
  }

  useEffect(() => {
    if (_hasHydrated && !isAuthenticated) {
      router.push('/auth')
    }
  }, [isAuthenticated, _hasHydrated, router])

  if (!_hasHydrated) return null // Or a loading spinner
  if (!user) return null

  const roleCards = [
    {
      role: 'ROLE_ADMIN',
      title: 'ผู้ดูแลระบบ',
      description: 'จัดการข้อมูลผู้ใช้และการตั้งค่าระบบ',
      icon: ShieldAlert,
      href: '/admin/constituencies',
      color: 'bg-red-100 border-red-200 text-red-700',
      iconColor: 'text-red-600',
    },
    {
      role: 'ROLE_EC',
      title: 'เจ้าหน้าที่ กกต.',
      description: 'จัดการการเลือกตั้งและตรวจสอบผู้สมัคร',
      icon: Briefcase,
      href: '/ec/parties',
      color: 'bg-blue-100 border-blue-200 text-blue-700',
      iconColor: 'text-blue-600',
    },
    {
      role: 'ROLE_VOTER',
      title: 'ผู้ใช้สิทธิ์เลือกตั้ง',
      description: 'ลงคะแนนเสียงและดูข้อมูลการเลือกตั้ง',
      icon: Vote,
      href: '/vote',
      color: 'bg-green-100 border-green-200 text-green-700',
      iconColor: 'text-green-600',
    },
  ]

  // Filter cards based on user roles
  const availableCards = roleCards.filter((card) =>
    roles.includes(card.role as Role),
  )

  return (
    <div className='min-h-screen bg-slate-50/50 flex flex-col items-center justify-center p-4'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='max-w-4xl w-full space-y-8'
      >
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight text-slate-900'>
            ยินดีต้อนรับ, {user.firstName} {user.lastName}
          </h1>
          <p className='text-muted-foreground'>
            กรุณาเลือกบทบาทที่ต้องการใช้งาน
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {availableCards.map((card, index) => (
            <motion.div
              key={card.role}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Link href={card.href}>
                <Card
                  className={`h-full transition-[transform,box-shadow] duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer border-2 ${card.color}`}
                >
                  <CardHeader className='flex flex-row items-center gap-4'>
                    <div
                      className={`p-3 rounded-xl bg-white shadow-sm ${card.iconColor}`}
                    >
                      <card.icon size={32} />
                    </div>
                    <div className='flex-1'>
                      <CardTitle className='text-xl mb-1'>
                        {card.title}
                      </CardTitle>
                      <CardDescription className={`${card.color} opacity-80`}>
                        {card.description}
                      </CardDescription>
                    </div>
                    <ChevronRight className='opacity-50' />
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className='text-center pt-8'>
          <Button
            variant='outline'
            onClick={() => handleLogout()}
            className='text-muted-foreground'
          >
            ออกจากระบบ
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
