import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s｜政治營串',
    default: '串文',
  },
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
