'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

export const TagsLists = ({
  tags,
}: {
  tags: {
    name: string
    slug: string
    count?: number
  }[]
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showExpandButton, setShowExpandButton] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const tagsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current && tagsRef.current) {
        const containerHeight = containerRef.current.clientHeight
        const tagsHeight = tagsRef.current.scrollHeight
        setShowExpandButton(tagsHeight > containerHeight)
      }
    }

    checkOverflow()
    window.addEventListener('resize', checkOverflow)
    return () => window.removeEventListener('resize', checkOverflow)
  }, [tags])

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={`relative flex flex-wrap overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-none' : 'max-h-[60px]'
        }`}
      >
        <div
          ref={tagsRef}
          className="relative my-[-10px] ml-[-10px] flex flex-wrap"
        >
          {tags.map((tag) => (
            <div key={tag.slug} className="group m-[10px] flex items-center">
              <Link
                href={`/tags/${tag.slug}`}
                className="inline-flex items-center transition-colors duration-200 hover:text-foreground hover:underline"
              >
                <span className="whitespace-nowrap text-muted-foreground">
                  {tag.name}
                </span>
                {tag.count && (
                  <span className="ml-1 flex h-[18px] items-center justify-center rounded-[10px] px-1.5 text-xs font-normal text-muted-foreground bg-muted group-hover:text-foreground group-hover:bg-muted/80 transition-colors duration-200">
                    {tag.count}
                  </span>
                )}
              </Link>
            </div>
          ))}
        </div>
        
        {/* Gradient overlay when collapsed */}
        {!isExpanded && showExpandButton && (
          <div className="absolute bottom-0 right-0 h-[60px] w-32 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        )}
      </div>

      {/* Expand/Collapse button */}
      {showExpandButton && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute bottom-0 right-0 flex items-center gap-1 px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          {isExpanded ? (
            <>
              <span>Show less</span>
              <ChevronUp className="h-4 w-4" />
            </>
          ) : (
            <>
              <span>Show more</span>
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
      )}
    </div>
  )
}
