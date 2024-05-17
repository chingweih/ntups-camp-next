import { Construction } from 'lucide-react'

export default function NotFound() {
  return (
    <div className='h-96 flex flex-col gap-10 items-center justify-center'>
      <h1 className='text-3xl font-bold'>404</h1>
      <div className='flex gap-5 items-center justify-center '>
        <Construction
          size='60'
          className='text-yellow-500 border-r-2 pr-5 border-slate-300 '
        />
        <div>
          <h2>工程招標中（可能已流標）</h2>
        </div>
      </div>
    </div>
  )
}
