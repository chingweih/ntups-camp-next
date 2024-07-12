import QrCodeScanner from './QrCodeScanner'

export default function QrCodeScanPage() {
  return (
    <div className='flex flex-col items-center justify-center gap-5 pt-3'>
      <h2 className='text-lg font-bold'>掃描轉帳</h2>
      <p className='text-center text-muted-foreground'>掃描對方的收款碼</p>
      <QrCodeScanner />
    </div>
  )
}
