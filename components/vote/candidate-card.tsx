import { Candidate } from '@/types/candidate'
import { CheckCircle2, User } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface CandidateCardProps {
  candidate: Candidate
  isSelected: boolean
  isDisabled: boolean
  onSelect: () => void
}

export function CandidateCard({
  candidate,
  isSelected,
  isDisabled,
  onSelect,
}: CandidateCardProps) {
  const partyColor = candidate.party?.color || 'var(--primary)'
  const partyName = candidate.party?.name || 'ผู้สมัครอิสระ'
  const partyLogo = candidate.party?.logo_url

  return (
    <button
      type='button'
      className={`group relative flex flex-col rounded-xl overflow-hidden text-left transition-[transform,box-shadow,opacity,filter] duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-transform touch-manipulation
        ${isDisabled ? 'opacity-60 grayscale cursor-not-allowed' : 'cursor-pointer hover:-translate-y-2 hover:shadow-2xl active:scale-[0.98]'}
        ${isSelected ? 'shadow-[0_20px_40px_rgba(0,0,0,0.12)] ring-4 ring-offset-4 ring-offset-white ring-[color:var(--party-color)]' : 'shadow-[0_8px_24px_rgba(0,0,0,0.06)] border border-white/50'}
        bg-white/90 backdrop-blur-3xl w-full
        focus-visible:ring-4 focus-visible:ring-offset-2 focus-visible:ring-primary/60 focus-visible:outline-none
      `}
      style={
        {
          '--party-color': partyColor,
        } as React.CSSProperties
      }
      onClick={!isDisabled ? onSelect : undefined}
      disabled={isDisabled}
      aria-label={`เลือก ${candidate.full_name || 'ผู้สมัคร'} เบอร์ ${candidate.candidate_number}${isSelected ? ' (เลือกอยู่)' : ''}`}
      aria-pressed={isSelected}
    >
      {/* Hero Image Section */}
      <div className='relative aspect-[4/3] overflow-hidden bg-slate-100 w-full'>
        {candidate.image_url ? (
          <Image
            src={candidate.image_url}
            alt={`รูปผู้สมัคร ${candidate.full_name || ''}`}
            width={400}
            height={300}
            className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-105'
            unoptimized={candidate.image_url.startsWith('http')}
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center bg-slate-100 text-slate-300'>
            <User className='w-20 h-20' aria-hidden='true' />
          </div>
        )}

        {/* Gradient Overlay */}
        <div
          className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent'
          aria-hidden='true'
        />

        {/* Top-Right Number Badge */}
        <div
          className='absolute top-0 right-0 px-4 py-2 rounded-bl-2xl font-bold text-2xl text-white shadow-lg z-10 font-variant-numeric-tabular'
          style={{ backgroundColor: partyColor }}
          aria-hidden='true'
        >
          เบอร์ {candidate.candidate_number}
        </div>

        {/* Bottom Content (Inside Image) */}
        <div className='absolute bottom-0 left-0 right-0 p-4 text-white z-10'>
          <h3 className='text-xl font-bold leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] line-clamp-2 text-pretty'>
            {candidate.full_name}
          </h3>
        </div>

        {/* Selection Checkmark */}
        {isSelected && (
          <div
            className='absolute top-0 left-0 bg-primary/90 text-white px-4 py-2 text-xl rounded-br-xl shadow-sm animate-in zoom-in spin-in-180 duration-300'
            aria-hidden='true'
          >
            <CheckCircle2
              className='w-6 h-6'
              strokeWidth={3}
              aria-hidden='true'
            />
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className='p-4 flex-1 flex flex-col space-y-3 w-full'>
        {/* Party Info */}
        <div className='flex items-center space-x-4'>
          <div className='w-16 h-16 rounded-[18px] bg-white shadow-sm flex items-center justify-center overflow-hidden shrink-0 border'>
            {partyLogo ? (
              <Image
                src={partyLogo}
                alt={`โลโก้พรรค${partyName}`}
                width={64}
                height={64}
                className='w-full h-full object-cover'
                unoptimized
              />
            ) : (
              <div
                className='w-full h-full rounded-[14px]'
                style={{ backgroundColor: partyColor, opacity: 0.2 }}
                aria-hidden='true'
              />
            )}
          </div>
          <div className='min-w-0'>
            <p className='text-xs uppercase tracking-widest mb-1 text-muted-foreground'>
              สังกัดพรรค
            </p>
            <p
              className='text-xl font-bold truncate transition-colors'
              style={{ color: partyColor }}
            >
              {partyName}
            </p>
          </div>
        </div>

        {/* Policy */}
        {candidate.party?.policy ? (
          <div className='pt-2 mt-auto'>
            <div className='bg-slate-50 p-3 rounded-lg border'>
              <p className='text-sm font-medium italic line-clamp-2 leading-relaxed text-slate-700'>
                &quot;{candidate.party.policy}&quot;
              </p>
            </div>
          </div>
        ) : (
          <div className='pt-2 mt-auto' aria-hidden='true'>
            <div className='p-3' />
          </div>
        )}
      </div>
    </button>
  )
}
