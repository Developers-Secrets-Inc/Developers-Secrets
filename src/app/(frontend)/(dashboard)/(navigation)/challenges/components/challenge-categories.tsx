import {
  BinaryIcon,
  BrainCircuitIcon,
  CodeIcon,
  DatabaseIcon,
  GanttChartIcon,
  LockIcon,
  PlusIcon,
  ShieldCheckIcon,
} from 'lucide-react'
import Link from 'next/link'
import { getChallengeCategories } from '@/api/challenges/categories'
import { Skeleton } from '@/components/ui/skeleton'
import { Suspense } from 'react'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'

const iconMap = {
  oop: CodeIcon,
  python: BrainCircuitIcon,
  algorithms: GanttChartIcon,
  database: DatabaseIcon,
  'web-security': ShieldCheckIcon,
  binary: BinaryIcon,
} as const

type IconKey = keyof typeof iconMap

interface Challenge {
  id: number
}

interface CategoryPart {
  name: string
  description?: string | null
  challenges: (number | Challenge)[]
  id?: string | null
}

interface Category {
  id: number
  name: string
  description: string
  slug: string
  isLocked?: boolean | null
  parts?: CategoryPart[] | null
}

function CategorySkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="rounded-lg border bg-background/50 p-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-10" />
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

function NoCategoriesCard() {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="rounded-full bg-primary/10 p-3">
        <PlusIcon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mt-4 font-semibold">No Categories Available</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Challenge categories will be added soon. Check back later!
      </p>
    </div>
  )
}

function CategoryCard({ category }: { category: Category }) {
  const Icon = iconMap[category.slug as IconKey] || CodeIcon
  const totalChallenges =
    category.parts?.reduce((acc: number, part: CategoryPart) => acc + part.challenges.length, 0) ||
    0

  const isLocked = category.isLocked ?? false
  const cardContent = (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="p-2 rounded-md bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <div className="flex items-center gap-2">
            {isLocked && <LockIcon className="h-4 w-4 text-muted-foreground" />}
            <span className="text-sm text-muted-foreground">
              {totalChallenges} {totalChallenges === 1 ? 'challenge' : 'challenges'}
            </span>
          </div>
        </div>
        <h3 className="font-semibold leading-none tracking-tight">{category.name}</h3>
        <p className="text-sm text-muted-foreground">{category.description}</p>
      </div>
      {isLocked && <div className="absolute inset-0 bg-background/10" />}
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
    <Link
      href={`/challenges/categories/${category.slug}`}
      className={cn(
        'group relative overflow-hidden rounded-lg border bg-background/50 p-4',
        'hover:border-primary/50 transition-colors',
      )}
    >
      {cardContent}
    </Link>
  )
}

async function CategoriesList() {
  const categories = await getChallengeCategories()

  if (!categories?.length) {
    return <NoCategoriesCard />
  }

  // Trier les catégories : non verrouillées d'abord, puis verrouillées
  const sortedCategories = [...categories].sort((a, b) => {
    const isLockedA = a.isLocked ?? false
    const isLockedB = b.isLocked ?? false
    return isLockedA === isLockedB ? 0 : isLockedA ? 1 : -1
  })

  return (
    <>
      {sortedCategories.map((category) => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </>
  )
}

export function ChallengeCategories() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      <Suspense fallback={<CategorySkeleton />}>
        <CategoriesList />
      </Suspense>
    </div>
  )
}
