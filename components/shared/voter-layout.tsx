'use client'

import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/useAuthStore'
import { LogOut, Menu, X, Vote, LayoutGrid } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function VoterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    logout()
    router.push('/auth')
  }

  const isActive = (path: string) => pathname === path

  const navLinks = [
    { href: '/', label: 'หน้าแรก' },
    { href: '/vote', label: 'คูหาเลือกตั้ง' },
  ]

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Navbar */}
      <nav className='bg-white border-b border-slate-200 sticky top-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            <div className='flex items-center'>
              <Link
                href='/'
                className='flex-shrink-0 flex items-center'
              >
                <Vote className='h-8 w-8 text-blue-600 mr-2' />
                <span className='font-bold text-xl text-slate-900 hidden sm:block'>
                  Election Online
                </span>
                <span className='font-bold text-xl text-slate-900 sm:hidden'>
                  Election
                </span>
              </Link>
              <div className='hidden md:ml-6 md:flex md:space-x-8'>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium h-full transition-colors ${
                      isActive(link.href)
                        ? 'border-blue-500 text-slate-900'
                        : 'border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className='flex items-center'>
              {/* Desktop User Menu */}
              {user ? (
                <div className='hidden md:flex items-center space-x-4'>
                  {user.roles && user.roles.length > 1 && (
                    <Link href='/portal'>
                      <Button
                        variant='outline'
                        size='sm'
                        className='gap-2'
                      >
                        <LayoutGrid className='h-4 w-4' />
                        เปลี่ยนบทบาท
                      </Button>
                    </Link>
                  )}
                  <Link
                    href='/profile'
                    className='text-right hover:opacity-80 transition-opacity'
                  >
                    <div className='text-sm font-medium text-slate-900'>
                      {user.firstName} {user.lastName}
                    </div>
                    <div className='text-xs text-slate-500'>
                      {user.constituency?.number
                        ? `เขตเลือกตั้งที่ ${user.constituency.number}`
                        : user.constituency?.id
                          ? `เขตเลือกตั้ง ID ${user.constituency.id}`
                          : 'ไม่ระบุเขต'}
                    </div>
                  </Link>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={handleLogout}
                  >
                    <LogOut className='h-5 w-5' />
                  </Button>
                </div>
              ) : null}

              {/* Mobile Menu Button */}
              <div className='flex items-center md:hidden'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? (
                    <X className='h-6 w-6 text-slate-600' />
                  ) : (
                    <Menu className='h-6 w-6 text-slate-600' />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className='md:hidden bg-white border-b border-slate-200 shadow-lg absolute inset-x-0 top-16 z-40 animate-in slide-in-from-top-2'>
            <div className='px-4 pt-2 pb-6 space-y-4'>
              {/* User Info Mobile */}
              {user && (
                <div className='flex items-center space-x-3 p-3 bg-slate-50 rounded-lg border border-slate-100'>
                  <div className='flex-1 min-w-0'>
                    <p className='text-sm font-medium text-slate-900 truncate'>
                      {user.firstName} {user.lastName}
                    </p>
                    <p className='text-xs text-slate-500 truncate'>
                      {user.constituency?.number
                        ? `เขตเลือกตั้งที่ ${user.constituency.number}`
                        : 'ไม่ระบุเขต'}
                    </p>
                  </div>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={handleLogout}
                    className='text-red-500 hover:text-red-600 hover:bg-red-50'
                  >
                    <LogOut className='h-4 w-4 mr-2' />
                    ออก
                  </Button>
                </div>
              )}

              {/* Nav Links Mobile */}
              <div className='flex flex-col space-y-1'>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                      isActive(link.href)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 px-4 pb-24 md:pb-6'>
        {children}
      </main>
    </div>
  )
}
