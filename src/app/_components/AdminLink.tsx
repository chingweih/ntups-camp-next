'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AdminLink({
  href,
  className,
  children,
}: {
  href: string
  className?: string
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <Button
      asChild
      variant='link'
      className={cn(
        'w-full p-0 text-white',
        pathname === href ? 'font-bold underline' : '',
        className,
      )}
    >
      <Link href={href}>{children}</Link>
    </Button>
  )
}
