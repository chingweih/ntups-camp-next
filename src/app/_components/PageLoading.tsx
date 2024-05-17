import Voting from './VotingGIF'

export default function PageLoading() {
  return (
    <div className='flex items-center justify-center gap-5 h-40'>
      <Voting size={80} />
      <p className='text-center'>努力拉票中⋯</p>
    </div>
  )
}
