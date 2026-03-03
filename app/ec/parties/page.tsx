'use client'

import { ConfirmDialog } from '@/components/shared/confirm-dialog'
import { ImagePreviewDialog } from '@/components/shared/image-preview-dialog'
import { useDeletePartyMutation, useParties } from '@/hooks/use-parties'
import { type Party } from '@/types/party'
import { motion } from 'framer-motion'
import { useState } from 'react'

// Extracted Components
import { PartyHeader } from '@/components/ec/parties/party-header'
import { PartyMobileList } from '@/components/ec/parties/party-mobile-list'
import { PartyTable } from '@/components/ec/parties/party-table'

export default function ManagePartiesPage() {
  const { data: parties, isLoading } = useParties()
  const deleteParty = useDeletePartyMutation()

  const [isOpen, setIsOpen] = useState(false)
  const [editParty, setEditParty] = useState<Party | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)

  const handleEdit = (party: Party) => {
    setEditParty(party)
    setIsOpen(true)
  }

  const handleDelete = async () => {
    if (deleteTarget === null) return
    try {
      await deleteParty.mutateAsync(deleteTarget)
      setDeleteTarget(null)
    } catch {
      // Error handled in hook
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='space-y-8 p-1'
    >
      <PartyHeader
        isOpen={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) setEditParty(null)
        }}
        editParty={editParty}
      />

      <PartyTable
        parties={parties}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={setDeleteTarget}
        onPreview={setPreviewUrl}
      />

      <PartyMobileList
        parties={parties}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={setDeleteTarget}
      />

      <ImagePreviewDialog
        url={previewUrl}
        onClose={() => setPreviewUrl(null)}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title='ยืนยันลบพรรคการเมือง'
        description='คุณต้องการลบพรรคการเมืองนี้ใช่หรือไม่? การดำเนินการนี้ไม่สามารถย้อนกลับได้'
        confirmLabel='ลบพรรค'
        onConfirm={handleDelete}
        isPending={deleteParty.isPending}
      />
    </motion.div>
  )
}
