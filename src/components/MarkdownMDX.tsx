'use client'
import * as React from 'react'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'
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

export type MarkdownRemoteProps = {
  source: MDXRemoteSerializeResult
  className?: string
  components?: Record<string, React.ComponentType<any>>
}

// Composants typographiques par défaut pour MDX
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
}

export function MarkdownRemote({ source, className, components }: MarkdownRemoteProps) {
  return (
    <div className={className ?? 'prose prose-slate max-w-none'}>
      <MDXRemote {...source} components={{ ...DEFAULT_MDX_COMPONENTS, ...components }} />
    </div>
  )
}

// Exemple d'utilisation :
// const mdxSource = await serialize(markdownString)
// <MarkdownRemote source={mdxSource} />
