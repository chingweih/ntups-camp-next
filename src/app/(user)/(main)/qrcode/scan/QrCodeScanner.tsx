'use client'

import { outline, Scanner } from '@yudiel/react-qr-scanner'
import { useRouter } from 'next/navigation'

export default function QrCodeScanner() {
  const router = useRouter()

  return (
    <Scanner
      onScan={(result) => {
        if (!!result && result[0].rawValue.startsWith('ntupscamp-transfer::')) {
          router.push(`/bank/transfer/?to=${result[0].rawValue.split('::')[1]}`)
        }
      }}
      scanDelay={1500}
      components={{ tracker: outline, audio: false }}
      constraints={{ facingMode: 'environment' }}
    />
  )
}
