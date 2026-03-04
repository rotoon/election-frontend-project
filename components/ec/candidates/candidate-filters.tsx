'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowUpDown, Filter, Search } from 'lucide-react'

interface CandidateFiltersProps {
  searchInput: string
  setSearchInput: (value: string) => void
  filterParty: string
  parties: any[] | undefined
  filterProvince: string
  provinces: any[] | undefined
  filterConstituency: string
  constituencies: any[] | undefined
  sortBy: string
  order: string
  actions: any
}

export function CandidateFilters({
  searchInput,
  setSearchInput,
  filterParty,
  parties,
  filterProvince,
  provinces,
  filterConstituency,
  constituencies,
  sortBy,
  order,
  actions,
}: CandidateFiltersProps) {
  return (
    <div className='flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border shadow-sm'>
      <div className='relative flex-1 min-w-[200px]'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400' />
        <Input
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder='ค้นหาชื่อ, นามสกุล, จังหวัด, เบอร์...'
          className='pl-10 bg-slate-50/50 focus:bg-white transition-colors'
        />
      </div>

      {/* Party Filter */}
      <div className='flex items-center gap-2 w-full sm:w-auto'>
        <Filter className='h-4 w-4 text-slate-400 hidden sm:block' />
        <Select
          value={filterParty}
          onValueChange={(v) => actions.setFilter('party', v)}
        >
          <SelectTrigger className='w-full sm:w-[180px]'>
            <SelectValue placeholder='เลือกพรรค' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>ทุกพรรค</SelectItem>
            {parties?.map((p) => (
              <SelectItem
                key={p.id}
                value={p.id.toString()}
              >
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Province Filter */}
      <div className='flex items-center gap-2 w-full sm:w-auto'>
        <Select
          value={filterProvince}
          onValueChange={(v) => {
            actions.setFilters({
              province: v,
              constituency: 'all',
            })
          }}
        >
          <SelectTrigger className='w-full sm:w-[180px]'>
            <SelectValue placeholder='เลือกจังหวัด' />
          </SelectTrigger>
          <SelectContent className='max-h-[250px]'>
            <SelectItem value='all'>ทุกจังหวัด</SelectItem>
            {provinces?.map((pv) => (
              <SelectItem
                key={pv.id}
                value={pv.id.toString()}
              >
                {pv.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Constituency Filter */}
      {filterProvince !== 'all' && (
        <div className='flex items-center gap-2 w-full sm:w-auto'>
          <Select
            value={filterConstituency}
            onValueChange={(v) => actions.setFilter('constituency', v)}
          >
            <SelectTrigger className='w-full sm:w-[160px]'>
              <SelectValue placeholder='เลือกเขต' />
            </SelectTrigger>
            <SelectContent className='max-h-[250px]'>
              <SelectItem value='all'>ทุกเขต</SelectItem>
              {constituencies
                ?.filter((c) => c.provinceId.toString() === filterProvince)
                .map((c) => (
                  <SelectItem
                    key={c.id}
                    value={c.id.toString()}
                  >
                    เขต {c.zone_number}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Sort */}
      <div className='flex items-center gap-2 w-full sm:w-auto'>
        <span className='text-sm text-muted-foreground whitespace-nowrap hidden sm:inline'>
          เรียงตาม:
        </span>
        <Select
          value={sortBy}
          onValueChange={(v) => actions.setFilter('sortBy', v)}
        >
          <SelectTrigger className='w-full sm:w-[140px] flex-1'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='number'>เบอร์</SelectItem>
            <SelectItem value='firstName'>ชื่อ</SelectItem>
            <SelectItem value='lastName'>นามสกุล</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant='outline'
          size='icon'
          onClick={() =>
            actions.setFilter('order', order === 'asc' ? 'desc' : 'asc')
          }
          className='shrink-0'
          title={order === 'asc' ? 'น้อย → มาก' : 'มาก → น้อย'}
        >
          <ArrowUpDown className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
