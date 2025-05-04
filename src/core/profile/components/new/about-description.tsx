'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface AboutDescriptionProps {
  description: string
}

export const AboutDescription = ({ description }: AboutDescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false)
  // Simple check, adjust threshold as needed
  const isLongDescription = description.length > 200

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold">About me</h3>
      <p
        className={`text-sm text-muted-foreground ${!isExpanded && isLongDescription ? 'line-clamp-3' : ''}`}
      >
        {description}
      </p>
      {isLongDescription && (
        <Button
          variant="link"
          className="p-0 h-auto text-sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Read Less' : 'Read More'}
        </Button>
      )}
    </div>
  )
}
