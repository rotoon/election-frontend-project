'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Constituency } from '@/types/constituency'
import { Pencil, ShieldCheck, ShieldEllipsis, Trash2 } from 'lucide-react'

interface ConstituencyMobileListProps {
  constituencies: Constituency[]
  isLoading: boolean
  onEdit: (c: Constituency) => void
  onDelete: (id: number) => void
  onViewCandidates: (c: Constituency) => void
}

export function ConstituencyMobileList({
  constituencies,
  isLoading,
  onEdit,
  onDelete,
  onViewCandidates,
}: ConstituencyMobileListProps) {
  if (isLoading) {
    return (
      <div className='grid gap-6 md:hidden'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className='bg-white p-6 rounded-3xl border border-slate-100 animate-pulse h-40'
          />
        ))}
      </div>
    )
  }

  return (
    <div className='grid gap-6 md:hidden'>
      {constituencies.map((c) => (
        <div
          key={c.id}
          className='bg-white p-6 rounded-[2.5rem] shadow-[0_15px_45px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col gap-6 relative group overflow-hidden'
        >
          <div
            className={`absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full blur-3xl opacity-10 ${c.is_poll_open ? 'bg-green-500' : 'bg-slate-400'}`}
          />
          <div className='flex justify-between items-start relative z-10'>
            <div className='space-y-1'>
              <div className='text-[10px] font-black uppercase tracking-widest text-muted-foreground/60'>
                เขต #{c.id}
              </div>
              <h3 className='font-black text-2xl text-slate-900'>
                {c.province}
              </h3>
            </div>
            {c.is_poll_open ? (
              <Badge className='bg-green-500 text-white shadow-xl shadow-green-100 rounded-2xl h-10 px-4 font-black text-xs'>
                <ShieldCheck className='w-4 h-4 mr-2' /> OPEN
              </Badge>
            ) : (
              <Badge className='bg-slate-200 text-slate-600 rounded-2xl h-10 px-4 font-black text-xs'>
                <ShieldEllipsis className='w-4 h-4 mr-2' /> CLOSED
              </Badge>
            )}
          </div>

          <div className='relative z-10'>
            <div className='text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2'>
              พื้นที่ / เขต
            </div>
            <div className='flex flex-wrap gap-1.5'>
              {c.districts && c.districts.length > 0 ? (
                c.districts.map((district, idx) => (
                  <Badge
                    key={`${c.id}-${idx}`}
                    variant='outline'
                    className='bg-white border-slate-200 text-slate-700 font-bold text-xs px-3 py-1 border-[1px] shadow-sm'
                  >
                    {district}
                  </Badge>
                ))
              ) : (
                <span className='text-slate-300 text-xs'>-</span>
              )}
            </div>
          </div>

          <div className='relative z-10'>
            <div className='text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2'>
              ผู้สมัครในเขตนี้
            </div>
            <button
              type='button'
              onClick={() => onViewCandidates(c)}
              className='flex items-center gap-2 px-4 py-1.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-primary/10 hover:border-primary/20 active:scale-95 transition-all cursor-pointer group/btn'
            >
              <span className='w-2 h-2 rounded-full bg-primary group-hover/btn:bg-primary' />
              <span className='font-black text-slate-700 group-hover/btn:text-primary'>
                {c.candidateCount}
              </span>
              <span className='text-xs font-bold text-slate-400'>คน</span>
              <span className='text-xs text-primary/60 ml-1 group-hover/btn:text-primary'>
                &rsaquo;
              </span>
            </button>
          </div>

          <div className='flex items-center justify-between pt-4 border-t border-slate-50 relative z-10'>
            <p className='font-black text-slate-700 bg-slate-50 px-4 py-2 rounded-2xl'>
              เขตเลือกตั้งที่ {c.zone_number}
            </p>
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='icon'
                className='h-12 w-12 rounded-2xl bg-blue-50 text-blue-600'
                onClick={() => onEdit(c)}
              >
                <Pencil className='w-5 h-5' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='h-12 w-12 rounded-2xl bg-red-50 text-red-600'
                onClick={() => onDelete(c.id)}
              >
                <Trash2 className='w-5 h-5' />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
