'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { usePartyStats } from '@/hooks/use-parties'
import type { PartyStats } from '@/types/party'
import { Info, Users } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

export default function PartiesPage() {
  const { data: parties, isLoading } = usePartyStats()
  const [selectedParty, setSelectedParty] = useState<PartyStats | null>(null)

  if (isLoading) {
    return (
      <div className='space-y-8'>
        <div className='text-center'>
          <div className='h-9 w-56 bg-slate-200 rounded animate-pulse mx-auto' />
          <div className='h-5 w-80 bg-slate-100 rounded animate-pulse mx-auto mt-3' />
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className='bg-white rounded-lg border p-6 space-y-4'>
              <div className='flex justify-between items-center'>
                <div className='h-6 w-32 bg-slate-200 rounded animate-pulse' />
                <div className='h-8 w-8 bg-slate-100 rounded animate-pulse' />
              </div>
              <div className='h-10 w-16 bg-slate-200 rounded animate-pulse' />
              <div className='h-2 w-full bg-slate-100 rounded-full animate-pulse' />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-8'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-slate-900'>
          ข้อมูลพรรคการเมือง
        </h1>
        <p className='text-slate-500 mt-2'>
          และจำนวนผู้ได้รับการเลือกตั้ง (อย่างไม่เป็นทางการ)
        </p>
      </div>

      <Dialog
        open={!!selectedParty}
        onOpenChange={(open) => !open && setSelectedParty(null)}
      >
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <div className='flex items-center space-x-4 mb-4'>
              {selectedParty?.logo_url ? (
                <Image
                  src={selectedParty.logo_url}
                  alt={selectedParty.name}
                  width={64}
                  height={64}
                  unoptimized
                  className='w-16 h-16 object-contain'
                />
              ) : (
                <div className='w-16 h-16 bg-slate-200 rounded flex items-center justify-center'>
                  <Users className='w-8 h-8 text-slate-400' />
                </div>
              )}
              <div>
                <DialogTitle className='text-2xl'>
                  {selectedParty?.name}
                </DialogTitle>
                <div className='flex items-center mt-2'>
                  <span
                    className='w-4 h-4 rounded-full mr-2 border'
                    style={{
                      backgroundColor: selectedParty?.color || '#ccc',
                    }}
                  />
                  <span className='text-sm text-slate-500'>สีประจำพรรค</span>
                </div>
              </div>
            </div>
            <DialogDescription className='text-base text-slate-700 whitespace-pre-line'>
              <strong>นโยบายพรรค:</strong>
              <br />
              <br />
              {selectedParty?.policy || 'ไม่มีข้อมูลนโยบาย'}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {parties?.map((party) => (
          <Card
            key={party.id}
            className='hover:shadow-lg transition-shadow cursor-pointer group'
            onClick={() => setSelectedParty(party)}
          >
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-lg font-bold truncate pr-2'>
                {party.name}
              </CardTitle>
              {party.logo_url ? (
                <Image
                  src={party.logo_url}
                  alt={party.name}
                  width={32}
                  height={32}
                  unoptimized
                  className='w-8 h-8 object-contain'
                />
              ) : (
                <div className='w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center'>
                  <Users className='w-4 h-4 text-slate-400' />
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className='flex items-baseline space-x-2 mt-2'>
                <span className='text-4xl font-semibold tracking-tighter text-slate-900'>
                  {party.mpCount}
                </span>
                <span className='text-sm text-slate-500 font-medium'>
                  ที่นั่ง (S.S.)
                </span>
              </div>
              <div className='mt-4 flex items-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity'>
                <Info className='w-4 h-4 mr-1' />
                กดเพื่อดูนโยบาย
              </div>
              <div className='mt-4 h-2 w-full bg-slate-100 rounded-full overflow-hidden'>
                <div
                  className='h-full rounded-full'
                  style={{
                    width: '100%',
                    backgroundColor: party.color || '#e2e8f0',
                  }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
