'use client'

import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { PaginationBar } from '@/components/shared/pagination-bar'
import {
  useAdminConstituencies,
  useCreateConstituencyMutation,
  useDeleteConstituencyMutation,
  useUpdateConstituencyMutation,
} from '@/hooks/use-constituencies'
import { Constituency } from '@/types/constituency'
import { useProvinces } from '@/hooks/use-location'
import { useURLPagination } from '@/hooks/use-url-pagination'
import { Suspense, useState } from 'react'

// Extracted Components
import { CandidateListDialog } from '@/components/admin/constituencies/candidate-list-dialog'
import { ConstituencyEditDialog } from '@/components/admin/constituencies/constituency-edit-dialog'
import { ConstituencyFilters } from '@/components/admin/constituencies/constituency-filters'
import { ConstituencyHeader } from '@/components/admin/constituencies/constituency-header'
import { ConstituencyMobileList } from '@/components/admin/constituencies/constituency-mobile-list'
import { ConstituencyTable } from '@/components/admin/constituencies/constituency-table'
import { toast } from 'sonner'

// --- Main Export ---
export default function ManageConstituenciesPage() {
  return (
    <Suspense fallback={<ConstituencyPageSkeleton />}>
      <ConstituenciesPageContent />
    </Suspense>
  )
}

function ConstituencyPageSkeleton() {
  return (
    <div className='space-y-8 animate-in fade-in duration-500'>
      <div className='flex justify-between items-center'>
        <div className='h-10 w-64 bg-slate-200 rounded-lg animate-pulse' />
        <div className='h-11 w-40 bg-slate-200 rounded-xl animate-pulse' />
      </div>
      <div className='h-20 bg-slate-100 rounded-2xl animate-pulse' />
      <div className='h-96 bg-slate-100 rounded-2xl animate-pulse' />
    </div>
  )
}

function ConstituenciesPageContent() {
  const { state, actions } = useURLPagination({
    filterKeys: ['provinceId'],
  })

  const provinceId = state.filters.provinceId || 'all'

  // Data hooks
  const { data, isLoading, refetch } = useAdminConstituencies({
    provinceId: provinceId === 'all' ? null : provinceId,
    page: state.page,
    limit: state.limit,
  })
  const { data: provinces } = useProvinces()

  const createConstituency = useCreateConstituencyMutation()
  const deleteConstituency = useDeleteConstituencyMutation()
  const updateConstituency = useUpdateConstituencyMutation()

  const constituencies = data?.constituencies || []
  const meta = data?.meta || {
    total: 0,
    page: 1,
    limit: state.limit,
    totalPages: 1,
  }

  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)
  const [editTarget, setEditTarget] = useState<Constituency | null>(null)
  const [viewCandidatesTarget, setViewCandidatesTarget] =
    useState<Constituency | null>(null)

  async function handleCreate(values: {
    province: string
    zoneNumber: number
    districtIds: number[]
  }) {
    await createConstituency.mutateAsync(values)
    refetch()
  }

  async function handleUpdate(values: {
    id: number
    zoneNumber: number
    districtIds: number[]
  }) {
    await updateConstituency.mutateAsync(values)
    refetch()
  }

  async function handleDelete() {
    if (deleteTarget === null) return
    try {
      await deleteConstituency.mutateAsync(deleteTarget)
      refetch()
    } catch {
      toast.error('ลบเขตเลือกตั้งไม่สำเร็จ')
      // Error handled in hook
    }
  }

  return (
    <div className='space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-2 duration-700'>
      <ConstituencyHeader
        provinces={provinces}
        onCreate={handleCreate}
        isCreating={createConstituency.isPending}
      />

      <ConstituencyFilters
        provinceId={provinceId}
        provinces={provinces}
        totalCount={meta.total}
        onProvinceChange={(v) => actions.setFilter('provinceId', v)}
      />

      <ConstituencyTable
        constituencies={constituencies}
        isLoading={isLoading}
        onEdit={(c) => setEditTarget(c)}
        onDelete={(id) => setDeleteTarget(id)}
        onViewCandidates={(c) => setViewCandidatesTarget(c)}
        isDeleting={deleteConstituency.isPending}
      />

      <ConstituencyMobileList
        constituencies={constituencies}
        isLoading={isLoading}
        onEdit={(c) => setEditTarget(c)}
        onDelete={(id) => setDeleteTarget(id)}
        onViewCandidates={(c) => setViewCandidatesTarget(c)}
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

      <ConstituencyEditDialog
        constituency={editTarget}
        open={editTarget !== null}
        onOpenChange={(open) => !open && setEditTarget(null)}
        onUpdate={handleUpdate}
        isUpdating={updateConstituency.isPending}
      />

      <CandidateListDialog
        open={viewCandidatesTarget !== null}
        onOpenChange={(open) => !open && setViewCandidatesTarget(null)}
        constituencyLabel={`${viewCandidatesTarget?.province ?? ''} เขต ${viewCandidatesTarget?.zone_number ?? ''}`}
        candidates={viewCandidatesTarget?.candidates ?? []}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title='ยืนยันลบเขตเลือกตั้ง'
        description='คุณต้องการลบเขตเลือกตั้งนี้ใช่หรือไม่? ข้อมูลผู้สมัครในเขตนี้จะหายไปด้วย และการดำเนินการนี้ไม่สามารถย้อนกลับได้'
        confirmLabel='ลบข้อมูลเขต'
        onConfirm={handleDelete}
        isPending={deleteConstituency.isPending}
        variant='destructive'
      />
    </div>
  )
}
