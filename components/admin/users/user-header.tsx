'use client'

interface UserHeaderProps {
  totalUsers: number
}

export function UserHeader({ totalUsers }: UserHeaderProps) {
  return (
    <div className='flex justify-between items-end gap-6'>
      <div className='space-y-1.5'>
        <h2 className='text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900'>
          จัดการผู้ใช้งาน
        </h2>
        <p className='text-muted-foreground font-medium'>
          ตรวจสอบและจัดการสิทธิ์การเข้าถึงของผู้ใช้งานในระบบ
        </p>
      </div>
      <div className='hidden sm:flex flex-col items-end'>
        <span className='text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70'>
          สมาชิกทั้งหมด
        </span>
        <div className='text-2xl font-black text-slate-900 leading-none'>
          {totalUsers}{' '}
          <span className='text-sm font-medium text-muted-foreground'>คน</span>
        </div>
      </div>
    </div>
  )
}
