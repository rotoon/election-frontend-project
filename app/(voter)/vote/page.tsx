'use client'

import { Button } from '@/components/ui/button'
import { CandidateCard } from '@/components/vote/candidate-card'
import { VoteConfirmationDialog } from '@/components/vote/vote-confirmation-dialog'
import { VoteHeader } from '@/components/vote/vote-header'
import { VoteSkeletonList } from '@/components/vote/vote-skeleton'
import { useCandidates } from '@/hooks/use-candidates'
import { useConstituencyStatus } from '@/hooks/use-constituencies'
import { useMyVote, useVoteMutation } from '@/hooks/use-vote'
import { useAuthStore } from '@/store/useAuthStore'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { startTransition, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export default function VotePage() {
  const { user, isAuthenticated } = useAuthStore()
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(
    null,
  )
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  // Queries
  const constituencyId = user?.constituency?.id

  const { data: constituency, isLoading: loadingConst } =
    useConstituencyStatus(constituencyId)
  const { data: candidates, isLoading: loadingCand } = useCandidates(
    constituencyId?.toString(),
  )
  const { data: currentVote, isLoading: loadingVote } = useMyVote(user?.id)

  // Mutation
  const voteMutation = useVoteMutation()

  // Derived state
  const pollOpen = constituency?.is_poll_open
  const isLoading = loadingConst || loadingCand || loadingVote
  const canSubmit = pollOpen && selectedCandidate && !voteMutation.isPending

  // Vote button text
  const getButtonText = () => {
    if (voteMutation.isPending) return 'กำลังบันทึก…'
    return currentVote ? 'เปลี่ยนคะแนนโหวต' : 'ยืนยันการลงคะแนน'
  }

  // Handlers
  const handleVote = () => {
    if (!pollOpen) return toast.error('หีบเลือกตั้งปิดแล้ว ไม่สามารถลงคะแนนได้')
    if (!selectedCandidate) return toast.error('กรุณาเลือกผู้สมัคร')
    if (!constituencyId || !user?.id) return

    setIsConfirmOpen(true)
  }

  const confirmVote = () => {
    if (!selectedCandidate || !constituencyId || !user?.id) return

    voteMutation.mutate(
      {
        userId: user.id,
        candidateId: selectedCandidate,
        constituencyId: constituencyId,
        isUpdate: !!currentVote,
      },
      {
        onSuccess: () => {
          setIsConfirmOpen(false)
        },
      },
    )
  }

  const handleSelectCandidate = (candidateId: number) => {
    if (pollOpen) setSelectedCandidate(candidateId)
  }

  const initialized = useRef(false)
  const currentCandidateId = currentVote?.candidate_id
  useEffect(() => {
    if (currentCandidateId && !initialized.current) {
      initialized.current = true
      startTransition(() => {
        setSelectedCandidate(currentCandidateId)
      })
    }
  }, [currentCandidateId])
  if (isLoading) {
    return <VoteSkeletonList />
  }

  // Render: Not authenticated
  if (!isAuthenticated || !user) {
    return (
      <div className='text-center py-20'>
        <h1 className='text-2xl  mb-4'>กรุณาเข้าสู่ระบบเพื่อใช้สิทธิ</h1>
        <Button asChild>
          <Link href='/auth'>เข้าสู่ระบบ</Link>
        </Button>
      </div>
    )
  }

  // Find voted candidate info
  const votedCandidate = candidates?.find(
    (c) => c.id === currentVote?.candidate_id,
  )

  return (
    <div className='space-y-6 md:space-y-8 pb-20 md:pb-0'>
      {/* Header */}
      {/* Header - Enriched District Info */}
      {isAuthenticated && <VoteHeader user={user} pollOpen={pollOpen} />}

      {/* Vote confirmation info */}
      {currentVote && votedCandidate && (
        <div className='bg-primary/10 border border-primary/20 p-4 rounded-lg flex items-start md:items-center text-primary animate-in fade-in slide-in-from-top-4 duration-500'>
          <CheckCircle2
            className='w-5 h-5 mr-3 flex-shrink-0 mt-0.5 md:mt-0'
            aria-hidden='true'
          />
          <span className='text-sm md:text-base'>
            คุณได้ลงคะแนนให้{' '}
            <strong className='font-bold underline decoration-primary/30 underline-offset-4'>
              หมายเลข {votedCandidate.candidate_number}
            </strong>{' '}
            แล้ว
            {pollOpen && ' (สามารถเปลี่ยนได้)'}
          </span>
        </div>
      )}

      {/* Candidates Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
        {candidates?.map((candidate) => (
          <CandidateCard
            key={candidate.id}
            candidate={candidate}
            isSelected={selectedCandidate === candidate.id}
            isDisabled={!pollOpen}
            onSelect={() => handleSelectCandidate(candidate.id)}
          />
        ))}
      </div>

      {/* Mobile Action Footer */}
      <div className='fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-200 p-4 pb-6 flex justify-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden z-30 safe-area-bottom'>
        <Button
          size='lg'
          className='w-full max-w-sm text-lg shadow-xl h-14 rounded-2xl font-bold'
          onClick={handleVote}
          disabled={!canSubmit}
        >
          {getButtonText()}
        </Button>
      </div>

      {/* Desktop Action Button */}
      <div className='hidden md:flex justify-end pb-10'>
        <Button
          size='lg'
          className='text-lg px-12 py-6 shadow-xl h-16 rounded-2xl font-bold transition-[transform,box-shadow] hover:scale-105 active:scale-95'
          onClick={handleVote}
          disabled={!canSubmit}
        >
          {getButtonText()}
        </Button>
      </div>

      {/* Confirmation Dialog */}
      <VoteConfirmationDialog
        isOpen={isConfirmOpen}
        onOpenChange={setIsConfirmOpen}
        selectedCandidate={selectedCandidate}
        candidates={candidates}
        isPending={voteMutation.isPending}
        onConfirm={confirmVote}
      />
    </div>
  )
}
