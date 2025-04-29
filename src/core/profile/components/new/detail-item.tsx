import React from 'react'
import Link from 'next/link'

interface DetailItemProps {
  icon: React.ReactNode
  label: string
  value: string | null | undefined
  href?: string
}

export const DetailItem = ({ icon, label, value, href }: DetailItemProps) => {
  if (!value) return null // Don't render if value is missing

  const content = (
    <div className="flex items-center gap-2">
      <div className="text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium break-all">{value}</p>
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} target="_blank" rel="noopener noreferrer" className="hover:underline">
        {content}
      </Link>
    )
  }

  return content
}
