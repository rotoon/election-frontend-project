'use client'

import { Card, CardContent } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useConstituencies } from '@/hooks/use-constituencies'
import { useECStats } from '@/hooks/use-stats'
import { useConstituencyResults } from '@/hooks/use-vote'
import { Lock, TrendingUp, User } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

// Mock data for party list - will be replaced with real API
const mockPartyListData = [
  { name: 'พลังประชาชน', color: '#1e3a8a', votes: 8542120 },
  { name: 'ประชาชน', color: '#f97316', votes: 5234567 },
  { name: 'เพื่อไทย', color: '#dc2626', votes: 4123456 },
  { name: 'ประชาธิปัตย์', color: '#0ea5e9', votes: 2345678 },
  { name: 'ก้าวไกล', color: '#f59e0b', votes: 1823456 },
  { name: 'อื่นๆ', color: '#6b7280', votes: 3456789 },
]

export default function ResultsPage() {
  const { data: statsData, isLoading: loadingStats } = useECStats()
  const { data: constituencies, isLoading: loadingConsts } = useConstituencies()
  const [selectedConstId, setSelectedConstId] = useState<string>('')

  // Auto-select first constituency
  useEffect(() => {
    if (constituencies && constituencies.length > 0 && !selectedConstId) {
      setSelectedConstId(constituencies[0].id.toString())
    }
  }, [constituencies, selectedConstId])

  const { data: resultData, isLoading: loadingResults } =
    useConstituencyResults(selectedConstId)

  const pollOpen = resultData?.pollOpen || false
  const results = resultData?.results || []
  const totalVotes = resultData?.totalVotes || 0

  // Mock data for leaderboard
  const topParties = [
    {
      rank: 1,
      name: 'พลังประชาชน',
      leader: 'อนุทิน ชาญวิริ',
      seats: 193,
      color: '#1e3a8a',
    },
    {
      rank: 2,
      name: 'ประชาชน',
      leader: 'ณัฐพล ร่วมประเสริ',
      seats: 118,
      color: '#f97316',
    },
    {
      rank: 3,
      name: 'เพื่อไทย',
      leader: 'เศรษฐา ทวีสิน',
      seats: 74,
      color: '#dc2626',
    },
  ]

  // Calculate total seats
  const totalSeats = 500
  const seatsSoFar = topParties.reduce((sum, p) => sum + p.seats, 0)
  const otherSeats = totalSeats - seatsSoFar

  if (loadingConsts || loadingStats) {
    return (
      <div className='flex justify-center items-center h-64'>Loading...</div>
    )
  }

  return (
    <div className='space-y-6'>
      {/* Status Bar */}
      <div className='bg-gray-800 text-white text-center py-2'>
        <span className='text-yellow-400 font-bold'>●</span> อัปเดตล่าสุด 23
        ก.พ. 2569 | นับคะแนนแล้ว 94%
      </div>

      {/* Hero Leaderboard */}
      <section className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {topParties.map((party) => (
          <div
            key={party.rank}
            className='bg-white rounded-xl shadow-lg overflow-hidden border-t-4'
            style={{ borderTopColor: party.color }}
          >
            <div
              className='text-white text-center py-2 font-bold'
              style={{ backgroundColor: party.color }}
            >
              อันดับ {party.rank}
            </div>
            <div className='p-6 text-center'>
              <div className='w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center'>
                <User className='w-16 h-16 text-gray-400' />
              </div>
              <h3
                className='text-2xl font-bold mb-1'
                style={{ color: party.color }}
              >
                {party.name}
              </h3>
              <p className='text-gray-500 mb-4'>{party.leader}</p>
              <div
                className='text-5xl font-bold'
                style={{ color: party.color }}
              >
                {party.seats}
              </div>
              <p className='text-gray-500'>ที่นั่ง ส.ส.</p>
            </div>
          </div>
        ))}
      </section>

      {/* Parliament Progress Bar */}
      <section className='bg-white rounded-xl shadow-lg p-6'>
        <h3 className='text-lg font-bold mb-4'>สภาผู้แทนราษฎร (500 ที่นั่ง)</h3>
        <div className='relative'>
          <div className='h-12 rounded-lg overflow-hidden flex'>
            {topParties.map((party) => (
              <div
                key={party.name}
                className='h-full flex items-center justify-center text-white font-bold'
                style={{
                  width: `${(party.seats / totalSeats) * 100}%`,
                  backgroundColor: party.color,
                }}
              >
                {party.seats}
              </div>
            ))}
            <div
              className='h-full flex items-center justify-center text-gray-600 font-bold bg-gray-300'
              style={{ width: `${(otherSeats / totalSeats) * 100}%` }}
            >
              {otherSeats}
            </div>
          </div>
          {/* 250 Line */}
          <div
            className='absolute top-0 bottom-0 border-l-2 border-dashed border-yellow-500'
            style={{ left: '50%' }}
          >
            <span className='absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-yellow-600 whitespace-nowrap'>
              250 ที่นั่ง
            </span>
          </div>
        </div>
        <div className='flex justify-between mt-2 text-sm text-gray-500'>
          <span>0</span>
          <span className='text-yellow-600 font-bold'>คะแนนเสียงข้างมาก</span>
          <span>500</span>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Left Column: Party List Votes */}
        <section className='bg-white rounded-xl shadow-lg p-6'>
          <h3 className='text-lg font-bold mb-4'>ผลคะแนน สส. บัญชีรายชื่อ</h3>
          <div className='text-sm text-gray-500 mb-4'>
            ผู้ใช้สิทธิ์ทั้งหมด:{' '}
            <span className='font-bold text-gray-800'>
              {(statsData?.votedCount || 34565642).toLocaleString()} คน
            </span>
          </div>

          <div className='space-y-4'>
            {mockPartyListData.map((party) => (
              <div key={party.name}>
                <div className='flex justify-between mb-1'>
                  <span className='font-medium' style={{ color: party.color }}>
                    {party.name}
                  </span>
                  <span className='font-bold'>
                    {party.votes.toLocaleString()}
                  </span>
                </div>
                <div className='h-4 bg-gray-100 rounded-full overflow-hidden'>
                  <div
                    className='h-full rounded-full'
                    style={{
                      width: `${(party.votes / 25000000) * 100}%`,
                      backgroundColor: party.color,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right Column: Constituency Results + MP Table */}
        <div className='lg:col-span-2 space-y-6'>
          {/* Constituency Selector */}
          <Card>
            <CardContent className='p-4'>
              <div className='flex flex-col space-y-2'>
                <label className='text-sm font-medium'>
                  เลือกเขตเลือกตั้ง:
                </label>
                <Select
                  value={selectedConstId}
                  onValueChange={setSelectedConstId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='เลือกเขตเลือกตั้ง' />
                  </SelectTrigger>
                  <SelectContent>
                    {constituencies?.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>
                        {c.province} เขต {c.zone_number}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Status Indicator */}
          <div className='flex justify-center'>
            {pollOpen ? (
              <div className='bg-yellow-100 text-yellow-800 px-6 py-3 rounded-full flex items-center shadow-sm'>
                <Lock className='w-5 h-5 mr-2' />
                หีบเลือกตั้งยังเปิดอยู่ - <strong>ไม่แสดงผลคะแนน</strong>
              </div>
            ) : (
              <div className='bg-green-100 text-green-800 px-6 py-3 rounded-full flex items-center shadow-sm'>
                <TrendingUp className='w-5 h-5 mr-2' />
                หีบเลือกตั้งปิดแล้ว -{' '}
                <strong>แสดงผลคะแนน (นับแล้ว {totalVotes} คะแนน)</strong>
              </div>
            )}
          </div>

          {/* Results List */}
          {loadingResults ? (
            <div className='text-center py-10'>กำลังโหลด...</div>
          ) : (
            <div className='space-y-4'>
              {results.length === 0 && (
                <div className='text-center text-slate-500'>
                  ไม่พบข้อมูลผู้สมัครหรือผลคะแนน
                </div>
              )}
              {results.map((item) => (
                <Card
                  key={item.candidate.id}
                  className={`overflow-hidden transition-[max-height,opacity] ${
                    item.rank === 1 && !pollOpen
                      ? 'border-2 border-yellow-400 shadow-xl ring-4 ring-yellow-100'
                      : ''
                  }`}
                >
                  <div className='flex items-center p-4'>
                    {/* Rank */}
                    {!pollOpen && (
                      <div
                        className={`w-12 text-center font-bold text-2xl mr-4 ${
                          item.rank === 1 ? 'text-yellow-600' : 'text-slate-400'
                        }`}
                      >
                        {item.rank}
                      </div>
                    )}

                    {/* Image */}
                    <div className='w-16 h-16 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 mr-4'>
                      {item.candidate.image_url ? (
                        <Image
                          src={item.candidate.image_url}
                          alt={`${item.candidate.first_name}`}
                          width={64}
                          height={64}
                          className='w-full h-full object-cover'
                          unoptimized
                        />
                      ) : (
                        <div className='w-full h-full flex items-center justify-center bg-slate-200 text-slate-400'>
                          <User className='w-8 h-8' />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className='flex-1 min-w-0'>
                      <h3 className='font-bold text-lg truncate'>
                        {item.candidate.first_name} {item.candidate.last_name}
                        <span className='ml-2 text-sm font-normal text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full inline-block align-middle'>
                          เบอร์ {item.candidate.candidate_number}
                        </span>
                      </h3>
                      <div className='flex items-center text-slate-600 text-sm mt-1'>
                        {item.candidate.party?.logo_url && (
                          <Image
                            src={item.candidate.party.logo_url}
                            alt='Party'
                            width={16}
                            height={16}
                            className='w-4 h-4 mr-1'
                            unoptimized
                          />
                        )}
                        {item.candidate.party?.name || 'อิสระ'}
                      </div>
                    </div>

                    {/* Score Bar (if closed) */}
                    {!pollOpen && (
                      <div className='w-32 md:w-40 flex flex-col items-end pl-4 border-l'>
                        <span className='text-2xl font-bold tabular-nums text-slate-900'>
                          {item.voteCount.toLocaleString()}
                        </span>
                        <span className='text-xs text-slate-500'>คะแนน</span>
                        <div className='w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden'>
                          <div
                            className='h-full bg-blue-500 rounded-full'
                            style={{
                              width: `${
                                totalVotes > 0
                                  ? (item.voteCount / totalVotes) * 100
                                  : 0
                              }%`,
                              backgroundColor:
                                item.candidate.party?.color || '#3b82f6',
                            }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
