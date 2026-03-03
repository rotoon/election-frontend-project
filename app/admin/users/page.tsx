'use client'

import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { PaginationBar } from '@/components/shared/pagination-bar'
import { useDebounce } from '@/hooks/use-debounce'
import { useURLPagination } from '@/hooks/use-url-pagination'
import { useManageUsers, useUpdateUserRoleMutation } from '@/hooks/use-users'
import { Suspense, useState } from 'react'

// Extracted Components
import { UserFilters } from '@/components/admin/users/user-filters'
import { UserHeader } from '@/components/admin/users/user-header'
import { UserMobileList } from '@/components/admin/users/user-mobile-list'
import { UserTable } from '@/components/admin/users/user-table'

function getPrimaryRole(roles: string[]): string {
  if (roles.includes('ROLE_ADMIN')) return 'ROLE_ADMIN'
  if (roles.includes('ROLE_EC')) return 'ROLE_EC'
  return 'ROLE_VOTER'
}

function UserPageSkeleton() {
  return (
    <div className='space-y-8 animate-in fade-in duration-500'>
      <div className='flex justify-between items-center'>
        <div className='h-10 w-64 bg-slate-200 rounded-lg animate-pulse' />
        <div className='h-6 w-24 bg-slate-100 rounded-md animate-pulse' />
      </div>
      <div className='h-20 bg-slate-100 rounded-2xl animate-pulse' />
      <div className='h-96 bg-slate-100 rounded-2xl animate-pulse' />
    </div>
  )
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

  const [roleChangeTarget, setRoleChangeTarget] = useState<{
    userId: number
    role: string
  } | null>(null)

  function handleRoleChange(userId: number, newRole: string) {
    setRoleChangeTarget({ userId, role: newRole })
  }

  function confirmRoleChange() {
    if (roleChangeTarget) {
      updateRoleMutation.mutate(roleChangeTarget, {
        onSuccess: () => setRoleChangeTarget(null),
      })
    }
  }

  return (
    <div className='space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-2 duration-700'>
      <UserHeader totalUsers={meta.total} />

      <UserFilters
        searchInput={searchInput}
        onSearchChange={handleSearchChange}
        currentUserCount={users.length}
        currentPage={state.page}
      />

      <UserTable
        users={users}
        isLoading={isLoading}
        page={state.page}
        limit={state.limit}
        onRoleChange={handleRoleChange}
        getPrimaryRole={getPrimaryRole}
      />

      <UserMobileList
        users={users}
        isLoading={isLoading}
        onRoleChange={handleRoleChange}
        getPrimaryRole={getPrimaryRole}
      />

      <div className='pb-20'>
        <PaginationBar
          currentPage={state.page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          itemsPerPage={state.limit}
          onPageChange={actions.setPage}
          onItemsPerPageChange={actions.setLimit}
        />
      </div>

      <ConfirmDialog
        open={!!roleChangeTarget}
        onOpenChange={(open) => !open && setRoleChangeTarget(null)}
        title='ยืนยันการเปลี่ยนแปลงสิทธิ์'
        description={
          roleChangeTarget
            ? `คุณกำลังดำเนินการเปลี่ยนสิทธิ์ผู้ใช้งาน "${
                users.find((u) => u.id === roleChangeTarget.userId)?.firstName
              }" เป็นสิทธิ์ระดับ "${roleChangeTarget.role}" กรุณายืนยันการดำเนินการ`
            : ''
        }
        confirmLabel='ยืนยันและบันทึกสิทธิ์'
        variant='default'
        onConfirm={confirmRoleChange}
        isPending={updateRoleMutation.isPending}
      />
    </div>
  )
}

export default function ManageUsersPage() {
  return (
    <Suspense fallback={<UserPageSkeleton />}>
      <UsersPageContent />
    </Suspense>
  )
}
