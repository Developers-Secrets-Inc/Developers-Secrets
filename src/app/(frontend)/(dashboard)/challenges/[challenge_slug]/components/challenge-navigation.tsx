'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { FileText, Award, Users, ListChecks } from 'lucide-react'
import { useEffect } from 'react'

export function ChallengeNavigation({ challengeSlug }: { challengeSlug: string }) {
  const pathname = usePathname()
  const router = useRouter()

  const tabs = [
    {
      name: 'Description',
      href: `/challenges/${challengeSlug}/description`,
      icon: FileText,
      current: pathname === `/challenges/${challengeSlug}/description`,
    },
    {
      name: 'Official Solution',
      href: `/challenges/${challengeSlug}/official-solution`,
      icon: Award,
      current: pathname === `/challenges/${challengeSlug}/official-solution`,
    },
    {
      name: 'Solutions',
      href: `/challenges/${challengeSlug}/solutions`,
      icon: Users,
      current: pathname.startsWith(`/challenges/${challengeSlug}/solutions`),
    },
    {
      name: 'Submissions',
      href: `/challenges/${challengeSlug}/submissions`,
      icon: ListChecks,
      current: pathname.startsWith(`/challenges/${challengeSlug}/submissions`),
    },
  ]

  // Précharger toutes les routes immédiatement au chargement
  useEffect(() => {
    tabs.forEach((tab) => {
      if (!tab.current) {
        // Utiliser l'API publique de préchargement
        router.prefetch(tab.href)
      }
    })
  }, [tabs, router])

  return (
    <div className="border-b">
      <div className="flex justify-start w-full rounded-none bg-background">
        {tabs.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            prefetch={true}
            className={cn(
              'relative overflow-hidden rounded-none border py-2 flex-1 flex items-center justify-center gap-1.5',
              tab.current
                ? 'bg-muted after:bg-primary after:absolute after:pointer-events-none after:inset-x-0 after:bottom-0 after:h-0.5'
                : '',
            )}
          >
            <tab.icon className="-ms-0.5 me-1.5 opacity-60" size={16} aria-hidden="true" />
            {tab.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
