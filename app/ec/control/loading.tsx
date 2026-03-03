export default function Loading() {
  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <div className='h-9 w-48 bg-slate-200 rounded animate-pulse' />
        <div className='flex space-x-2'>
          <div className='h-10 w-28 bg-slate-200 rounded animate-pulse' />
          <div className='h-10 w-28 bg-slate-200 rounded animate-pulse' />
        </div>
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
