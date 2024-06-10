import UserHeader from '../../_components/UserHeader'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <UserHeader />
      <div className='p-3'>{children}</div>
    </>
  )
}
