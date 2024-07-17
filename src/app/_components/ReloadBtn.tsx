'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

export default function ReloadBtn({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  return (
    <button
      onClick={() => {
        window.location.reload()
      }}
    >
      {children}
    </button>
  )
}
