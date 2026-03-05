'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCitizenId } from '@/lib/utils'
import { User } from '@/types/user'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { RefreshCw, Search, Shield } from 'lucide-react'

interface UserTableProps {
  users: User[]
  isLoading: boolean
  page: number
  limit: number
  onRoleChange: (userId: number, newRole: string) => void
  getPrimaryRole: (roles: string[]) => string
}

export function UserTable({
  users,
  isLoading,
  page,
  limit,
  onRoleChange,
  getPrimaryRole,
}: UserTableProps) {
  return (
    <div className='border border-slate-200/60 rounded-3xl bg-white overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hidden md:block'>
      <Table>
        <TableHeader className='bg-slate-50/50'>
          <TableRow className='hover:bg-transparent border-b border-slate-200/60'>
            <TableHead className='h-14 font-bold text-slate-900 px-10'>
              ชื่อ-นามสกุล
            </TableHead>
            <TableHead className='h-14 font-bold text-slate-900 px-4'>
              ที่อยู่
            </TableHead>
            <TableHead className='h-14 font-bold text-slate-900 px-4'>
              อำเภอ/เขต
            </TableHead>
            <TableHead className='h-14 font-bold text-slate-900 px-4'>
              จังหวัด
            </TableHead>
            <TableHead className='h-14 font-bold text-slate-900 px-4 text-center'>
              เขตเลือกตั้ง
            </TableHead>
            <TableHead className='h-14 font-bold text-slate-900 px-4'>
              เลขบัตรประจำตัวประชาชน
            </TableHead>
            <TableHead className='h-14 font-bold text-slate-900 px-4'>
              การจัดการสิทธิ์ (Role)
            </TableHead>
            <TableHead className='h-14 font-bold text-slate-900 text-right pr-8'>
              วันที่สมัคร
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className='h-40 text-center'
              >
                <div className='flex flex-col items-center justify-center gap-3'>
                  <RefreshCw className='h-8 w-8 text-primary animate-spin opacity-20' />
                  <span className='text-sm font-medium text-muted-foreground'>
                    กำลังเรียกข้อมูลผู้ใช้...
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className='h-40 text-center'
              >
                <div className='flex flex-col items-center justify-center gap-2'>
                  <Search className='h-8 w-8 text-slate-200' />
                  <span className='text-slate-500 font-medium'>
                    ไม่พบข้อมูลผู้ใช้งานที่ค้นหา
                  </span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            users.map((u, index) => {
              const primaryRole = getPrimaryRole(u.roles)
              return (
                <TableRow
                  key={u.id}
                  className='hover:bg-slate-50/50 transition-colors group/row border-b last:border-0 border-slate-100 h-20'
                >
                  <TableCell className='px-10'>
                    <div className='flex items-center gap-3'>
                      <div className='flex flex-col'>
                        <span className='font-bold text-slate-900'>
                          {u.firstName} {u.lastName}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='px-4 text-slate-600'>
                    {u.address || 'ไม่มีข้อมูลที่อยู่'}
                  </TableCell>
                  <TableCell className='px-4 font-bold text-slate-600'>
                    {u.district?.name || '-'}
                  </TableCell>
                  <TableCell className='px-4 font-bold text-slate-600'>
                    {u.province?.name || '-'}
                  </TableCell>
                  <TableCell className='px-4 font-bold text-slate-600 text-center'>
                    {u.constituency?.number
                      ? `เขต ${u.constituency.number}`
                      : '-'}
                  </TableCell>
                  <TableCell className='px-4 font-mono font-bold text-slate-600'>
                    {formatCitizenId(u.citizenId)}
                  </TableCell>
                  <TableCell className='px-4'>
                    <div className='flex items-center gap-3'>
                      <Select
                        value={primaryRole}
                        onValueChange={(val) => onRoleChange(u.id, val)}
                      >
                        <SelectTrigger className='h-9 w-[160px] rounded-lg bg-slate-50 border-slate-200 font-bold text-xs ring-offset-0 focus:ring-0'>
                          <div className='flex items-center gap-2'>
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${
                                primaryRole === 'ROLE_ADMIN'
                                  ? 'bg-red-500'
                                  : primaryRole === 'ROLE_EC'
                                    ? 'bg-purple-500'
                                    : 'bg-green-500'
                              }`}
                            />
                            <SelectValue placeholder='เลือก Role' />
                          </div>
                        </SelectTrigger>
                        <SelectContent className='rounded-xl shadow-xl'>
                          <SelectItem
                            value='ROLE_VOTER'
                            className='font-bold'
                          >
                            Voter (ผู้ใช้ทั่วไป)
                          </SelectItem>
                          <SelectItem
                            value='ROLE_EC'
                            className='font-bold'
                          >
                            EC Member (กกต.)
                          </SelectItem>
                          <SelectItem
                            value='ROLE_ADMIN'
                            className='font-bold'
                          >
                            Admin (ผู้ดูแลระบบ)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      {primaryRole === 'ROLE_ADMIN' && (
                        <Shield className='w-4 h-4 text-red-500' />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className='text-right pr-8 text-sm font-medium text-slate-500 uppercase'>
                    {u.createdAt
                      ? format(new Date(u.createdAt), 'dd MMM yyyy', {
                          locale: th,
                        })
                      : '-'}
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
