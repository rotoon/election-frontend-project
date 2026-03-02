'use client'

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'

interface ImagePreviewDialogProps {
  url: string | null
  onClose: () => void
}

export function ImagePreviewDialog({ url, onClose }: ImagePreviewDialogProps) {
  return (
    <Dialog
      open={!!url}
      onOpenChange={() => onClose()}
    >
      <DialogContent className='max-w-3xl p-2 border-none [&>button]:cursor-pointer'>
        <DialogTitle className='sr-only'>ดูรูปขนาดจริง</DialogTitle>
        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt='ดูรูปขนาดจริง'
            className='w-full h-auto max-h-[80vh] object-contain rounded-md'
            onError={(e) => {
              ;(e.target as HTMLImageElement).src =
                'https://placehold.co/600x400?text=ไม่สามารถโหลดรูปได้'
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
