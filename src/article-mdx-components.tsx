import { CodeBlock, CodeBlockCode } from '@/components/code-block'
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
} from '@/components/typography'
import type { ReactNode, ComponentType } from 'react'

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function extractLanguage(className?: string): string {
  if (!className) return 'plaintext'
  const match = className.match(/language-(\w+)/)
  return match ? match[1] : 'plaintext'
}

interface TypographyProps {
  children: ReactNode
  className?: string
  id?: string
}

function TypographyPWrapper({ children, className = '', id }: TypographyProps) {
  return (
    <p id={id} className={`leading-7 [&:not(:first-child)]:mt-6 ${className} text-muted-foreground`}>
      {children}
    </p>
  )
}

const DEFAULT_ARTICLE_MDX_COMPONENTS: Record<string, ComponentType<any>> = {
  h1: function H1({ children, ...props }) {
    const id = typeof children === 'string' ? slugify(children) : ''
    return (
      <TypographyH1 id={id} {...props}>
        {children}
      </TypographyH1>
    )
  },
  h2: function H2({ children, ...props }) {
    const id = typeof children === 'string' ? slugify(children) : ''
    return (
      <TypographyH2 id={id} {...props}>
        {children}
      </TypographyH2>
    )
  },
  h3: function H3({ children, ...props }) {
    const id = typeof children === 'string' ? slugify(children) : ''
    return (
      <TypographyH3 id={id} {...props}>
        {children}
      </TypographyH3>
    )
  },
  h4: function H4({ children, ...props }) {
    const id = typeof children === 'string' ? slugify(children) : ''
    return (
      <TypographyH3 id={id} className="text-lg" {...props}>
        {children}
      </TypographyH3>
    )
  },
  h5: function H5({ children, ...props }) {
    const id = typeof children === 'string' ? slugify(children) : ''
    return (
      <TypographyH3 id={id} className="text-base" {...props}>
        {children}
      </TypographyH3>
    )
  },
  h6: function H6({ children, ...props }) {
    const id = typeof children === 'string' ? slugify(children) : ''
    return (
      <TypographyH3 id={id} className="text-sm" {...props}>
        {children}
      </TypographyH3>
    )
  },
  p: function P({ children, ...props }) {
    return <TypographyPWrapper {...props}>{children}</TypographyPWrapper>
  },
  blockquote: function Blockquote({ children, ...props }) {
    return <TypographyBlockquote {...props}>{children}</TypographyBlockquote>
  },
  ul: function Ul({ children, ...props }) {
    return (
      <TypographyList {...props} className="text-muted-foreground">
        {children}
      </TypographyList>
    )
  },
  ol: function Ol({ children, ...props }) {
    return (
      <TypographyList {...props} className="list-decimal text-muted-foreground">
        {children}
      </TypographyList>
    )
  },
  a: function A({ children, href, ...props }) {
    return (
      <TypographyLink href={href} {...props}>
        {children}
      </TypographyLink>
    )
  },
  strong: function Strong({ children, ...props }) {
    return (
      <TypographyBold {...props} className="text-gray-200">
        {children}
      </TypographyBold>
    )
  },
  em: function Em({ children, ...props }) {
    return <TypographyItalic {...props}>{children}</TypographyItalic>
  },
  code: function Code({ className, children, ...props }) {
    const isInline = !className
    if (isInline) {
      return (
        <TypographyInlineCode {...props} className="text-gray-200">
          {children}
        </TypographyInlineCode>
      )
    }
    const language = extractLanguage(className)
    return (
      <CodeBlock className={className}>
        <CodeBlockCode code={children as string} language={language} />
      </CodeBlock>
    )
  },
  pre: function Pre({ children }) {
    return <>{children}</>
  },
}

export function getArticleMDXComponents(
  components?: Record<string, ComponentType<any>>,
) {
  return { ...DEFAULT_ARTICLE_MDX_COMPONENTS, ...components }
}

