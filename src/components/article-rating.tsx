"use client"

import React, { useState } from 'react'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ArticleRatingProps {
  articleId: string
  onRate?: (rating: number) => void
}

/**
 * Displays a 5-star rating component for articles
 * Allows users to rate articles from 1 to 5 stars
 */
export function ArticleRating({ articleId, onRate }: ArticleRatingProps) {
  const [rating, setRating] = useState<number | null>(null)
  const [hoveredRating, setHoveredRating] = useState<number | null>(null)
  const [hasRated, setHasRated] = useState(false)

  const handleRate = (selectedRating: number) => {
    setRating(selectedRating)
    setHasRated(true)

    if (onRate) {
      onRate(selectedRating)
    }

    // In a real implementation, we would send this rating to the server
    console.log(`Rated article ${articleId} with ${selectedRating} stars`)
  }

  if (hasRated) {
    return (
      <div className="flex flex-col items-center gap-2 py-6 border-t mt-8">
        <p className="text-center font-medium">Thanks for your feedback!</p>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-6 w-6 ${star <= (rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2 py-6 border-t mt-8">
      <p className="text-center font-medium">Was this article helpful?</p>
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            variant="ghost"
            size="sm"
            className="p-1"
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(null)}
            onClick={() => handleRate(star)}
          >
            <Star
              className={`h-6 w-6 ${
                star <= (hoveredRating || rating || 0)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </Button>
        ))}
      </div>
    </div>
  )
}
