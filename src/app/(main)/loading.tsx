import Spinner from '../_components/LoadingSpinner'

export function LoadingComp() {
  return (
    <div className='flex items-center justify-center gap-5 h-40'>
      <Spinner />
      <p className='text-center'>努力拉票中⋯</p>
    </div>
  )
}

export default function Loading() {
  return <LoadingComp />
}
