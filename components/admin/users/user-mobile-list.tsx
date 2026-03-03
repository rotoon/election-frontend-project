'use client'

import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { formatCitizenId } from '@/lib/utils'
import { User } from '@/types/user'
import { UserCog } from 'lucide-react'

interface UserMobileListProps {
  users: User[]
  isLoading: boolean
  onRoleChange: (userId: number, newRole: string) => void
  getPrimaryRole: (roles: string[]) => string
}

export function UserMobileList({
  users,
  isLoading,
  onRoleChange,
  getPrimaryRole,
}: UserMobileListProps) {
  if (isLoading) {
    return (
      <div className='grid gap-6 md:hidden'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className='bg-white p-6 rounded-3xl border border-slate-100 animate-pulse h-44'
          />
        ))}
      </div>
    )
  }

  return (
    <div className='grid gap-6 md:hidden'>
      {users.map((u) => {
        const primaryRole = getPrimaryRole(u.roles)
        return (
          <div
            key={u.id}
            className='bg-white p-6 rounded-[2.5rem] shadow-[0_15px_45px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col gap-6 relative group overflow-hidden'
          >
            <div className='flex items-start justify-between'>
              <div className='flex items-center gap-4'>
                <div className='w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-slate-200'>
                  {u.firstName[0]}
                </div>
                <div className='flex flex-col'>
                  <h3 className='font-black text-xl text-slate-900 leading-tight'>
                    {u.firstName} {u.lastName}
                  </h3>
                  <p className='text-xs font-mono font-bold text-slate-400'>
                    {formatCitizenId(u.citizenId)}
                  </p>
                </div>
              </div>
              <div className='bg-slate-50 p-2 rounded-xl'>
                <UserCog className='w-5 h-5 text-slate-400' />
              </div>
            </div>

            <div className='flex flex-col gap-3 pt-2 border-t border-slate-100'>
              <div className='flex items-center justify-between'>
                <span className='text-[10px] font-black uppercase tracking-widest text-muted-foreground/60'>
                  สิทธิ์ปัจจุบัน
                </span>
                <Badge
                  className={`${
                    primaryRole === 'ROLE_ADMIN'
                      ? 'bg-red-500'
                      : primaryRole === 'ROLE_EC'
                        ? 'bg-purple-500'
                        : 'bg-green-500'
                  } text-white font-black rounded-full px-3 py-1`}
                >
                  {primaryRole.replace('ROLE_', '')}
                </Badge>
              </div>
              <Select
                value={primaryRole}
                onValueChange={(val) => onRoleChange(u.id, val)}
              >
                <SelectTrigger className='h-12 w-full rounded-2xl bg-slate-50 border-0 font-black text-slate-800 focus:ring-0'>
                  <SelectValue placeholder='เปลี่ยนสิทธิ์สมาชิก' />
                </SelectTrigger>
                <SelectContent className='rounded-2xl'>
                  <SelectItem value='ROLE_VOTER'>Voter</SelectItem>
                  <SelectItem value='ROLE_EC'>EC Member</SelectItem>
                  <SelectItem value='ROLE_ADMIN'>Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      })}
    </div>
  )
}
