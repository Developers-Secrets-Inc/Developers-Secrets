'use client'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { LearningPath } from '@/payload-types'
import {
  BinaryIcon,
  BrainCircuitIcon,
  CodeIcon,
  LayoutDashboardIcon, // Nouvelle icône pour les parcours
  LockIcon,
  LucideIcon,
} from 'lucide-react'
import Link from 'next/link'
import { AlertTriangleIcon } from 'lucide-react'

// --- Icônes ---
const iconMap: Record<string, LucideIcon> = {
  'python-backend': BinaryIcon, // Using BinaryIcon for backend
  'react-frontend': CodeIcon, // Using CodeIcon for frontend
  'software-engineering': BrainCircuitIcon, // Using BrainCircuitIcon for software engineering principles
  default: LayoutDashboardIcon, // Icône par défaut pour les parcours
}

// --- Interface pour les Props du Composant Principal ---

export const LearningPathSkeleton = () => {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border bg-background/50 p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-10 rounded-md" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
      ))}
    </>
  )
}

export const NoLearningPathsCard = () => {
  return (
    <Card className="col-span-full border-dashed relative">
      <AlertTriangleIcon className="absolute top-2 right-2 text-yellow-500 h-5 w-5 opacity-40" />
      <CardHeader className="flex flex-col items-center justify-center text-center">
        <CardTitle className="font-semibold">No Learning Paths Available</CardTitle>
        <CardDescription className="mt-2 text-sm text-muted-foreground">
          Learning Paths will be added soon. Check back later!
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

export const LearningPathCard = ({ path }: { path: LearningPath }) => {
  const Icon = iconMap[path.slug] || iconMap.default
  const coursesCount = path.sections.reduce((acc, section) => acc + section.courses.length, 0)

  return (
    <Link href={`/learning-paths/${path.slug}`} className="group">
      <Card className="relative overflow-hidden border bg-background/50 p-4 hover:border-primary/50 transition-colors">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-md bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {coursesCount} {coursesCount === 1 ? 'course' : 'courses'}
            </span>
          </div>
        </div>
        <h3 className="font-semibold leading-none tracking-tight">{path.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{path.description}</p>
      </div>
      </Card>
    </Link>
  )
}
