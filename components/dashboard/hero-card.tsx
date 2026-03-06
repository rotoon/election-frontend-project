'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { User } from 'lucide-react'
import Image from 'next/image'

interface HeroParty {
  id: number
  name: string
  leader?: string
  seats: number
  color?: string
  logoUrl: string
  [key: string]: string | number | undefined
}

export function HeroCard({ party, rank }: { party: HeroParty; rank: number }) {
  // Staggered delay based on rank: 1st place (0s), 2nd place (0.2s), 3rd place (0.4s)
  const delay = rank === 1 ? 0 : rank === 2 ? 0.2 : 0.4
  // Horizontal offset to "flow out" from center: Rank 2 (Left) starts Right, Rank 3 (Right) starts Left
  const xOffset = rank === 2 ? 50 : rank === 3 ? -50 : 0

  const containerVariants = {
    initial: { opacity: 0, y: 30, x: xOffset, scale: 0.95 },
    animate: {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      transition: {
        default: { duration: 0.6, delay, ease: 'easeOut' as any },
      },
    },
    hover: {
      y: -12,
      scale: 1.02,
      transition: { type: 'spring' as any, stiffness: 400, damping: 25 },
    },
  }

  const floatingVariants = {
    animate: {
      y: [0, -8, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut' as any,
        delay: delay + 1,
      },
    },
  }

  const logoVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: { type: 'spring' as any, stiffness: 300, damping: 20 },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial='initial'
      animate='animate'
      whileHover='hover'
      className='rounded-2xl relative cursor-pointer group'
    >
      <motion.div
        variants={rank <= 3 ? floatingVariants : {}}
        animate='animate'
        className='bg-[#1e1e1e] rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex flex-col h-full relative'
      >
        {/* Top Banner */}
        <div
          className='h-12 bg-white/5 flex items-center justify-between px-4 border-b border-white/5 transition-colors group-hover:bg-white/10'
          style={{ borderTop: `4px solid ${party.color || '#c5a059'}` }}
        >
          <div className='flex items-center justify-center w-full space-x-2'>
            <span
              className={cn(
                'font-black text-lg',
                rank === 1 ? 'text-[#c5a059]' : 'text-white/40',
              )}
            >
              {rank}.
            </span>
            <span className='text-lg font-bold text-white truncate max-w-[80%]'>
              {party.name}
            </span>
          </div>
        </div>

        {/* Candidate Image Placeholder */}
        <div className='flex-1 relative bg-gradient-to-t from-black/90 via-black/40 to-black/10 flex flex-col justify-end aspect-[5/4] overflow-hidden'>
          <motion.div
            className='absolute inset-0 opacity-20'
            style={{ backgroundColor: party.color || '#c5a059' }}
            aria-hidden='true'
            variants={{
              initial: { opacity: 0.2 },
              hover: { opacity: 0.3 },
            }}
          />

          <div className='absolute inset-0 flex items-center justify-center z-0'>
            {party.logoUrl ? (
              <motion.div
                className='relative w-full h-full will-change-transform'
                variants={logoVariants}
              >
                <Image
                  src={party.logoUrl}
                  alt={party.name}
                  fill
                  className='object-cover'
                  unoptimized
                />
              </motion.div>
            ) : (
              <User className='w-32 h-32 text-white/10' aria-hidden='true' />
            )}
          </div>
        </div>

        {/* Seat Count */}
        <div className='bg-[#fdf3e7] p-5 text-center flex flex-col items-center justify-center relative overflow-hidden transition-colors -mt-px'>
          <motion.div
            className='absolute top-0 right-0 w-24 h-24 bg-black/[0.03] rounded-bl-[100px] -mr-8 -mt-8'
            aria-hidden='true'
            variants={{
              initial: { scale: 1, rotate: 0 },
              hover: { scale: 1.2, rotate: 15 },
            }}
          />
          <span className='text-[11px] font-bold text-[#1a110a]/50 uppercase tracking-widest mb-1 relative z-10'>
            สส.เขต
          </span>
          <motion.span
            variants={{
              initial: { scale: 1 },
              hover: { scale: 1.05 },
            }}
            className='text-6xl font-black text-[#1a110a] leading-none tracking-tighter relative z-10'
          >
            {party.seats}
          </motion.span>
        </div>

        {/* Gloss Effect on Hover */}
        <div className='absolute inset-0 pointer-events-none bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full' />
      </motion.div>
    </motion.div>
  )
}
