'use client'

import { SidebarLayout } from '@/components/shared/sidebar-layout'
import { useAuthStore } from '@/store/useAuthStore'
import { Flag, Settings2, Users } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ECLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { logout } = useAuthStore()

  const handleLogout = async () => {
    logout()
    router.push('/')
  }

  const navItems = [
    { href: '/ec/parties', label: 'จัดการพรรคการเมือง', icon: Flag },
    { href: '/ec/candidates', label: 'จัดการผู้สมัคร', icon: Users },
    { href: '/ec/control', label: 'ควบคุมการเลือกตั้ง', icon: Settings2 },
  ]

  return (
    <SidebarLayout
      title='EC Panel'
      subtitle='คณะกรรมการการเลือกตั้ง'
      variant='ec'
      navItems={navItems}
      onLogout={handleLogout}
    >
      {children}
    </SidebarLayout>
  )
}
