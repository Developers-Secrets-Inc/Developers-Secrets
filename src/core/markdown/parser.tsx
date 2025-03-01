// For now, we're just returning the markdown content as a string
// This will be expanded in the future to handle actual markdown parsing

/**
 * Simple string parser (legacy version)
 * @param content The markdown content to parse
 * @returns The parsed content as a string
 */
export const parseMarkdownToString = (content: string): string => {
  return content
}

/**
 * Extracts the outline from markdown content
 * This will be implemented in the future
 * @param content The markdown content to extract the outline from
 * @returns An array of outline items
 */
export type OutlineItem = {
  id: string
  text: string
  level: number
  children?: OutlineItem[]
}

export const extractOutline = (content: string): OutlineItem[] => {
  // Parse the markdown content
  const ast = convertMarkdownToJson(content)
  const markdownNode = transformToMarkdownNode(ast)

  // Extract headings and build outline
  const outline: OutlineItem[] = []
  const headingStack: OutlineItem[][] = [[]] // Stack to track parent-child relationships

  // Helper function to process nodes recursively
  const processNode = (node: MarkdownNode) => {
    if (node.type === 'heading' && node.depth && node.depth >= 1 && node.depth <= 6) {
      // Extract heading text
      const headingText =
        node.children
          ?.filter((child) => child.type === 'text')
          .map((child) => child.value)
          .join('') || ''

      const headingId = formatTitleToId(headingText)
      const item: OutlineItem = {
        id: headingId,
        text: headingText,
        level: node.depth,
        children: [],
      }

      // Find the appropriate level to add this heading
      while (headingStack.length > node.depth) {
        headingStack.pop()
      }

      // Ensure we have enough levels in our stack
      while (headingStack.length < node.depth) {
        headingStack.push([])
      }

      // Add to parent level
      const parentLevel = headingStack[node.depth - 1]
      if (node.depth === 1) {
        outline.push(item)
      } else {
        const parentItems = headingStack[node.depth - 2]
        if (parentItems.length > 0) {
          const parent = parentItems[parentItems.length - 1]
          if (!parent.children) {
            parent.children = []
          }
          parent.children.push(item)
        } else {
          // If no parent exists at the expected level, add to root
          outline.push(item)
        }
      }

      // Add to current level
      parentLevel.push(item)
    }

    // Process children recursively
    if (node.children && node.children.length > 0) {
      node.children.forEach(processNode)
    }
  }

  // Start processing from root
  processNode(markdownNode)

  return outline
}

import { Root, RootContent } from 'mdast'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { BundledLanguage } from 'shiki/bundle/web'
import React from 'react'
import Link from 'next/link'
import {
  TypographyH1,
  TypographyH2,
  TypographyP,
  TypographyInlineCode,
  TypographyItalic,
  TypographyBold,
  TypographyList,
  TypographyH3,
} from '@/components/typography'
import { CodeBlock, CodeBlockCode } from '@/components/code-block'

export interface MarkdownNode {
  type: string
  children?: MarkdownNode[]
  value?: string
  depth?: number
  lang?: BundledLanguage
  ordered?: boolean
  url?: string
}

export const convertMarkdownToJson = (markdown: string): Root => {
  return unified().use(remarkParse).parse(markdown)
}

export const transformToMarkdownNode = (node: Root | RootContent): MarkdownNode => {
  const result: MarkdownNode = {
    type: node.type,
    children: [],
  }

  if ('value' in node && typeof node.value === 'string') {
    result.value = node.value
  }

  if ('depth' in node && typeof node.depth === 'number') {
    result.depth = node.depth
  }

  if ('lang' in node && typeof node.lang === 'string') {
    result.lang = node.lang as BundledLanguage
  }

  if ('ordered' in node && typeof node.ordered === 'boolean') {
    result.ordered = node.ordered
  }

  if ('url' in node && typeof node.url === 'string') {
    result.url = node.url
  }

  if ('children' in node && Array.isArray(node.children)) {
    result.children = node.children.map((child: RootContent) => transformToMarkdownNode(child))
  }

  return result
}

function formatTitleToId(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function convertMarkdownToReact(node: MarkdownNode): React.ReactNode {
  switch (node.type) {
    case 'root':
      return (
        <>
          {node.children?.map((child, index) => (
            <React.Fragment key={index}>{convertMarkdownToReact(child)}</React.Fragment>
          ))}
        </>
      )
    case 'heading':
      const headingContent = node.children
        ?.map((child) => {
          if (child.type === 'text') return child.value
          return ''
        })
        .join('')
      const headingId = formatTitleToId(headingContent || '')

      if (node.depth === 1) {
        return (
          <TypographyH1 id={headingId}>
            {node.children?.map((child, index) => (
              <React.Fragment key={index}>{convertMarkdownToReact(child)}</React.Fragment>
            ))}
          </TypographyH1>
        )
      } else if (node.depth === 2) {
        return (
          <TypographyH2 id={headingId}>
            {node.children?.map((child, index) => (
              <React.Fragment key={index}>{convertMarkdownToReact(child)}</React.Fragment>
            ))}
          </TypographyH2>
        )
      } else if (node.depth === 3 || node.depth === 4) {
        return (
          <TypographyH3 id={headingId}>
            {node.children?.map((child, index) => (
              <React.Fragment key={index}>{convertMarkdownToReact(child)}</React.Fragment>
            ))}
          </TypographyH3>
        )
      }
      return null
    case 'paragraph':
      return (
        <TypographyP>
          {node.children?.map((child, index) => (
            <React.Fragment key={index}>{convertMarkdownToReact(child)}</React.Fragment>
          ))}
        </TypographyP>
      )
    case 'text':
      return node.value
    case 'emphasis':
      return (
        <TypographyItalic>
          {node.children?.map((child, index) => (
            <React.Fragment key={index}>{convertMarkdownToReact(child)}</React.Fragment>
          ))}
        </TypographyItalic>
      )
    case 'strong':
      return (
        <TypographyBold>
          {node.children?.map((child, index) => (
            <React.Fragment key={index}>{convertMarkdownToReact(child)}</React.Fragment>
          ))}
        </TypographyBold>
      )
    case 'inlineCode':
      return <TypographyInlineCode>{node.value}</TypographyInlineCode>
    case 'list':
      if (!node.ordered) {
        return (
          <TypographyList>
            {node.children?.map((item, index) => (
              <React.Fragment key={index}>{convertMarkdownToReact(item)}</React.Fragment>
            ))}
          </TypographyList>
        )
      }
      // Handle ordered lists if needed
      return null
    case 'listItem':
      return (
        <>
          {node.children?.map((child, index) => (
            <React.Fragment key={index}>{convertMarkdownToReact(child)}</React.Fragment>
          ))}
        </>
      )
    case 'code':
      if (node.lang && node.value) {
        return (
          <div className="my-6">
            <CodeBlock>
              <CodeBlockCode code={node.value} language={node.lang} theme="github-dark" />
            </CodeBlock>
          </div>
        )
      }
      return null
    case 'link':
      const isExternal = node.url?.startsWith('http') || node.url?.startsWith('https')
      if (isExternal) {
        return (
          <a
            href={node.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 underline"
          >
            {node.children?.map((child, index) => (
              <React.Fragment key={index}>{convertMarkdownToReact(child)}</React.Fragment>
            ))}
          </a>
        )
      }
      return (
        <Link href={node.url || ''} className="text-blue-500 hover:text-blue-600 underline">
          {node.children?.map((child, index) => (
            <React.Fragment key={index}>{convertMarkdownToReact(child)}</React.Fragment>
          ))}
        </Link>
      )
    default:
      console.warn(`Unsupported node type: ${node.type}`)
      return null
  }
}

// This is the main parser function that returns React nodes
export function parseMarkdown(markdown: string): React.ReactNode {
  const jsonAST = convertMarkdownToJson(markdown)
  const markdownNode = transformToMarkdownNode(jsonAST)
  return convertMarkdownToReact(markdownNode)
}
