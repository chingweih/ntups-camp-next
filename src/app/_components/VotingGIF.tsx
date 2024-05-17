import voting from '@/assets/voting.gif'
import Image from 'next/image'

export default function Voting({ size }: { size: number }) {
  return <Image src={voting} alt='Voting' width={size} height={size} />
}
