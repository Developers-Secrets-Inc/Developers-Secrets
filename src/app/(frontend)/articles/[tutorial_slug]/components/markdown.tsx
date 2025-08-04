import { CodeBlock, CodeBlockCode } from '@/components/code-block'
import { MDXRemote } from 'next-mdx-remote/rsc'
import React from 'react'

function extractLanguage(className?: string): string {
  if (!className) return 'plaintext'
  const match = className.match(/language-(\w+)/)
  return match ? match[1] : 'plaintext'
}

export const CustomPre = ({ children, ...props }: { children: React.ReactElement }) => {
  const codeElement = children as React.ReactElement<{ className?: string; children?: React.ReactNode }>
  const codeProps = codeElement.props

  const codeString = typeof codeProps.children === 'string' ? codeProps.children.trim() : ''

  const language = extractLanguage(codeProps.className)

  return (
    <CodeBlock>
      <CodeBlockCode code={codeString} language={language} />
    </CodeBlock>
  )
}

const components = {
  pre: CustomPre,
}

export const Markdown = ({ content }: { content: string }) => (
  <MDXRemote source={content} components={components} />
)
