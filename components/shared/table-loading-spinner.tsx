'use client'

import { TableCell, TableRow } from '@/components/ui/table'

interface TableLoadingSpinnerProps {
  colSpan: number
  /** Number of skeleton rows to show */
  rows?: number
}

/**
 * Shared skeleton loading rows for table body.
 * Use this inside <TableBody> to show a consistent shimmer skeleton state.
 */
export function TableLoadingSpinner({
  colSpan,
  rows = 5,
}: TableLoadingSpinnerProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <TableRow
          key={i}
          className='border-b border-slate-100 last:border-0 hover:bg-transparent'
        >
          {Array.from({ length: colSpan }).map((__, j) => (
            <TableCell
              key={j}
              className='h-[72px] px-4'
            >
              <div className='h-4 w-full bg-slate-100 rounded animate-pulse' />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}

interface MobileLoadingSkeletonProps {
  /** Number of skeleton cards to show */
  count?: number
  /** Extra class on the wrapper (e.g. gap size) */
  wrapperClassName?: string
  /** Extra class on each card */
  cardClassName?: string
}

/**
 * Shared loading skeleton for mobile card lists.
 * Use this inside the mobile list component to show a consistent pulsing skeleton.
 */
export function MobileLoadingSkeleton({
  count = 3,
  wrapperClassName = 'grid gap-5 md:hidden',
  cardClassName = 'bg-white rounded-2xl border border-slate-100 shadow-sm animate-pulse h-40',
}: MobileLoadingSkeletonProps) {
  return (
    <div className={wrapperClassName}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cardClassName}
        />
      ))}
    </div>
  )
}
