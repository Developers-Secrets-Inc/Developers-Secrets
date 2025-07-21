'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

interface ArticleOutlineProps {
  outline: {
    id: string
    text: string
    level: number
  }[]
}

export function ArticleOutline({ outline }: ArticleOutlineProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const headings = Array.from(document.querySelectorAll('h2, h3, h4, h5, h6')).filter(
      (el) => el.id,
    )

    const onScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight

      // Find the heading that is currently in view
      let currentHeading: Element | null = null
      for (const heading of headings) {
        const rect = heading.getBoundingClientRect()
        if (rect.top <= windowHeight / 3) {
          currentHeading = heading
        } else {
          break
        }
      }

      if (currentHeading) {
        setActiveId(currentHeading.id)
      } else if (headings.length > 0 && scrollY < 100) {
        // Near the top of the page, highlight the first heading
        setActiveId(headings[0].id)
      } else {
        setActiveId(null)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // Call once to set initial state

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [outline])

  if (!outline.length) {
    return null
  }

  return (
    <div className="hidden text-sm xl:block">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="sticky top-16 max-h-[calc(100vh-4rem)] overflow-y-auto p-4"
      >
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">On This Page</h4>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronDown
                className={cn('h-4 w-4 transition-transform', {
                  'rotate-180': !isOpen,
                })}
              />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="mt-4">
          <div className="flex flex-col space-y-2">
            {outline.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn('line-clamp-1 hover:underline', {
                  'font-medium text-primary': activeId === item.id,
                  'text-muted-foreground': activeId !== item.id,
                  'pl-4': item.level === 3,
                  'pl-8': item.level === 4,
                  'pl-12': item.level === 5,
                  'pl-16': item.level === 6,
                })}
                onClick={(e) => {
                  e.preventDefault()
                  document.querySelector(`#${item.id}`)?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                  })
                }}
              >
                {item.text}
              </a>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}
