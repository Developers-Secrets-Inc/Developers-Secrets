'use client'

import { cn } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import { codeToHtml } from 'shiki'
import { Copy, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type CodeBlockProps = {
  children?: React.ReactNode
  className?: string
} & React.HTMLProps<HTMLDivElement>

function CodeBlock({ children, className, ...props }: CodeBlockProps) {
  return (
    <figure
      className={cn(
        'my-4 rounded-xl bg-fd-card p-1 relative border outline-none not-prose overflow-hidden text-sm',
        className,
      )}
      tabIndex={0}
      {...props}
    >
      {children}
    </figure>
  )
}

export type CodeBlockCodeProps = {
  code: string
  language?: string
  theme?: string
  className?: string
} & React.HTMLProps<HTMLDivElement>

function CodeBlockCode({
  code,
  language = 'tsx',
  theme = 'github-dark',
  className,
  ...props
}: CodeBlockCodeProps) {
  const [highlightedHtml, setHighlightedHtml] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    async function highlight() {
      const html = await codeToHtml(code, { lang: language, theme })
      setHighlightedHtml(html)
    }
    highlight()
  }, [code, language, theme])

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const classNames = cn(
    'bg-muted rounded-lg border text-[14px] py-3.5 overflow-auto max-h-[600px] [&>pre]:!bg-transparent',
    className,
  )

  // SSR fallback: render plain code if not hydrated yet
  return (
    <>
      <div className="empty:hidden absolute top-1 right-1 z-2 bg-fd-card rounded-bl-lg border-l border-b text-fd-muted-foreground">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md p-2 text-sm font-medium transition-colors duration-100 disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none hover:bg-fd-accent hover:text-fd-accent-foreground [&_svg]:size-3.5"
          aria-label="Copy Text"
          onClick={handleCopy}
        >
          {copied ? <Check /> : <Copy />}
        </button>
      </div>
      {highlightedHtml ? (
        <div
          className={classNames}
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          {...props}
        />
      ) : (
        <div className={classNames} {...props}>
          <pre className="min-w-full w-max *:flex *:flex-col">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </>
  )
}

export type CodeBlockGroupProps = React.HTMLAttributes<HTMLDivElement>

function CodeBlockGroup({ children, className, ...props }: CodeBlockGroupProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between px-4 py-2 bg-muted/80 border-b border-border/40 text-sm text-muted-foreground',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { CodeBlockGroup, CodeBlockCode, CodeBlock }
