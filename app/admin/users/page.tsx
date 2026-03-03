'use client'

import { PaginationBar } from '@/components/shared/pagination-bar'
import { Input } from '@/components/ui/input'
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
import { useDebounce } from '@/hooks/use-debounce'
import { useURLPagination } from '@/hooks/use-url-pagination'
import { useManageUsers, useUpdateUserRoleMutation } from '@/hooks/use-users'
import { formatCitizenId } from '@/lib/utils'
import { User } from '@/types/user'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import { Suspense, useState } from 'react'

function getPrimaryRole(roles: string[]): string {
  if (roles.includes('ROLE_ADMIN')) return 'ROLE_ADMIN'
  if (roles.includes('ROLE_EC')) return 'ROLE_EC'
  return 'ROLE_VOTER'
}

function UsersPageContent() {
  const { state, actions } = useURLPagination({
    filterKeys: ['search'],
  })

  const [searchInput, setSearchInput] = useState(state.filters.search || '')
  const debouncedSearch = useDebounce(searchInput, 500)

  const { data, isLoading } = useManageUsers({
    role: debouncedSearch,
    page: state.page,
    limit: state.limit,
  })

  const updateRoleMutation = useUpdateUserRoleMutation()

  const users = data?.users || []
  const meta = data?.meta || {
    total: 0,
    page: 1,
    limit: state.limit,
    totalPages: 1,
  }

  function handleSearchChange(value: string) {
    setSearchInput(value)
    actions.setFilter('search', value)
  }

  function handleRoleChange(userId: number, newRole: string) {
    if (confirm(`คุณต้องการเปลี่ยนสิทธิ์ผู้ใช้เป็น "${newRole}" ใช่หรือไม่?`)) {
      updateRoleMutation.mutate({ userId, role: newRole })
    }
  }

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-3xl font-bold tracking-tight'>จัดการผู้ใช้งาน</h2>
        <div className='text-sm text-muted-foreground'>
          ทั้งหมด {meta.total} คน
        </div>
      </div>

      <div className='flex flex-wrap items-center gap-4 bg-white p-4 rounded-lg border'>
        <div className='flex items-center space-x-2'>
          <span className='text-sm font-medium'>ค้นหา:</span>
          <Input
            type='text'
            placeholder='ชื่อ, นามสกุล, เลขบัตร...'
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className='w-[250px]'
          />
        </div>
      </div>

      <div className='border rounded-md'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-center'>ลำดับ</TableHead>
              <TableHead>ชื่อ-นามสกุล</TableHead>
              <TableHead>เลขบัตรประชาชน</TableHead>
              <TableHead>ที่อยู่</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>วันที่สมัคร</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='text-center h-24 text-muted-foreground'
                >
                  กำลังโหลด...
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className='text-center h-24 text-muted-foreground'
                >
                  ไม่พบผู้ใช้งาน
                </TableCell>
              </TableRow>
            ) : (
              users.map((u: User, index) => (
                <TableRow key={u.id}>
                  <TableCell className='text-center'>
                    {index + 1 + Number(state.page - 1) * Number(state.limit)}
                  </TableCell>
                  <TableCell className='font-medium'>
                    {u.firstName} {u.lastName}
                  </TableCell>
                  <TableCell className='font-mono text-muted-foreground'>
                    {formatCitizenId(u.citizenId)}
                  </TableCell>
                  <TableCell className='text-muted-foreground'>
                    {u.address || '-'}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={getPrimaryRole(u.roles)}
                      onValueChange={(val) => handleRoleChange(u.id, val)}
                    >
                      <SelectTrigger className='w-[140px]'>
                        <SelectValue placeholder='เลือกสิทธิ์' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='ROLE_VOTER'>Voter</SelectItem>
                        <SelectItem value='ROLE_EC'>EC Member</SelectItem>
                        <SelectItem value='ROLE_ADMIN'>Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {u.createdAt
                      ? format(new Date(u.createdAt), 'dd MMM yyyy', {
                          locale: th,
                        })
                      : '-'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <PaginationBar
        currentPage={state.page}
        totalPages={meta.totalPages}
        totalItems={meta.total}
        itemsPerPage={state.limit}
        onPageChange={actions.setPage}
        onItemsPerPageChange={actions.setLimit}
      />
    </div>
  )
}

export default function ManageUsersPage() {
  return (
    <Suspense fallback={null}>
      <UsersPageContent />
    </Suspense>
  )
}
