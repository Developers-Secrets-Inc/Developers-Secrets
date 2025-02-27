import React from 'react'
import { parseMarkdown } from '@/core/markdown/parser'

interface MarkdownProps {
  children: string
}

export function Markdown({ children }: MarkdownProps) {
  const content = parseMarkdown(children)

  return <div className="prose prose-slate max-w-none">{content}</div>
}
