import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { cn } from '@/lib/utils'

interface LinkButtonProps extends React.ComponentProps<typeof Button> {
  href: string
  children: React.ReactNode
}

export const LinkButton = ({ href, children, className, ...props }: LinkButtonProps) => {
  return (
    <Button asChild className={cn(className)} {...props}>
      <Link href={href}>{children}</Link>
    </Button>
  )
}
