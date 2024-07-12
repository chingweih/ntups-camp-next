import QrCodeScanner from './QrCodeScanner'

export default function QrCodeScanPage() {
  return (
    <div className='flex flex-col items-center justify-center gap-3'>
      <h2 className='text-lg font-bold'>掃描轉帳</h2>
      <p className='mb-2 text-center text-muted-foreground'>
        掃描對方的收款碼
        <br />
        <span className='text-sm'>
          （iOS 系統若相機畫面未出現，請跳出 App 用 Safari 開啟）
        </span>
      </p>
      <QrCodeScanner />
    </div>
  )
}
