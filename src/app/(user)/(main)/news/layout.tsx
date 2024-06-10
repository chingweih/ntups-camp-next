import { type Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s｜政治營新聞',
    default: '新聞',
  },
}

export default function NewsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
