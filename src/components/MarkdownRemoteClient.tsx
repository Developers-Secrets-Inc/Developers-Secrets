'use client'

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
import { Button } from '@/components/updated-ui/button'
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyP,
  TypographyBlockquote,
  TypographyList,
  TypographyLink,
  TypographyInlineCode,
  TypographyBold,
  TypographyItalic,
} from './typography'
import { InfoIcon } from 'lucide-react'

function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-md border px-4 py-3 flex items-start gap-2">
      <InfoIcon className="mt-1 text-blue-500" size={16} aria-hidden="true" />
      <span className="text-sm">{children}</span>
    </div>
  )
}

const DEFAULT_MDX_COMPONENTS = {
  h1: TypographyH1,
  h2: TypographyH2,
  h3: TypographyH3,
  h4: (props: any) => <TypographyH3 className="text-lg" {...props} />,
  h5: (props: any) => <TypographyH3 className="text-base" {...props} />,
  h6: (props: any) => <TypographyH3 className="text-sm" {...props} />,
  p: TypographyP,
  blockquote: TypographyBlockquote,
  ul: TypographyList,
  ol: (props: any) => <TypographyList className="list-decimal" {...props} />,
  a: TypographyLink,
  strong: TypographyBold,
  em: TypographyItalic,
  code: TypographyInlineCode,
  Button,
  InfoNote,
}

export function MarkdownRemoteClient({
  source,
  components,
  className,
}: {
  source: MDXRemoteSerializeResult
  components?: Record<string, any>
  className?: string
}) {
  return (
    <div className={className ?? 'prose prose-slate max-w-none'}>
      <MDXRemote {...source} components={{ ...DEFAULT_MDX_COMPONENTS, ...components }} />
    </div>
  )
}
