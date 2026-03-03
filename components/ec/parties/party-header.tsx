'use client'

import { PartyFormDialog } from '@/components/ec/parties/party-form-dialog'
import { Party } from '@/types/party'

interface PartyHeaderProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  editParty: Party | null
}

export function PartyHeader({
  isOpen,
  onOpenChange,
  editParty,
}: PartyHeaderProps) {
  return (
    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6'>
      <div>
        <h2 className='text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent'>
          จัดการพรรคการเมือง
        </h2>
        <p className='text-muted-foreground mt-1'>
          บริหารจัดการข้อมูลพรรคการเมือง นโยบาย และสัญลักษณ์
        </p>
      </div>
      <PartyFormDialog
        open={isOpen}
        onOpenChange={onOpenChange}
        editParty={editParty}
      />
    </div>
  )
}
