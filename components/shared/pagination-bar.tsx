'use client'

import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { memo, useCallback } from 'react'

interface PaginationBarProps {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onItemsPerPageChange: (limit: number) => void
  pageSizeOptions?: number[]
}

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100]

const PaginationBarComponent = memo(function PaginationBar({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: PaginationBarProps) {
  const handleItemsPerPageChange = useCallback(
    (val: string) => onItemsPerPageChange(parseInt(val)),
    [onItemsPerPageChange],
  )

  const goToFirstPage = useCallback(() => onPageChange(1), [onPageChange])
  const goToPrevPage = useCallback(
    () => onPageChange(Math.max(1, currentPage - 1)),
    [onPageChange, currentPage],
  )
  const goToNextPage = useCallback(
    () => onPageChange(Math.min(totalPages, currentPage + 1)),
    [onPageChange, totalPages, currentPage],
  )
  const goToLastPage = useCallback(
    () => onPageChange(totalPages),
    [onPageChange, totalPages],
  )
  const handlePageClick = useCallback(
    (page: number) => onPageChange(page),
    [onPageChange],
  )

  return (
    <div className='flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-lg border gap-4'>
      <div className='flex items-center space-x-2'>
        <Select
          value={itemsPerPage.toString()}
          onValueChange={handleItemsPerPageChange}
        >
          <SelectTrigger className='w-[120px]'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size} รายการ
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className='text-sm text-muted-foreground hidden sm:block w-full text-center sm:text-left sm:w-auto'>
          แสดง {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} -{' '}
          {Math.min(currentPage * itemsPerPage, totalItems)} จาก {totalItems}{' '}
          รายการ
        </div>
      </div>

      {totalPages > 1 && (
        <div className='flex flex-wrap items-center justify-center gap-1 sm:space-x-1 sm:gap-0 w-full sm:w-auto'>
          <Button
            variant='outline'
            size='sm'
            onClick={goToFirstPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className='h-4 w-4' />
            <ChevronLeft className='h-4 w-4 -ml-2' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={goToPrevPage}
            disabled={currentPage === 1}
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>

          {/* Page numbers Logic */}
          {(() => {
            const pages: (number | string)[] = []

            if (totalPages <= 7) {
              for (let i = 1; i <= totalPages; i++) pages.push(i)
            } else {
              if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages)
              } else if (currentPage >= totalPages - 3) {
                pages.push(
                  1,
                  '...',
                  totalPages - 4,
                  totalPages - 3,
                  totalPages - 2,
                  totalPages - 1,
                  totalPages,
                )
              } else {
                pages.push(
                  1,
                  '...',
                  currentPage - 1,
                  currentPage,
                  currentPage + 1,
                  '...',
                  totalPages,
                )
              }
            }

            return pages.map((page, idx) =>
              typeof page === 'number' ? (
                <Button
                  key={idx}
                  variant={currentPage === page ? 'default' : 'outline'}
                  size='sm'
                  onClick={() => handlePageClick(page)}
                  className='w-9'
                >
                  {page}
                </Button>
              ) : (
                <span key={idx} className='px-2 text-muted-foreground'>
                  ...
                </span>
              ),
            )
          })()}

          <Button
            variant='outline'
            size='sm'
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={goToLastPage}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className='h-4 w-4' />
            <ChevronRight className='h-4 w-4 -ml-2' />
          </Button>
        </div>
      )}
    </div>
  )
})

export { PaginationBarComponent as PaginationBar }
