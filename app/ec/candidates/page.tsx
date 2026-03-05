'use client'

import { PaginationBar } from '@/components/shared/pagination-bar'
import {
  useDeleteCandidateMutation,
  useManageCandidates,
} from '@/hooks/use-candidates'

import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { ImagePreviewDialog } from '@/components/shared/image-preview-dialog'
import { useConstituencies } from '@/hooks/use-constituencies'
import { useDebounce } from '@/hooks/use-debounce'
import { useProvinces } from '@/hooks/use-location'
import { useParties } from '@/hooks/use-parties'
import { useURLPagination } from '@/hooks/use-url-pagination'
import { CandidateItem } from '@/types/candidate'
import { motion } from 'framer-motion'
import { Suspense, useState } from 'react'

// Extracted Components
import { CandidateFilters } from '@/components/ec/candidates/candidate-filters'
import { CandidateHeader } from '@/components/ec/candidates/candidate-header'
import { CandidateMobileList } from '@/components/ec/candidates/candidate-mobile-list'
import { CandidateTable } from '@/components/ec/candidates/candidate-table'

// Wrapper component with Suspense boundary for useSearchParams
export default function ManageCandidatesPage() {
  return (
    <Suspense fallback={<CandidatesPageSkeleton />}>
      <CandidatesPageContent />
    </Suspense>
  )
}

function CandidatesPageSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div className='h-9 w-40 bg-slate-200 rounded animate-pulse' />
        <div className='h-10 w-48 bg-slate-200 rounded animate-pulse' />
      </div>
      <div className='bg-white p-4 rounded-lg border'>
        <div className='h-10 w-full bg-slate-100 rounded animate-pulse' />
      </div>
      <div className='border rounded-md p-4 space-y-2'>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className='h-12 bg-slate-100 rounded animate-pulse'
          />
        ))}
      </div>
    </div>
  )
}

function CandidatesPageContent() {
  const { state, actions } = useURLPagination({
    filterKeys: [
      'search',
      'sortBy',
      'order',
      'party',
      'province',
      'constituency',
    ],
  })

  // Local search state for debounce
  const [searchInput, setSearchInput] = useState(state.filters.search || '')
  const debouncedSearch = useDebounce(searchInput, 400)

  // Derived filter values
  const sortBy =
    (state.filters.sortBy as
      | 'number'
      | 'firstName'
      | 'lastName'
      | 'updatedAt') || 'updatedAt'
  const order = (state.filters.order as 'asc' | 'desc') || 'desc'
  const filterParty = state.filters.party || 'all'
  const filterProvince = state.filters.province || 'all'
  const filterConstituency = state.filters.constituency || 'all'

  // Form state
  const [editCandidate, setEditCandidate] = useState<CandidateItem | null>(null)

  // Data hooks
  const { data, isLoading } = useManageCandidates({
    page: state.page,
    limit: state.limit,
    search: debouncedSearch || undefined,
    sortBy,
    order,
    partyId: filterParty,
    provinceId: filterProvince,
    constituencyId: filterConstituency,
  })
  const { data: parties } = useParties()
  const { data: provinces } = useProvinces()
  const { data: constituencies } = useConstituencies(filterProvince)

  const candidates = data?.candidates || []
  const meta = data?.meta || {
    total: 0,
    page: 1,
    limit: state.limit,
    totalPages: 1,
  }

  // Mutations
  const deleteMutation = useDeleteCandidateMutation()

  // UI state
  const [isOpen, setIsOpen] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<CandidateItem | null>(null)

  const handleEdit = (c: CandidateItem) => {
    setEditCandidate(c)
    setIsOpen(true)
  }

  const handleDelete = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id)
    }
  }

  const toggleSort = (
    field: 'number' | 'firstName' | 'lastName' | 'updatedAt',
  ) => {
    if (sortBy === field) {
      actions.setFilter('order', order === 'asc' ? 'desc' : 'asc')
    } else {
      actions.setFilters({ sortBy: field, order: 'asc' })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='space-y-8 p-1'
    >
      <CandidateHeader
        total={meta.total}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        editCandidate={editCandidate}
        setEditCandidate={setEditCandidate}
      />

      <CandidateFilters
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        filterParty={filterParty}
        parties={parties}
        filterProvince={filterProvince}
        provinces={provinces}
        filterConstituency={filterConstituency}
        constituencies={constituencies}
        sortBy={sortBy}
        order={order}
        actions={actions}
      />

      <CandidateTable
        candidates={candidates}
        isLoading={isLoading}
        debouncedSearch={debouncedSearch}
        sortBy={sortBy}
        toggleSort={toggleSort}
        setPreviewUrl={setPreviewUrl}
        handleEdit={handleEdit}
        setDeleteTarget={setDeleteTarget}
      />

      <CandidateMobileList
        candidates={candidates}
        isLoading={isLoading}
        debouncedSearch={debouncedSearch}
        setPreviewUrl={setPreviewUrl}
        handleEdit={handleEdit}
        setDeleteTarget={setDeleteTarget}
      />

      {/* Pagination */}
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

      <ImagePreviewDialog
        url={previewUrl}
        onClose={() => setPreviewUrl(null)}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title='ยืนยันลบผู้สมัคร'
        description={
          deleteTarget
            ? `ยืนยันลบผู้สมัคร เบอร์ ${deleteTarget.number} (${deleteTarget.firstName} ${deleteTarget.lastName})?`
            : ''
        }
        confirmLabel='ลบผู้สมัคร'
        onConfirm={handleDelete}
        isPending={deleteMutation.isPending}
      />
    </motion.div>
  )
}
