'use client'

import { useUploadFile } from '@/hooks/use-upload'
import { cn } from '@/lib/utils'
import { ImagePlus, Loader2, Trash2, Upload } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { Button } from './button'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  folder?: string
  disabled?: boolean
  className?: string
  /** ข้อความ placeholder */
  placeholder?: string
}

const ACCEPT_TYPES =
  'image/jpeg,image/png,image/webp,image/gif,image/avif,image/tiff,image/svg+xml'

export function ImageUpload({
  value,
  onChange,
  folder,
  disabled = false,
  className,
  placeholder = 'คลิกหรือลากรูปมาวาง',
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const uploadFile = useUploadFile()

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        return
      }

      uploadFile.mutate(
        { file, folder },
        {
          onSuccess: (data) => {
            onChange(data.url)
          },
        },
      )
    },
    [uploadFile, folder, onChange],
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // reset เพื่อให้เลือกไฟล์เดิมซ้ำได้
    e.target.value = ''
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled && !uploadFile.isPending) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled || uploadFile.isPending) return

    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  const handleRemove = () => {
    onChange('')
  }

  const isLoading = uploadFile.isPending

  // มี preview (upload แล้ว)
  if (value) {
    return (
      <div className={cn('relative group', className)}>
        <div className='relative w-full h-40 rounded-xl border-2 border-slate-200 bg-slate-50/30 overflow-hidden'>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt='Preview'
            className='w-full h-full object-contain p-2'
            onError={(e) => {
              ;(e.target as HTMLImageElement).src =
                'https://placehold.co/320x160?text=Invalid+URL'
            }}
          />

          {/* Overlay — Loading หรือ ปุ่มเปลี่ยน/ลบ */}
          {!disabled && isLoading ? (
            <div className='absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 transition-opacity duration-200'>
              <Loader2 className='h-8 w-8 text-white animate-spin' />
              <span className='text-sm text-white font-medium'>
                กำลังอัปโหลด...
              </span>
            </div>
          ) : (
            !disabled && (
              <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-3'>
                <Button
                  type='button'
                  variant='secondary'
                  size='sm'
                  className='gap-1.5 bg-white/90 hover:bg-white text-slate-700'
                  onClick={() => inputRef.current?.click()}
                >
                  <Upload className='h-3.5 w-3.5' />
                  เปลี่ยนรูป
                </Button>
                <Button
                  type='button'
                  variant='destructive'
                  size='sm'
                  className='gap-1.5'
                  onClick={handleRemove}
                >
                  <Trash2 className='h-3.5 w-3.5' />
                  ลบ
                </Button>
              </div>
            )
          )}
        </div>

        <input
          ref={inputRef}
          type='file'
          accept={ACCEPT_TYPES}
          className='hidden'
          onChange={handleInputChange}
          disabled={disabled || isLoading}
        />
      </div>
    )
  }

  // ยังไม่มีรูป — แสดง Drop Zone
  return (
    <div className={cn('relative', className)}>
      <div
        role='button'
        tabIndex={0}
        onClick={() => {
          if (!disabled && !isLoading) inputRef.current?.click()
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            if (!disabled && !isLoading) inputRef.current?.click()
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'flex flex-col items-center justify-center gap-3 w-full h-40 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200',
          isDragging
            ? 'border-blue-400 bg-blue-50/50 scale-[1.02]'
            : 'border-slate-200 bg-slate-50/30 hover:border-blue-300 hover:bg-blue-50/20',
          (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
        )}
      >
        {isLoading ? (
          <>
            <Loader2 className='h-8 w-8 text-blue-500 animate-spin' />
            <span className='text-sm text-blue-600 font-medium'>
              กำลังอัปโหลด...
            </span>
          </>
        ) : (
          <>
            <ImagePlus className='h-8 w-8 text-slate-400' />
            <span className='text-sm text-slate-500 font-medium'>
              {placeholder}
            </span>
            <span className='text-[10px] text-slate-400 uppercase tracking-wider'>
              JPEG, PNG, WebP, GIF
            </span>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type='file'
        accept={ACCEPT_TYPES}
        className='hidden'
        onChange={handleInputChange}
        disabled={disabled || isLoading}
      />
    </div>
  )
}
