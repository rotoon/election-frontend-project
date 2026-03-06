import { cn } from '@/lib/utils'
import { Vote } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function LeftSidebar({
  countingProgress = 0,
  updateAt,
}: {
  countingProgress?: number
  updateAt?: Date
}) {
  const pathname = usePathname()

  return (
    <aside className='w-full lg:w-[280px] p-6 flex flex-col gap-8 border-b lg:border-r border-white/5 bg-[#121212] z-10'>
      {/* Logo / Header */}
      <div className='flex items-center space-x-3'>
        <div className='bg-[#c5a059] text-black p-2 rounded-lg'>
          <Vote className='w-6 h-6' aria-hidden='true' />
        </div>
        <div className='block'>
          <h1 className='font-black text-xl tracking-tight leading-none'>
            ELECTION 69
          </h1>
          <p className='text-xs text-[#c5a059] font-bold tracking-wider uppercase mt-1'>
            ผลการเลือกตั้ง
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className='flex flex-col gap-2 flex-1 mt-6'>
        <Link
          href='/'
          className={cn(
            'flex justify-center items-center space-x-3 px-4 py-4 rounded-xl font-bold transition-colors',
            pathname === '/'
              ? 'bg-[#c5a059] text-black shadow-md shadow-[#c5a059]/20'
              : 'bg-[#1e1e1e] text-white/70 hover:text-white hover:bg-white/10 border border-white/5',
          )}
        >
          <span>ภาพรวม</span>
        </Link>
        <Link
          href='/district'
          className={cn(
            'flex justify-center items-center space-x-3 px-4 py-4 rounded-xl font-bold transition-colors',
            pathname === '/district'
              ? 'bg-[#c5a059] text-black shadow-md shadow-[#c5a059]/20'
              : 'bg-[#1e1e1e] text-white/70 hover:text-white hover:bg-white/10 border border-white/5',
          )}
        >
          <span>รายเขต</span>
        </Link>
      </nav>

      <div className='mt-auto pt-8 border-t border-white/10 flex flex-col gap-4'>
        {/* Status in Sidebar */}
        <div className='bg-black/40 border border-white/5 rounded-xl p-4'>
          <div className='flex items-center space-x-2 text-sm font-medium mb-1'>
            <span className='relative flex h-2 w-2'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75'></span>
              <span className='relative inline-flex rounded-full h-2 w-2 bg-green-500'></span>
            </span>
            <span className='text-white/60 text-xs' suppressHydrationWarning>
              อัปเดตล่าสุด:{' '}
              {updateAt
                ? new Date(updateAt).toLocaleString('th-TH', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : new Date().toLocaleDateString('th-TH')}
            </span>
          </div>
          <div className='text-white text-sm mt-3'>
            นับคะแนนแล้ว{' '}
            <span className='text-[#c5a059] font-black text-2xl ml-1'>
              {countingProgress}%
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
