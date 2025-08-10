import { source } from '@/lib/source'
import { DocsLayout } from 'fumadocs-ui/layouts/docs'
import { baseOptions } from '@/app/layout.config'
import React from 'react'
import { getUser } from '@/core/users'
import { redirect } from 'next/navigation'
import { isFailure } from '@/lib/result'

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (isFailure(user) || user.value.informations.role !== 'admin') {
    redirect('/auth/login')
  }
  return (
    <DocsLayout tree={source.pageTree} {...baseOptions}>
      {children}
    </DocsLayout>
  )
}
