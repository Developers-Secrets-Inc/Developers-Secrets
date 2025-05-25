'use client'

import React, { useEffect, useState } from 'react'
import { Text } from 'lucide-react'
import { OutlineItem } from '@/core/markdown/parser'

interface ArticleOutlineProps {
  outline: OutlineItem[]
}

export function ArticleOutline({ outline }: ArticleOutlineProps) {
  const [activeId, setActiveId] = useState<string>('')

  // Initialize with the current hash in the URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '')
      if (hash) {
        setActiveId(hash)
      }
    }
  }, [])

  // Set up intersection observer to track which heading is currently in view
  useEffect(() => {
    if (!outline || outline.length === 0) return

    const headingElements = outline.flatMap((item) => {
      const elements = [document.getElementById(item.id)]
      if (item.children) {
        item.children.forEach((child) => {
          const childElement = document.getElementById(child.id)
          if (childElement) elements.push(childElement)
        })
      }
      return elements.filter(Boolean) as HTMLElement[]
    })

    console.log(headingElements)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: '-100px 0px -66%',
        threshold: 0,
      },
    )

    headingElements.forEach((element) => {
      observer.observe(element)
    })

    return () => {
      headingElements.forEach((element) => {
        observer.unobserve(element)
      })
    }
  }, [outline])

  // If there's no outline or it's empty, don't render the component
  if (!outline || outline.length === 0) {
    return null
  }

  return (
    <aside className="w-72 shrink-0 sticky top-16 h-[calc(100vh-64px)] pb-2 pt-6 max-xl:hidden overflow-hidden">
      <nav className="h-full overflow-y-auto px-4 flex flex-col gap-3 pe-4 pr-2">
        <h3 className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Text className="size-4" />
          On this page
        </h3>
        <div className="flex flex-col gap-2 text-sm">
          {outline.map((item, index) => (
            <React.Fragment key={`item-${item.id}-${index}`}>
              <a
                href={`#${item.id}`}
                className={`transition-colors ${
                  activeId === item.id
                    ? 'text-primary font-medium'
                    : item.level > 2
                      ? 'text-muted-foreground hover:text-foreground'
                      : 'hover:text-primary'
                }`}
                onClick={(e) => {
                  e.preventDefault()
                  const element = document.getElementById(item.id)
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                    window.history.pushState(null, '', `#${item.id}`)
                  }
                }}
              >
                {item.text}
              </a>
              {item.children && item.children.length > 0 && (
                <div className="flex flex-col gap-1.5 pl-3">
                  {item.children.map((child, childIndex) => (
                    <a
                      key={`child-${child.id}-${index}-${childIndex}`}
                      href={`#${child.id}`}
                      className={`text-muted-foreground hover:text-foreground transition-colors ${
                        activeId === child.id ? 'text-primary font-medium' : ''
                      }`}
                      onClick={(e) => {
                        e.preventDefault()
                        const element = document.getElementById(child.id)
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' })
                          window.history.pushState(null, '', `#${child.id}`)
                        }
                      }}
                    >
                      {child.text}
                    </a>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </nav>
    </aside>
  )
}
