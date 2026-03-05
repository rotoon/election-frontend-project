'use client'

import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { PaginationBar } from '@/components/shared/pagination-bar'
import {
  useCloseAllPollsMutation,
  useManageConstituencies,
  useOpenAllPollsMutation,
  useTogglePollMutation,
} from '@/hooks/use-constituencies'
import { useProvinces } from '@/hooks/use-location'
import { useURLPagination } from '@/hooks/use-url-pagination'
import { Suspense, useState } from 'react'

// Extracted Components
import { ControlFilters } from '@/components/ec/control/control-filters'
import { ControlHeader } from '@/components/ec/control/control-header'
import { ControlMobileList } from '@/components/ec/control/control-mobile-list'
import { ControlTable } from '@/components/ec/control/control-table'

export default function ElectionControlPage() {
  return (
    <Suspense fallback={<ControlPageSkeleton />}>
      <ControlPageContent />
    </Suspense>
  )
}

function ControlPageSkeleton() {
  return (
    <div className='space-y-8 animate-in fade-in duration-500'>
      <div className='flex justify-between items-center'>
        <div className='h-10 w-64 bg-slate-200 rounded-lg animate-pulse' />
        <div className='flex space-x-3'>
          <div className='h-11 w-32 bg-slate-200 rounded-xl animate-pulse' />
          <div className='h-11 w-32 bg-slate-200 rounded-xl animate-pulse' />
        </div>
      </div>
      <div className='bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-slate-200/60'>
        <div className='h-12 w-full bg-slate-100 rounded-xl animate-pulse' />
      </div>
      <div className='border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm'>
        <div className='h-14 bg-slate-50 border-b border-slate-200/60' />
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className='h-16 border-b border-slate-100 last:border-0 bg-white'
          />
        ))}
      </div>
    </div>
  )
}

function ControlPageContent() {
  const { state, actions } = useURLPagination({
    filterKeys: ['provinceId'],
  })

  const filterProvinceId = state.filters.provinceId || 'all'

  // Hooks
  const { data, isLoading, refetch } = useManageConstituencies({
    provinceId: filterProvinceId === 'all' ? null : filterProvinceId,
    page: state.page,
    limit: state.limit,
  })

  const { data: provinces } = useProvinces()

  const togglePollMutation = useTogglePollMutation()
  const openAllMutation = useOpenAllPollsMutation()
  const closeAllMutation = useCloseAllPollsMutation()

  const constituencies = data?.constituencies || []
  const meta = data?.meta || {
    total: 0,
    page: 1,
    limit: state.limit,
    totalPages: 1,
  }

  const [confirmToggleAll, setConfirmToggleAll] = useState<boolean | null>(null)

  async function togglePoll(id: number) {
    togglePollMutation.mutate(id)
  }

  async function toggleAll(open: boolean) {
    if (open) {
      await openAllMutation.mutateAsync()
    } else {
      await closeAllMutation.mutateAsync()
    }
  }

  return (
    <div className='space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-2 duration-700'>
      <ControlHeader
        onToggleAll={(open) => setConfirmToggleAll(open)}
        isPending={openAllMutation.isPending || closeAllMutation.isPending}
      />

      <ControlFilters
        provinceId={filterProvinceId}
        provinces={provinces}
        totalCount={meta.total}
        isLoading={isLoading}
        onProvinceChange={(v) => actions.setFilter('provinceId', v)}
        onRefresh={() => refetch()}
      />

      <ControlTable
        constituencies={constituencies}
        isLoading={isLoading}
        onToggle={togglePoll}
        isToggling={togglePollMutation.isPending}
      />

      <ControlMobileList
        constituencies={constituencies}
        isLoading={isLoading}
        onToggle={togglePoll}
        isToggling={togglePollMutation.isPending}
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
        open={confirmToggleAll !== null}
        onOpenChange={(open: boolean) => !open && setConfirmToggleAll(null)}
        title={
          confirmToggleAll ? 'เปิดหีบเลือกตั้งทุกเขต' : 'ปิดหีบเลือกตั้งทุกเขต'
        }
        description={`คุณต้องการที่จะ${confirmToggleAll ? 'เปิด' : 'ปิด'}หีบเลือกตั้ง "ทุกเขต" ใช่หรือไม่?`}
        confirmLabel='ยืนยัน'
        variant={confirmToggleAll ? 'default' : 'destructive'}
        onConfirm={async () => {
          if (confirmToggleAll !== null) await toggleAll(confirmToggleAll)
        }}
        isPending={openAllMutation.isPending || closeAllMutation.isPending}
      />
    </div>
  )
}
