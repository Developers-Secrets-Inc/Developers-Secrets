import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

interface LinkButtonProps extends React.ComponentProps<typeof Button> {
  href: string
  children: React.ReactNode
}

export const LinkButton = ({ href, children, ...props }: LinkButtonProps) => {
  return (
    <Button asChild className="flex-1" {...props}>
      <Link href={href}>{children}</Link>
    </Button>
  )
}
