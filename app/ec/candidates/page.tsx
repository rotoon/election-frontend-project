'use client'

import { PaginationBar } from '@/components/shared/pagination-bar'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ImageUpload } from '@/components/ui/image-upload'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import {
  useCreateCandidateMutation,
  useDeleteCandidateMutation,
  useManageCandidates,
  useUpdateCandidateMutation,
} from '@/hooks/use-candidates'

import { ImagePreviewDialog } from '@/components/shared/image-preview-dialog'
import { useConstituencies } from '@/hooks/use-constituencies'
import { useProvinces } from '@/hooks/use-location'
import { useParties } from '@/hooks/use-parties'
import { CandidateItem, CreateCandidatePayload } from '@/types/candidate'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowUpDown,
  Edit,
  Filter,
  Plus,
  Search,
  Trash,
  User,
  Users,
} from 'lucide-react'

import { useDebounce } from '@/hooks/use-debounce'
import { useURLPagination } from '@/hooks/use-url-pagination'
import { Suspense, useState } from 'react'
import { toast } from 'sonner'

// Wrapper component with Suspense boundary for useSearchParams
export default function ManageCandidatesPage() {
  return (
    <Suspense fallback={<CandidatesPageSkeleton />}>
      <CandidatesPageContent />
    </Suspense>
  )
}

function CandidatesPageSkeleton() {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div className='h-9 w-40 bg-slate-200 rounded animate-pulse' />
        <div className='h-10 w-48 bg-slate-200 rounded animate-pulse' />
      </div>
      <div className='bg-white p-4 rounded-lg border'>
        <div className='h-10 w-full bg-slate-100 rounded animate-pulse' />
      </div>
      <div className='border rounded-md p-4 space-y-2'>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className='h-12 bg-slate-100 rounded animate-pulse' />
        ))}
      </div>
    </div>
  )
}

function CandidatesPageContent() {
  const { state, actions } = useURLPagination({
    filterKeys: [
      'search',
      'sortBy',
      'order',
      'party',
      'province',
      'constituency',
    ],
  })

  // Local search state for debounce
  const [searchInput, setSearchInput] = useState(state.filters.search || '')
  const debouncedSearch = useDebounce(searchInput, 400)

  // Derived filter values
  const sortBy =
    (state.filters.sortBy as 'number' | 'firstName' | 'lastName') || 'firstName'
  const order = (state.filters.order as 'asc' | 'desc') || 'asc'
  const filterParty = state.filters.party || 'all'
  const filterProvince = state.filters.province || 'all'
  const filterConstituency = state.filters.constituency || 'all'

  // Form state
  const [editId, setEditId] = useState<number | null>(null)
  const [citizenId, setCitizenId] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [number, setNumber] = useState('')
  const [partyId, setPartyId] = useState('')
  const [constituencyId, setConstituencyId] = useState('')
  const [formProvince, setFormProvince] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [candidatePolicy, setCandidatePolicy] = useState('')

  // Data hooks
  const { data, isLoading } = useManageCandidates({
    page: state.page,
    limit: state.limit,
    search: debouncedSearch || undefined,
    sortBy,
    order,
    partyId: filterParty,
    provinceId: filterProvince,
    constituencyId: filterConstituency,
  })
  const { data: parties } = useParties()
  const { data: provinces } = useProvinces()
  const { data: constituencies } = useConstituencies(filterProvince)
  const { data: formConstituencies } = useConstituencies(formProvince)

  const candidates = data?.candidates || []
  const meta = data?.meta || {
    total: 0,
    page: 1,
    limit: state.limit,
    totalPages: 1,
  }

  // Mutations
  const createMutation = useCreateCandidateMutation()
  const updateMutation = useUpdateCandidateMutation()
  const deleteMutation = useDeleteCandidateMutation()

  // Dialog state
  const [isOpen, setIsOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const resetForm = () => {
    setCitizenId('')
    setFirstName('')
    setLastName('')
    setNumber('')
    setPartyId('')
    setConstituencyId('')
    setFormProvince('')
    setImageUrl('')
    setCandidatePolicy('')
    setEditId(null)
    setIsEdit(false)
  }

  const handleEdit = (c: CandidateItem) => {
    setEditId(c.id)
    setCitizenId(c.citizenId || '')
    setFirstName(c.firstName)
    setLastName(c.lastName)
    setNumber(c.number.toString())
    setPartyId(c.partyId.toString())
    setConstituencyId(c.constituencyId.toString())

    // Set province from candidate's constituency if available
    // Note: formConstituencies hook will re-fetch based on this formProvince
    setFormProvince(
      c.constituencyId ? c.constituency?.province?.id?.toString() || '' : '',
    )

    setImageUrl(c.imageUrl || '')
    setCandidatePolicy(c.candidatePolicy || '')
    setIsEdit(true)
    setIsOpen(true)
  }

  async function handleSubmit() {
    if (
      !citizenId ||
      !firstName ||
      !lastName ||
      !number ||
      !partyId ||
      !constituencyId ||
      !imageUrl
    ) {
      toast.error('กรุณากรอกข้อมูลสำคัญให้ครบ')
      return
    }

    if (citizenId.length !== 13) {
      toast.error('เลขบัตรประชาชนต้อง 13 หลัก')
      return
    }

    if (parseInt(number) <= 0) {
      toast.error('เบอร์ผู้สมัครต้องมากกว่า 0')
      return
    }

    if (isEdit && editId) {
      // PATCH
      updateMutation.mutate(
        {
          id: editId,
          payload: {
            citizenId,
            number: parseInt(number),
            firstName,
            lastName,
            candidatePolicy: candidatePolicy || undefined,
            imageUrl,
            partyId: parseInt(partyId),
            constituencyId: parseInt(constituencyId),
          },
        },
        {
          onSuccess: () => {
            setIsOpen(false)
            resetForm()
          },
        },
      )
    } else {
      // POST
      const payload: CreateCandidatePayload = {
        citizenId,
        number: parseInt(number),
        firstName,
        lastName,
        imageUrl,
        partyId: parseInt(partyId),
        constituencyId: parseInt(constituencyId),
      }
      if (candidatePolicy) payload.candidatePolicy = candidatePolicy

      createMutation.mutate(payload, {
        onSuccess: () => {
          setIsOpen(false)
          resetForm()
        },
      })
    }
  }

  const handleDelete = (c: CandidateItem) => {
    if (
      confirm(
        `ยืนยันลบผู้สมัคร เบอร์ ${c.number} (${c.firstName} ${c.lastName})?`,
      )
    ) {
      deleteMutation.mutate(c.id)
    }
  }

  const toggleSort = (field: 'number' | 'firstName' | 'lastName') => {
    if (sortBy === field) {
      actions.setFilter('order', order === 'asc' ? 'desc' : 'asc')
    } else {
      actions.setFilter('sortBy', field)
      actions.setFilter('order', 'asc')
    }
  }

  const isMutating = createMutation.isPending || updateMutation.isPending

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='space-y-8 p-1'
    >
      {/* Header */}
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6'>
        <div>
          <h2 className='text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent'>
            จัดการผู้สมัคร
          </h2>
          <p className='text-muted-foreground mt-1'>
            เพิ่ม แก้ไข ลบผู้สมัครรับเลือกตั้ง จำนวน{' '}
            <span className='font-semibold text-slate-700'>{meta.total}</span>{' '}
            รายการ
          </p>
        </div>

        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            setIsOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className='shadow-lg hover:shadow-xl transition-[box-shadow,colors] duration-300 gap-2 bg-blue-600 hover:bg-blue-700'>
              <Plus className='h-4 w-4' />
              <span>เพิ่มผู้สมัคร</span>
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[600px] overflow-hidden rounded-xl border-none shadow-2xl'>
            <DialogHeader className='bg-slate-50 -mx-6 -mt-6 p-6 border-b'>
              <DialogTitle className='text-xl'>
                {isEdit ? 'แก้ไขผู้สมัคร' : 'เพิ่มผู้สมัครใหม่'}
              </DialogTitle>
              <DialogDescription>
                กำหนดข้อมูลผู้สมัคร สังกัดพรรค และเขตเลือกตั้ง
              </DialogDescription>
            </DialogHeader>
            <div className='grid gap-6 py-6'>
              {/* Row 0: เลขบัตรประชาชน */}
              <div className='space-y-2'>
                <Label htmlFor='citizenId' className='text-sm font-semibold'>
                  เลขบัตรประชาชน 13 หลัก
                </Label>
                <Input
                  id='citizenId'
                  value={citizenId}
                  onChange={(e) =>
                    setCitizenId(e.target.value.replace(/\D/g, '').slice(0, 13))
                  }
                  placeholder='เช่น 1234567890123'
                  maxLength={13}
                  className='bg-slate-50/50 focus:bg-white transition-colors font-mono tracking-widest'
                />
              </div>

              {/* Row 1: ชื่อ-นามสกุล */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='fname' className='text-sm font-semibold'>
                    ชื่อ
                  </Label>
                  <Input
                    id='fname'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder='เช่น สมชาย'
                    className='bg-slate-50/50 focus:bg-white transition-colors'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='lname' className='text-sm font-semibold'>
                    นามสกุล
                  </Label>
                  <Input
                    id='lname'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder='เช่น ใจดี'
                    className='bg-slate-50/50 focus:bg-white transition-colors'
                  />
                </div>
              </div>

              {/* Row 2: จังหวัด, เขต, เบอร์, พรรค */}
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label className='text-sm font-semibold'>จังหวัด</Label>
                  <Select
                    value={formProvince}
                    onValueChange={(v) => {
                      setFormProvince(v)
                      setConstituencyId('') // reset เขตเมื่อเปลี่ยนจังหวัด
                    }}
                  >
                    <SelectTrigger className='bg-slate-50/50 w-full'>
                      <SelectValue placeholder='เลือกจังหวัด' />
                    </SelectTrigger>
                    <SelectContent className='max-h-[250px]'>
                      {provinces?.map((pv) => (
                        <SelectItem key={pv.id} value={pv.id.toString()}>
                          {pv.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='c_id' className='text-sm font-semibold'>
                    เขตเลือกตั้ง
                  </Label>
                  <Select
                    value={constituencyId}
                    onValueChange={setConstituencyId}
                    disabled={!formProvince}
                  >
                    <SelectTrigger className='bg-slate-50/50 w-full'>
                      <SelectValue
                        placeholder={
                          formProvince ? 'เลือกเขต' : 'เลือกจังหวัดก่อน'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className='max-h-[200px]'>
                      {formConstituencies?.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()}>
                          เขต {c.zone_number}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-2'>
                  <Label htmlFor='number' className='text-sm font-semibold'>
                    หมายเลขผู้สมัคร
                  </Label>
                  <Input
                    id='number'
                    type='number'
                    min={1}
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder='เช่น 1'
                    className='bg-slate-50/50 focus:bg-white transition-colors'
                  />
                </div>
                <div className='space-y-2'>
                  <Label htmlFor='party' className='text-sm font-semibold'>
                    พรรคสังกัด
                  </Label>
                  <Select value={partyId} onValueChange={setPartyId}>
                    <SelectTrigger className='bg-slate-50/50 w-full'>
                      <SelectValue placeholder='เลือกพรรค' />
                    </SelectTrigger>
                    <SelectContent>
                      {parties?.map((p) => (
                        <SelectItem key={p.id} value={p.id.toString()}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 3: รูปโปรไฟล์ */}
              <div className='space-y-2'>
                <Label className='text-sm font-semibold'>รูปโปรไฟล์</Label>
                <ImageUpload
                  value={imageUrl}
                  onChange={setImageUrl}
                  folder='candidates'
                  disabled={isMutating}
                  placeholder='คลิกหรือลากรูปผู้สมัครมาวาง'
                />
              </div>

              {/* Row 4: นโยบาย */}
              <div className='space-y-2'>
                <Label htmlFor='policy' className='text-sm font-semibold'>
                  นโยบายส่วนตัว{' '}
                  <span className='text-xs text-muted-foreground font-normal'>
                    (ถ้าไม่ระบุ จะใช้นโยบายของพรรค)
                  </span>
                </Label>
                <Textarea
                  id='policy'
                  value={candidatePolicy}
                  onChange={(e) => setCandidatePolicy(e.target.value)}
                  rows={3}
                  placeholder='ระบุนโยบายส่วนตัวของผู้สมัคร...'
                  className='bg-slate-50/50 focus:bg-white transition-colors'
                />
              </div>
            </div>
            <DialogFooter className='bg-slate-50 -mx-6 -mb-6 p-6 border-t'>
              <Button
                variant='ghost'
                onClick={() => setIsOpen(false)}
                className='mr-auto'
              >
                ยกเลิก
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isMutating}
                className='min-w-[120px] bg-blue-600 hover:bg-blue-700 shadow-md'
              >
                {isMutating
                  ? 'กำลังบันทึก...'
                  : isEdit
                    ? 'บันทึกการแก้ไข'
                    : 'บันทึกข้อมูล'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search & Filter Bar */}
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
                <SelectItem key={p.id} value={p.id.toString()}>
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
              actions.setFilter('province', v)
              actions.setFilter('constituency', 'all')
            }}
          >
            <SelectTrigger className='w-full sm:w-[180px]'>
              <SelectValue placeholder='เลือกจังหวัด' />
            </SelectTrigger>
            <SelectContent className='max-h-[250px]'>
              <SelectItem value='all'>ทุกจังหวัด</SelectItem>
              {provinces?.map((pv) => (
                <SelectItem key={pv.id} value={pv.id.toString()}>
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
                    <SelectItem key={c.id} value={c.id.toString()}>
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

      {/* Table (Desktop Layout) */}
      <Card className='border-none shadow-xl bg-white/50 backdrop-blur-sm overflow-hidden hidden md:block'>
        <CardContent className='p-0'>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader className='bg-slate-50/80'>
                <TableRow className='hover:bg-transparent border-slate-100'>
                  <TableHead
                    className='w-[80px] font-bold text-slate-700 px-6 py-4 cursor-pointer select-none'
                    onClick={() => toggleSort('number')}
                  >
                    <span className='flex items-center gap-1'>
                      เบอร์
                      {sortBy === 'number' && (
                        <ArrowUpDown className='h-3 w-3 text-blue-500' />
                      )}
                    </span>
                  </TableHead>
                  <TableHead className='font-bold text-slate-700 px-6'>
                    รูป
                  </TableHead>
                  <TableHead
                    className='font-bold text-slate-700 px-6 cursor-pointer select-none'
                    onClick={() => toggleSort('firstName')}
                  >
                    <span className='flex items-center gap-1'>
                      ชื่อ-นามสกุล
                      {sortBy === 'firstName' && (
                        <ArrowUpDown className='h-3 w-3 text-blue-500' />
                      )}
                    </span>
                  </TableHead>
                  <TableHead className='font-bold text-slate-700 px-6'>
                    สังกัดพรรค
                  </TableHead>
                  <TableHead className='font-bold text-slate-700 px-6'>
                    เขตเลือกตั้ง
                  </TableHead>
                  <TableHead className='text-right font-bold text-slate-700 px-6'>
                    การจัดการ
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode='wait'>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className='h-40 text-center'>
                        <div className='flex flex-col items-center justify-center space-y-3'>
                          <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
                          <p className='text-slate-500 font-medium'>
                            กำลังโหลดข้อมูล...
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : !candidates || candidates.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className='h-60 text-center'>
                        <div className='flex flex-col items-center justify-center text-slate-400 space-y-4 italic'>
                          <div className='p-4 bg-slate-50 rounded-full'>
                            <Users className='w-12 h-12 text-slate-200' />
                          </div>
                          <div>
                            <p className='text-lg font-semibold text-slate-500'>
                              {debouncedSearch
                                ? 'ไม่พบผู้สมัครตามคำค้นหา'
                                : 'ไม่พบข้อมูลผู้สมัคร'}
                            </p>
                            <p className='text-sm'>
                              {debouncedSearch
                                ? 'ลองเปลี่ยนคำค้นหาใหม่'
                                : 'เริ่มต้นด้วยการเพิ่มผู้สมัครใหม่ที่ปุ่มด้านบน'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    candidates.map((c: CandidateItem, index: number) => (
                      <motion.tr
                        key={c.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className='group hover:bg-slate-50/50 transition-colors border-slate-50'
                      >
                        <TableCell className='px-6 py-4'>
                          <span className='inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-700 font-bold text-lg ring-2 ring-blue-100'>
                            {c.number}
                          </span>
                        </TableCell>
                        <TableCell>
                          {c.imageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={c.imageUrl}
                              alt={`${c.firstName} ${c.lastName}`}
                              className='w-20 h-20 object-cover rounded-lg bg-slate-50 ring-1 ring-slate-100 group-hover:scale-110 transition-transform duration-300 cursor-pointer'
                              onClick={() => setPreviewUrl(c.imageUrl)}
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src =
                                  'https://placehold.co/80x80?text=No+Image'
                              }}
                            />
                          ) : (
                            <div className='w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center'>
                              <User className='w-5 h-5 text-slate-400' />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className='px-6'>
                          <div className='flex flex-col'>
                            <span className='font-bold text-slate-900 group-hover:text-blue-700 transition-colors'>
                              {c.firstName} {c.lastName}
                            </span>
                            {c.candidatePolicy && (
                              <span className='text-xs text-muted-foreground line-clamp-1 mt-0.5'>
                                {c.candidatePolicy}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className='px-6'>
                          <span className='text-slate-700'>
                            {c.party?.name || '-'}
                          </span>
                        </TableCell>
                        <TableCell className='px-6'>
                          <span className='text-slate-600'>
                            {c.constituency
                              ? `${c.constituency.province?.name || '-'} เขต ${c.constituency.number}`
                              : '-'}
                          </span>
                        </TableCell>
                        <TableCell className='px-6 text-right'>
                          <div className='flex justify-end gap-2'>
                            <Button
                              variant='outline'
                              size='icon'
                              className='rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-[box-shadow,colors] active:scale-95'
                              onClick={() => handleEdit(c)}
                            >
                              <Edit className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon'
                              className='rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-[box-shadow,colors] active:scale-95'
                              onClick={() => handleDelete(c)}
                            >
                              <Trash className='h-4 w-4' />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Card Layout */}
      <div className='grid gap-4 md:hidden'>
        <AnimatePresence mode='wait'>
          {isLoading ? (
            <div className='flex flex-col items-center justify-center space-y-3 py-10 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 shadow-sm'>
              <div className='w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin' />
              <p className='text-slate-500 font-medium'>กำลังโหลดข้อมูล...</p>
            </div>
          ) : !candidates || candidates.length === 0 ? (
            <div className='flex flex-col items-center justify-center text-slate-400 space-y-4 italic py-12 bg-white/50 backdrop-blur-sm rounded-xl border border-white/40 shadow-sm'>
              <div className='p-4 bg-slate-50 rounded-full'>
                <Users className='w-12 h-12 text-slate-200' />
              </div>
              <div className='text-center'>
                <p className='text-lg font-semibold text-slate-500'>
                  {debouncedSearch
                    ? 'ไม่พบผู้สมัครตามคำค้นหา'
                    : 'ไม่พบข้อมูลผู้สมัคร'}
                </p>
                <p className='text-sm mt-1'>
                  {debouncedSearch
                    ? 'ลองเปลี่ยนคำค้นหาใหม่'
                    : 'เริ่มต้นด้วยการเพิ่มผู้สมัครใหม่ที่ปุ่มด้านบน'}
                </p>
              </div>
            </div>
          ) : (
            candidates.map((c: CandidateItem, index: number) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.03 }}
                className='bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col gap-4'
              >
                <div className='flex items-start gap-4'>
                  <div className='shrink-0'>
                    {c.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={c.imageUrl}
                        alt={`${c.firstName} ${c.lastName}`}
                        className='w-16 h-16 object-cover rounded-lg bg-slate-50 ring-1 ring-slate-100 cursor-pointer active:scale-95 transition-transform'
                        onClick={() => setPreviewUrl(c.imageUrl)}
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).src =
                            'https://placehold.co/64x64?text=No+Image'
                        }}
                      />
                    ) : (
                      <div className='w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center'>
                        <User className='w-6 h-6 text-slate-400' />
                      </div>
                    )}
                  </div>

                  <div className='flex-1 min-w-0 pt-0.5'>
                    <div className='flex items-center gap-2 mb-1.5'>
                      <span className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-700 font-bold text-xs ring-1 ring-blue-100 shrink-0'>
                        {c.number}
                      </span>
                      <h3 className='font-bold text-slate-900 truncate'>
                        {c.firstName} {c.lastName}
                      </h3>
                    </div>
                    {c.candidatePolicy && (
                      <p className='text-xs text-muted-foreground line-clamp-2 mb-2'>
                        {c.candidatePolicy}
                      </p>
                    )}
                    <div className='flex flex-col gap-1.5 text-xs text-slate-600'>
                      <div className='flex items-center gap-1.5'>
                        <Filter className='w-3.5 h-3.5 text-slate-400 shrink-0' />
                        <span className='truncate'>{c.party?.name || '-'}</span>
                      </div>
                      <div className='flex items-center gap-1.5'>
                        <Users className='w-3.5 h-3.5 text-slate-400 shrink-0' />
                        <span className='truncate'>
                          {c.constituency
                            ? `${c.constituency.province?.name || '-'} เขต ${c.constituency.number}`
                            : '-'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className='flex justify-end gap-2 pt-3 border-t border-slate-50'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'
                    onClick={() => handleEdit(c)}
                  >
                    <Edit className='h-3 w-3 mr-1.5' /> แก้ไข
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='rounded-full text-slate-500 hover:text-red-500 hover:bg-red-50 hover:border-red-200'
                    onClick={() => handleDelete(c)}
                  >
                    <Trash className='h-3 w-3 mr-1.5' /> ลบ
                  </Button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      {/* Pagination */}
      <div className='pb-20'>
        <PaginationBar
          currentPage={state.page}
          totalPages={meta.totalPages}
          totalItems={meta.total}
          itemsPerPage={state.limit}
          onPageChange={actions.setPage}
          onItemsPerPageChange={actions.setLimit}
        />
      </div>

      <ImagePreviewDialog
        url={previewUrl}
        onClose={() => setPreviewUrl(null)}
      />
    </motion.div>
  )
}
