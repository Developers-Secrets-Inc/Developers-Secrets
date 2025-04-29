'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import {
  BinaryIcon,
  BrainCircuitIcon,
  CodeIcon,
  DatabaseIcon,
  GanttChartIcon,
  LayoutDashboardIcon, // Nouvelle icône pour les parcours
  LucideIcon,
  PlusIcon,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

// --- Données Factices ---
interface DummyLearningPath {
  id: number
  name: string
  description: string
  slug: string // Pour lier à une icône et une URL future
  courseCount: number
  isLocked?: boolean
}

const dummyLearningPaths: DummyLearningPath[] = [
  {
    id: 1,
    name: 'Python Fundamentals',
    description: 'Master the basics of Python programming.',
    slug: 'python',
    courseCount: 5,
  },
  {
    id: 2,
    name: 'Web Development Intro',
    description: 'Build your first websites with HTML, CSS, and JS.',
    slug: 'web-dev',
    courseCount: 8,
    isLocked: false,
  },
  {
    id: 3,
    name: 'Data Structures & Algorithms',
    description: 'Understand core computer science concepts.',
    slug: 'algorithms',
    courseCount: 6,
    isLocked: true,
  },
  {
    id: 4,
    name: 'Database Essentials',
    description: 'Learn SQL and database design principles.',
    slug: 'database',
    courseCount: 4,
  },
  {
    id: 5,
    name: 'Advanced Backend',
    description: 'Deep dive into backend technologies.',
    slug: 'backend',
    courseCount: 7,
    isLocked: true,
  },
]

// --- Icônes ---
const iconMap: Record<string, LucideIcon> = {
  python: BrainCircuitIcon,
  'web-dev': CodeIcon,
  algorithms: GanttChartIcon,
  database: DatabaseIcon,
  backend: BinaryIcon,
  default: LayoutDashboardIcon, // Icône par défaut pour les parcours
}

// --- Interface pour les Props du Composant Principal ---
interface LearningPathCarouselProps {
  maxItems?: number // Rendre la prop optionnelle
}

// --- Composants Internes (adaptés de ChallengeCategories) ---

function LearningPathSkeleton() {
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

function NoLearningPathsCard() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="rounded-full bg-primary/10 p-3">
        <PlusIcon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mt-4 font-semibold">No Learning Paths Available</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Learning Paths will be added soon. Check back later!
      </p>
    </div>
  )
}

function LearningPathCard({ path }: { path: DummyLearningPath }) {
  const Icon = iconMap[path.slug] || iconMap.default
  const isLocked = path.isLocked ?? false

  const cardContent = (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-md bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <span className="text-sm text-muted-foreground">
            {path.courseCount} {path.courseCount === 1 ? 'course' : 'courses'}
          </span>
        </div>
        <h3 className="font-semibold leading-none tracking-tight">{path.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{path.description}</p>
      </div>
      {isLocked && <div className="absolute inset-0 bg-black/10 backdrop-blur-sm" />}
    </>
  )

  if (isLocked) {
    return (
      <div
        className={cn(
          'group relative overflow-hidden rounded-lg border bg-background/50 p-4',
          'cursor-not-allowed opacity-75',
        )}
      >
        {cardContent}
      </div>
    )
  }

  return (
    // Utiliser un lien placeholder pour le moment
    <Link
      href="#" // Remplacer par le vrai lien plus tard, ex: `/learning-paths/${path.slug}`
      className={cn(
        'group relative overflow-hidden rounded-lg border bg-background/50 p-4',
        'hover:border-primary/50 transition-colors',
      )}
    >
      {cardContent}
    </Link>
  )
}

function LearningPathsList({ maxItems }: { maxItems?: number }) {
  // Accepter maxItems
  const paths = dummyLearningPaths

  if (!paths?.length) {
    return <NoLearningPathsCard />
  }

  const sortedPaths = [...paths].sort((a, b) => {
    const isLockedA = a.isLocked ?? false
    const isLockedB = b.isLocked ?? false
    return isLockedA === isLockedB ? 0 : isLockedA ? 1 : -1
  })

  // Limiter le nombre d'éléments si maxItems est défini
  const displayedPaths = maxItems ? sortedPaths.slice(0, maxItems) : sortedPaths

  return (
    <>
      {displayedPaths.map((path) => (
        <LearningPathCard key={path.id} path={path} />
      ))}
    </>
  )
}

// --- Composant Principal Exporté ---
export function LearningPathCarousel({ maxItems }: LearningPathCarouselProps) {
  // Accepter maxItems ici aussi
  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight mb-4">Learning Paths</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Passer maxItems à LearningPathsList */}
        <LearningPathsList maxItems={maxItems} />
      </div>
    </div>
  )
}
