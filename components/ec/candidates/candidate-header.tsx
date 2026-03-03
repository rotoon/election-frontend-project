'use client'

import { Button } from '@/components/ui/button'
import { CandidateItem } from '@/types/candidate'
import { Plus } from 'lucide-react'
import dynamic from 'next/dynamic'

const CandidateFormDialog = dynamic(
  () =>
    import('@/components/ec/candidates/candidate-form-dialog').then(
      (m) => m.CandidateFormDialog,
    ),
  { ssr: false },
)

interface CandidateHeaderProps {
  total: number
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  editCandidate: CandidateItem | null
  setEditCandidate: (candidate: CandidateItem | null) => void
}

export function CandidateHeader({
  total,
  isOpen,
  setIsOpen,
  editCandidate,
  setEditCandidate,
}: CandidateHeaderProps) {
  return (
    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent'>
          จัดการผู้สมัคร
        </h2>
        <p className='text-muted-foreground mt-1'>
          เพิ่ม แก้ไข ลบผู้สมัครรับเลือกตั้ง จำนวน{' '}
          <span className='font-semibold text-slate-700'>{total}</span> รายการ
        </p>
      </div>

      <CandidateFormDialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) setEditCandidate(null)
        }}
        editCandidate={editCandidate}
      />

      <Button
        onClick={() => setIsOpen(true)}
        className='shadow-lg hover:shadow-xl transition-[box-shadow,colors] duration-300 gap-2 bg-blue-600 hover:bg-blue-700'
      >
        <Plus className='h-4 w-4' />
        <span>เพิ่มผู้สมัคร</span>
      </Button>
    </div>
  )
}
