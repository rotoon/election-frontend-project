'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ConstituencyCandidate } from '@/types/constituency'
import { User } from 'lucide-react'
import Image from 'next/image'

interface CandidateListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  constituencyLabel: string
  candidates: ConstituencyCandidate[]
}

export function CandidateListDialog({
  open,
  onOpenChange,
  constituencyLabel,
  candidates,
}: CandidateListDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className='max-w-lg max-h-[80vh] flex flex-col'>
        <DialogHeader>
          <DialogTitle className='text-base font-semibold'>
            ผู้สมัครในเขต{' '}
            <span className='text-primary'>{constituencyLabel}</span>
          </DialogTitle>
          <p className='text-sm text-muted-foreground'>
            {candidates.length} คน
          </p>
        </DialogHeader>

        {candidates.length === 0 ? (
          <div className='flex-1 flex items-center justify-center py-12 text-muted-foreground'>
            ยังไม่มีผู้สมัครในเขตนี้
          </div>
        ) : (
          <div className='flex-1 overflow-y-auto pr-1 -mr-1'>
            <div className='grid grid-cols-1 gap-3 pb-4'>
              {candidates.map((c) => (
                <div
                  key={c.id}
                  className='group relative flex items-center gap-4 p-4 rounded-xl border bg-card hover:border-primary/50 hover:shadow-md transition-all duration-300 cursor-pointer'
                >
                  {/* Candidate Number Badge (Left) */}
                  <div className='shrink-0 w-12 h-12 rounded-lg bg-primary/10 text-primary flex flex-col items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-colors'>
                    <span className='text-[10px] uppercase font-semibold leading-none mb-0.5 opacity-70'>
                      เบอร์
                    </span>
                    <span className='text-lg font-black leading-none'>
                      {c.number}
                    </span>
                  </div>

                  {/* Avatar */}
                  <div className='relative w-12 h-12 rounded-full overflow-hidden bg-muted shrink-0 border-2 border-background shadow-sm'>
                    {c.imageUrl ? (
                      <Image
                        src={c.imageUrl}
                        alt={`${c.firstName} ${c.lastName}`}
                        fill
                        className='object-cover group-hover:scale-110 transition-transform duration-500'
                        unoptimized={c.imageUrl.startsWith('http')}
                      />
                    ) : (
                      <div className='w-full h-full flex items-center justify-center text-muted-foreground'>
                        <User className='w-6 h-6' />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className='flex-1 min-w-0'>
                    <h4 className='text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate'>
                      {c.firstName} {c.lastName}
                    </h4>
                    {c.partyName && (
                      <div className='flex items-center gap-1.5 mt-0.5'>
                        <span className='inline-block w-1.5 h-1.5 rounded-full bg-primary/60' />
                        <p className='text-xs text-muted-foreground font-medium truncate'>
                          พรรค{c.partyName}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
