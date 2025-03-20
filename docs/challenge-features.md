# Challenge Features Development Plan

This document outlines the development plan for implementing several features related to challenges, user progression tracking, and UI components.

## 1. Challenge Like-Dislike System

### 1.1. Database Functions

We need to extend the current functions in `src/core/challenges/index.ts` to handle likes and dislikes:

```typescript
// Functions already implemented:
// - addLikeToChallenge
// - removeLikeFromChallenge

// New functions to add:
export const addDislikeToChallenge = async (slug: string): Promise<void> => {
  const payload = await getPayload({ config })
  const challenge = await getPayloadChallenge(slug)
  const currentDislikes = challenge.engagement?.dislikes || 0
  await payload.update({
    collection: 'challenges',
    where: {
      slug: {
        equals: slug,
      },
    },
    data: {
      engagement: {
        dislikes: currentDislikes + 1,
      },
    },
  })
}

export const removeDislikeFromChallenge = async (slug: string): Promise<void> => {
  const payload = await getPayload({ config })
  const challenge = await getPayloadChallenge(slug)
  const currentDislikes = challenge.engagement?.dislikes || 0
  await payload.update({
    collection: 'challenges',
    where: {
      slug: {
        equals: slug,
      },
    },
    data: {
      engagement: {
        dislikes: Math.max(0, currentDislikes - 1),
      },
    },
  })
}
```

### 1.2. Client Components with Server Actions

Create reusable button components in `src/components/challenges`:

```typescript
// src/components/challenges/like-button.tsx
'use client'

import { useState } from 'react'
import { ThumbsUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface LikeButtonProps {
  initialLiked: boolean
  challengeSlug: string
  onClick: (liked: boolean, challengeSlug: string) => Promise<void>
}

export function LikeButton({ initialLiked, challengeSlug, onClick }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [isPending, setIsPending] = useState(false)

  const handleClick = async () => {
    setIsPending(true)
    try {
      await onClick(!liked, challengeSlug)
      setLiked(!liked)
    } catch (error) {
      console.error('Error toggling like:', error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-8 px-2 ${
        liked ? 'text-green-500' : 'text-muted-foreground hover:text-green-500'
      } flex items-center gap-1.5`}
      onClick={handleClick}
      disabled={isPending}
    >
      <ThumbsUp size={16} />
      <span className="text-sm">Like</span>
    </Button>
  )
}

// src/components/challenges/dislike-button.tsx
'use client'

import { useState } from 'react'
import { ThumbsDown } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DislikeButtonProps {
  initialDisliked: boolean
  challengeSlug: string
  onClick: (disliked: boolean, challengeSlug: string) => Promise<void>
}

export function DislikeButton({ initialDisliked, challengeSlug, onClick }: DislikeButtonProps) {
  const [disliked, setDisliked] = useState(initialDisliked)
  const [isPending, setIsPending] = useState(false)

  const handleClick = async () => {
    setIsPending(true)
    try {
      await onClick(!disliked, challengeSlug)
      setDisliked(!disliked)
    } catch (error) {
      console.error('Error toggling dislike:', error)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`h-8 px-2 ${
        disliked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'
      } flex items-center gap-1.5`}
      onClick={handleClick}
      disabled={isPending}
    >
      <ThumbsDown size={16} />
      <span className="text-sm">Dislike</span>
    </Button>
  )
}
```

Then create server actions in `src/app/actions/challenge-actions.ts`:

```typescript
'use server'

import { getUserSession } from '@/core/auth'
import { 
  addLikeToChallenge, 
  removeLikeFromChallenge,
  addDislikeToChallenge,
  removeDislikeFromChallenge
} from '@/core/challenges'
import { getUserChallengeProgression, updateUserChallengeProgression } from '@/core/user-progression'

export async function toggleChallengeLike(liked: boolean, challengeSlug: string) {
  const session = await getUserSession()
  if (!session?.userId) {
    throw new Error('Authentication required')
  }

  const userId = session.userId
  const progression = await getUserChallengeProgression(userId, challengeSlug)

  // If toggling to liked
  if (liked) {
    // If previously disliked, remove dislike
    if (progression?.hasDisliked) {
      await removeDislikeFromChallenge(challengeSlug)
    }
    await addLikeToChallenge(challengeSlug)
    await updateUserChallengeProgression(userId, challengeSlug, {
      hasLiked: true,
      hasDisliked: false
    })
  } 
  // If toggling to unliked
  else {
    await removeLikeFromChallenge(challengeSlug)
    await updateUserChallengeProgression(userId, challengeSlug, {
      hasLiked: false
    })
  }
}

export async function toggleChallengeDislike(disliked: boolean, challengeSlug: string) {
  const session = await getUserSession()
  if (!session?.userId) {
    throw new Error('Authentication required')
  }

  const userId = session.userId
  const progression = await getUserChallengeProgression(userId, challengeSlug)

  // If toggling to disliked
  if (disliked) {
    // If previously liked, remove like
    if (progression?.hasLiked) {
      await removeLikeFromChallenge(challengeSlug)
    }
    await addDislikeToChallenge(challengeSlug)
    await updateUserChallengeProgression(userId, challengeSlug, {
      hasDisliked: true,
      hasLiked: false
    })
  } 
  // If toggling to undisliked
  else {
    await removeDislikeFromChallenge(challengeSlug)
    await updateUserChallengeProgression(userId, challengeSlug, {
      hasDisliked: false
    })
  }
}
```

### 1.3. UserChallengeProgression Collection

Create a new collection in `src/collections/UserChallengeProgression.ts`:

```typescript
import { CollectionConfig } from 'payload'

export const UserChallengeProgression: CollectionConfig = {
  slug: 'userChallengeProgression',
  admin: {
    useAsTitle: 'userId',
    defaultColumns: ['userId', 'challengeSlug', 'hasLiked', 'hasDisliked', 'createdAt'],
  },
  access: {
    read: ({ req }) => {
      // Only admin or the user can access their own progression
      if (req.user && (req.user.role === 'admin' || req.user.id === req.data.userId)) {
        return true
      }
      return false
    },
  },
  fields: [
    {
      name: 'userId',
      type: 'text',
      required: true,
      admin: {
        description: 'ID of the user',
      },
    },
    {
      name: 'challengeSlug',
      type: 'text',
      required: true,
      admin: {
        description: 'Slug of the challenge',
      },
    },
    {
      name: 'hasLiked',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether the user has liked this challenge',
      },
    },
    {
      name: 'hasDisliked',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Whether the user has disliked this challenge',
      },
    },
    // Fields for the rating system will be added in section 2
  ],
  indexes: [
    {
      fields: ['userId', 'challengeSlug'],
      unique: true,
    },
  ],
}
```

Add core functions for user progression in `src/core/user-progression/index.ts`:

```typescript
import { getPayload } from 'payload'
import config from '@payload-config'

export const getUserChallengeProgression = async (userId: string, challengeSlug: string) => {
  const payload = await getPayload({ config })
  
  const result = await payload.find({
    collection: 'userChallengeProgression',
    where: {
      and: [
        {
          userId: {
            equals: userId,
          },
        },
        {
          challengeSlug: {
            equals: challengeSlug,
          },
        },
      ],
    },
  })

  return result.docs[0]
}

export const updateUserChallengeProgression = async (
  userId: string, 
  challengeSlug: string, 
  data: any
) => {
  const payload = await getPayload({ config })
  
  // Check if record exists
  const existing = await getUserChallengeProgression(userId, challengeSlug)
  
  if (existing) {
    // Update existing record
    return await payload.update({
      collection: 'userChallengeProgression',
      id: existing.id,
      data,
    })
  } else {
    // Create new record
    return await payload.create({
      collection: 'userChallengeProgression',
      data: {
        userId,
        challengeSlug,
        ...data,
      },
    })
  }
}
```

## 2. Challenge Rating System

### 2.1. Extend Challenges Collection

Add new fields to the `Challenges` collection in `src/collections/Challenges.ts`:

```typescript
// Add inside the fields array of the Challenges collection
{
  name: 'ratings',
  label: 'Ratings',
  type: 'group',
  admin: {
    description: 'User ratings for this challenge',
    position: 'sidebar',
  },
  fields: [
    {
      name: 'total',
      label: 'Total Rating Points',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Sum of all rating points',
        readOnly: true,
      },
    },
    {
      name: 'count',
      label: 'Rating Count',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Number of ratings received',
        readOnly: true,
      },
    },
    {
      name: 'average',
      label: 'Average Rating',
      type: 'number',
      admin: {
        description: 'Average rating (0-5)',
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ siblingData }) => {
            const total = siblingData?.total || 0
            const count = siblingData?.count || 0
            
            if (count > 0) {
              return parseFloat((total / count).toFixed(1))
            }
            return 0
          },
        ],
      },
    },
  ],
}
```

### 2.2. Extend UserChallengeProgression Collection

Add rating fields to `UserChallengeProgression` collection:

```typescript
// Add inside the fields array of the UserChallengeProgression collection
{
  name: 'rating',
  type: 'number',
  min: 1,
  max: 5,
  admin: {
    description: 'User rating for this challenge (1-5)',
  },
}
```

### 2.3. Create Rating Functions

Add rating functions to `src/core/challenges/index.ts`:

```typescript
export const addRatingToChallenge = async (slug: string, rating: number): Promise<void> => {
  const payload = await getPayload({ config })
  const challenge = await getPayloadChallenge(slug)
  
  const currentTotal = challenge.ratings?.total || 0
  const currentCount = challenge.ratings?.count || 0
  
  await payload.update({
    collection: 'challenges',
    where: {
      slug: {
        equals: slug,
      },
    },
    data: {
      ratings: {
        total: currentTotal + rating,
        count: currentCount + 1,
        // average will be calculated automatically by the hook
      },
    },
  })
}

export const updateRatingForChallenge = async (
  slug: string, 
  oldRating: number, 
  newRating: number
): Promise<void> => {
  const payload = await getPayload({ config })
  const challenge = await getPayloadChallenge(slug)
  
  const currentTotal = challenge.ratings?.total || 0
  
  await payload.update({
    collection: 'challenges',
    where: {
      slug: {
        equals: slug,
      },
    },
    data: {
      ratings: {
        total: (currentTotal - oldRating) + newRating,
        // Count stays the same since we're updating an existing rating
        count: challenge.ratings?.count || 0,
        // average will be calculated automatically by the hook
      },
    },
  })
}
```

Add server action for rating in `src/app/actions/challenge-actions.ts`:

```typescript
export async function rateChallenge(challengeSlug: string, rating: number) {
  const session = await getUserSession()
  if (!session?.userId) {
    throw new Error('Authentication required')
  }

  const userId = session.userId
  const progression = await getUserChallengeProgression(userId, challengeSlug)

  if (progression?.rating) {
    // User has already rated, update the rating
    await updateRatingForChallenge(challengeSlug, progression.rating, rating)
  } else {
    // User hasn't rated yet, add a new rating
    await addRatingToChallenge(challengeSlug, rating)
  }

  // Update user progression
  await updateUserChallengeProgression(userId, challengeSlug, {
    rating,
  })
}
```

## 3. Dynamic Challenge Information Components

Create components for displaying challenge information:

### 3.1 ChallengeDifficulty Component

```typescript
// src/components/challenges/challenge-difficulty.tsx
import { Badge } from '@/components/ui/badge'

interface ChallengeDifficultyProps {
  difficulty: 'easy' | 'medium' | 'hard' | 'horrible'
}

export function ChallengeDifficulty({ difficulty }: ChallengeDifficultyProps) {
  const getColorByDifficulty = () => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 hover:bg-green-100'
      case 'medium':
        return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
      case 'hard':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-100'
      case 'horrible':
        return 'bg-red-100 text-red-800 hover:bg-red-100'
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100'
    }
  }

  return (
    <Badge variant="outline" className={`${getColorByDifficulty()} capitalize`}>
      {difficulty}
    </Badge>
  )
}
```

### 3.2 ChallengeExperience Component

```typescript
// src/components/challenges/challenge-experience.tsx
import { Trophy } from 'lucide-react'

interface ChallengeExperienceProps {
  experience: number
}

export function ChallengeExperience({ experience }: ChallengeExperienceProps) {
  return (
    <div className="flex items-center gap-1.5 text-sm font-medium text-amber-600">
      <Trophy size={16} className="text-amber-500" />
      <span>{experience} XP</span>
    </div>
  )
}
```

### 3.3 ChallengeConcepts Component

```typescript
// src/components/challenges/challenge-concepts.tsx
import { Badge } from '@/components/ui/badge'

interface ChallengeConceptsProps {
  concepts: string[]
}

export function ChallengeConcepts({ concepts }: ChallengeConceptsProps) {
  if (!concepts || concepts.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-1.5">
      {concepts.map((concept, index) => (
        <Badge key={index} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
          {concept}
        </Badge>
      ))}
    </div>
  )
}
```

## 4. AI Assistant Dialog Implementation

Create an AI assistant dialog component:

```typescript
// src/components/challenges/ai-assistant-dialog.tsx
'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { MessageSquareText, Bot, SendHorizontal } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

interface AIAssistantDialogProps {
  challengeSlug: string
}

export function AIAssistantDialog({ challengeSlug }: AIAssistantDialogProps) {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setIsLoading(true)
    
    // Here you would typically call a server action or API to send the message
    // For now, let's just simulate a delay
    setTimeout(() => {
      setIsLoading(false)
      setMessage('')
      // In a real implementation, you would handle the response
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full flex items-center gap-2 h-10">
          <Bot size={18} />
          <span>Ask AI Assistant</span>
          <MessageSquareText className="ml-auto" size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot size={18} /> AI Assistant
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto p-4 border rounded-md my-4 bg-muted/30">
          {/* Chat messages would be displayed here */}
          <div className="text-center text-muted-foreground pt-20">
            Ask the AI assistant for help with this challenge.
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask a question..."
            className="resize-none min-h-[60px]"
          />
          <Button type="submit" disabled={isLoading || !message.trim()} className="self-end">
            <SendHorizontal size={18} />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

## 5. Back to Challenges Button

This is already implemented in the layout, but needs to be updated with the correct URL:

```typescript
// In src/app/(frontend)/(dashboard)/challenges/[challenge_slug]/layout.tsx
<Button
  asChild
  variant="outline"
  className="h-9 px-3 py-1.5 text-sm"
  aria-label="Back to challenges"
>
  <Link href="/challenges" prefetch={true}>
    Challenges
  </Link>
</Button>
```

## 6. Previous and Next Challenge Navigation

Implement navigation functions in `src/core/challenges/index.ts`:

```typescript
export const getPreviousChallenge = async (slug: string): Promise<Challenge> => {
  const payload = await getPayload({ config })
  
  // Get all challenges sorted by creation date
  const challenges = await payload.find({
    collection: 'challenges',
    sort: 'createdAt',
  })
  
  const docs = challenges.docs
  
  // Find the index of the current challenge
  const currentIndex = docs.findIndex(challenge => challenge.slug === slug)
  
  if (currentIndex <= 0) {
    // If it's the first challenge or not found, return the last challenge (circular navigation)
    return docs[docs.length - 1]
  }
  
  // Return the previous challenge
  return docs[currentIndex - 1]
}

export const getNextChallenge = async (slug: string): Promise<Challenge> => {
  const payload = await getPayload({ config })
  
  // Get all challenges sorted by creation date
  const challenges = await payload.find({
    collection: 'challenges',
    sort: 'createdAt',
  })
  
  const docs = challenges.docs
  
  // Find the index of the current challenge
  const currentIndex = docs.findIndex(challenge => challenge.slug === slug)
  
  if (currentIndex === -1 || currentIndex === docs.length - 1) {
    // If it's the last challenge or not found, return the first challenge (circular navigation)
    return docs[0]
  }
  
  // Return the next challenge
  return docs[currentIndex + 1]
}
```

Implement the navigation buttons component:

```typescript
// src/app/(frontend)/(dashboard)/challenges/[challenge_slug]/components/challenges-navigation-buttons.tsx
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, Shuffle } from 'lucide-react'
import Link from 'next/link'
import { getPreviousChallenge, getNextChallenge, getRandomChallenge } from '@/core/challenges'

interface ChallengesNavigationButtonsProps {
  challengeSlug: string
}

export async function ChallengesNavigationButtons({ challengeSlug }: ChallengesNavigationButtonsProps) {
  const previousChallenge = await getPreviousChallenge(challengeSlug)
  const nextChallenge = await getNextChallenge(challengeSlug)
  
  return (
    <>
      <Button
        asChild
        variant="outline"
        className="rounded-r-none border-r-0 px-3"
        aria-label="Previous challenge"
      >
        <Link href={`/challenges/${previousChallenge.slug}`} prefetch={true}>
          <ArrowLeft size={16} />
        </Link>
      </Button>
      <RandomChallengeButton currentSlug={challengeSlug} />
      <Button
        asChild
        variant="outline"
        className="rounded-l-none border-l-0 px-3"
        aria-label="Next challenge"
      >
        <Link href={`/challenges/${nextChallenge.slug}`} prefetch={true}>
          <ArrowRight size={16} />
        </Link>
      </Button>
    </>
  )
}

// This needs to be a separate client component since it uses a random redirect
'use client'

interface RandomChallengeButtonProps {
  currentSlug: string
}

function RandomChallengeButton({ currentSlug }: RandomChallengeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleClick = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/challenges/random?current=${currentSlug}`)
      const data = await response.json()
      
      // Navigate to the random challenge
      window.location.href = `/challenges/${data.slug}`
    } catch (error) {
      console.error('Error getting random challenge:', error)
      setIsLoading(false)
    }
  }
  
  return (
    <Button
      variant="outline"
      className="rounded-none border-x-0 px-3"
      aria-label="Random challenge"
      onClick={handleClick}
      disabled={isLoading}
    >
      <Shuffle size={16} />
    </Button>
  )
}
```

## 7. Random Challenge Function

Implement random challenge function in `src/core/challenges/index.ts`:

```typescript
export const getRandomChallenge = async (excludeSlug?: string): Promise<Challenge> => {
  const payload = await getPayload({ config })
  
  // Get all challenges
  const challenges = await payload.find({
    collection: 'challenges',
    limit: 100, // Set a reasonable limit
  })
  
  let availableChallenges = challenges.docs
  
  // Exclude the current challenge if provided
  if (excludeSlug) {
    availableChallenges = availableChallenges.filter(challenge => challenge.slug !== excludeSlug)
  }
  
  if (availableChallenges.length === 0) {
    throw new Error('No challenges available')
  }
  
  // Select a random challenge
  const randomIndex = Math.floor(Math.random() * availableChallenges.length)
  return availableChallenges[randomIndex]
}
```

Create an API route for getting a random challenge:

```typescript
// src/app/api/challenges/random/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getRandomChallenge } from '@/core/challenges'

export async function GET(request: NextRequest) {
  const currentSlug = request.nextUrl.searchParams.get('current')
  
  try {
    const challenge = await getRandomChallenge(currentSlug || undefined)
    return NextResponse.json({
      slug: challenge.slug,
      title: challenge.title,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get random challenge' }, { status: 500 })
  }
}
```

## Implementation Plan and Next Steps

1. **Database Collections**:
   - Create UserChallengeProgression collection
   - Update Challenges collection with rating fields

2. **Core Functions**:
   - Implement user progression functions
   - Implement challenge navigation functions
   - Implement challenge rating functions

3. **UI Components**:
   - Create LikeButton and DislikeButton components
   - Create challenge information display components
   - Implement AI assistant dialog
   - Implement navigation buttons

4. **Server Actions**:
   - Implement like/dislike actions
   - Implement rating action

5. **Integration**:
   - Update challenge layout with new components
   - Connect client components to server actions
   - Update PayloadCMS config to include the new collection

## Testing Strategy

1. Test database functions with mock data
2. Test UI components in isolation
3. Test integration of components with server actions
4. End-to-end testing of complete features

## Future Enhancements

1. Add analytics for challenge engagement
2. Implement user notifications for challenge interactions
3. Create leaderboards based on user progression
4. Expand AI assistant capabilities for specific challenge help 