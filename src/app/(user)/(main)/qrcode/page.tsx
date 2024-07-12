import { Button } from '@/components/ui/button'
import { colors } from '@/lib/custom-colors'
import { getUser } from '@/utils/auth'
import { ScanLine } from 'lucide-react'
import Link from 'next/link'
import QRcode from 'react-qr-code'

export default async function QrCodePage() {
  const { userName, displayName } = await getUser()

  return (
    <div className='flex flex-col items-center justify-center gap-9 pt-5'>
      <h2 className='text-lg font-bold'>我的收款碼</h2>
      <QRcode
        value={`ntupscamp-transfer::${userName}`}
        bgColor={colors.pageBackground}
        fgColor={colors.primaryBlue}
        size={200}
        className='rounded-lg'
      />
      <p className='text-center text-muted-foreground'>
        {displayName}
        <br />@{userName}
      </p>
      <Button asChild>
        <Link href='/qrcode/scan'>
          <ScanLine size={18} className='mr-2' />
          掃描轉帳
        </Link>
      </Button>
    </div>
  )
}
