import Navigation from '../_components/Navigation'
import UserHeader from '../_components/UserHeader'
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <SpeedInsights />
      <Navigation />
      <UserHeader />
      <div className='p-3'>{children}</div>
    </>
  )
}
