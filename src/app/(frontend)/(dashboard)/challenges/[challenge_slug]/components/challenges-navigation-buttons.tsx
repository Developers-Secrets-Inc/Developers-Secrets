'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { ArrowLeft, ArrowRight, List, Shuffle } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'
import { useRouter } from 'next/navigation'

/**
 * Composant personnalisé pour le contenu des tooltips sans le losange (arrow)
 * Cette version simplifiée offre un design plus épuré sans la flèche pointant vers l'élément déclencheur
 * On a fait ça car le losange reste en couleur primaire, qui est verte.
 */
function TooltipContentCustom({
  className,
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          'bg-background text-foreground border animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-w-sm rounded-md px-3 py-1.5 text-xs',
          className,
        )}
        {...props}
      >
        {children}
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

/**
 * Type pour les propriétés du bouton de navigation
 */
type NavigationButtonProps = {
  href: string
  icon: React.ReactNode
  label: string
  tooltipText: string
  showText?: boolean
}

/**
 * Composant réutilisable pour les boutons de navigation
 */
const NavigationButton: React.FC<NavigationButtonProps> = ({
  href,
  icon,
  label,
  tooltipText,
  showText = false,
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            asChild
            className={cn(
              'rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10',
              showText ? 'flex items-center gap-2 px-2.5 py-1.5 h-9 text-sm' : 'h-9 w-9 p-0',
            )}
            variant="outline"
            aria-label={label}
          >
            <Link href={href}>
              {icon}
              {showText && <span>{label}</span>}
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContentCustom side="bottom">{tooltipText}</TooltipContentCustom>
      </Tooltip>
    </TooltipProvider>
  )
}

/**
 * Configuration des boutons de navigation
 */
const navigationButtons = [
  {
    href: '/challenges',
    icon: <List size={15} aria-hidden="true" />,
    label: 'Challenges',
    tooltipText: 'All challenges',
    showText: true,
  },
  {
    href: '#',
    icon: <ArrowLeft size={15} aria-hidden="true" />,
    label: 'Previous challenge',
    tooltipText: 'Previous challenge',
  },
  {
    href: '#',
    icon: <ArrowRight size={15} aria-hidden="true" />,
    label: 'Next challenge',
    tooltipText: 'Next challenge',
  },
  {
    href: '#',
    icon: <Shuffle size={15} aria-hidden="true" />,
    label: 'Random challenge',
    tooltipText: 'Random challenge',
  },
]

interface ChallengesNavigationButtonsProps {
  challengeSlug: string
  previousChallengeSlug: string
  nextChallengeSlug: string
}

export function ChallengesNavigationButtons({
  challengeSlug,
  previousChallengeSlug,
  nextChallengeSlug,
}: ChallengesNavigationButtonsProps) {
  return (
    <>
      <Button
        asChild
        variant="outline"
        className="rounded-r-none border-r-0 px-3"
        aria-label="Previous challenge"
      >
        <Link href={`/challenges/${previousChallengeSlug}`} prefetch={true}>
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
        <Link href={`/challenges/${nextChallengeSlug}`} prefetch={true}>
          <ArrowRight size={16} />
        </Link>
      </Button>
    </>
  )
}

// This needs to be a separate client component since it uses a random redirect
interface RandomChallengeButtonProps {
  currentSlug: string
}

function RandomChallengeButton({ currentSlug }: RandomChallengeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleClick = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/challenges/random?current=${currentSlug}`)
      const data = await response.json()

      // Navigate to the random challenge
      router.push(`/challenges/${data.slug}`)
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
