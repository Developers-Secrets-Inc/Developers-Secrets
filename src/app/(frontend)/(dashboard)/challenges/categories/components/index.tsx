import {
  ChallengeCategoryPartWithPopulatedChallenges,
  ChallengeCategoryWithPopulatedChallenges,
} from '@/api/challenges/categories'
import { ChallengeCategoryTable } from '@/api/challenges/categories/components/challenge-category-table'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'

const ChallengeContainerHeader = () => {
  return (
    <div className="mb-8 py-2 pr-8 pl-4 border-b border-border">
      <Link
        href="/challenges"
        className={cn(buttonVariants({ variant: 'ghost' }), 'gap-2 pl-2 pr-4')}
      >
        <ChevronLeftIcon className="h-4 w-4" />
        Back to Challenges
      </Link>
    </div>
  )
}

const ChallengeContainerBody = ({ children }: { children: React.ReactNode }) => {
  return <div className="max-w-5xl mx-auto grid grid-cols-12 gap-6">{children}</div>
}

const ChallengeCategoryContainer = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

const ChallengeCategoryTableSection = ({
  parts,
}: {
  parts: ChallengeCategoryPartWithPopulatedChallenges[]
}) => {
  return (
    <div className="col-span-8 space-y-8">
      {parts?.map((part, index) => (
        <div key={part.id ?? `${part.name}-${index}`} className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">
              Part {index + 1}: {part.name}
            </h2>
            {part.description && <p className="text-muted-foreground mt-2">{part.description}</p>}
          </div>
          <ChallengeCategoryTable challenges={part.challenges} />
        </div>
      ))}
    </div>
  )
}

const ChallengeCategoryInformationsSection = ({
  category,
  completionPercent,
}: {
  category: ChallengeCategoryWithPopulatedChallenges
  completionPercent: number
}) => {
  return (
    <div className="col-span-4 space-y-6">
      {/* Category Information */}
      <div>
        <h1 className="text-2xl font-semibold mb-2">{category.name}</h1>
        {/* Affichage de la progression */}
        <div className="mb-2">
          <span className="font-semibold">Progression :</span> <span>{completionPercent}%</span>
        </div>
        {category.summary && <p className="text-muted-foreground mb-6">{category.summary}</p>}

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium mb-2">About this category</h2>
            <p className="text-muted-foreground">{category.description}</p>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">{category.parts?.length || 0}</span>{' '}
              part{(category.parts?.length || 0) !== 1 ? 's' : ''}
            </div>
            <div>
              <span className="font-medium text-foreground">
                {category.parts?.reduce((acc, part) => acc + part.challenges.length, 0) || 0}
              </span>{' '}
              challenge
              {(category.parts?.reduce((acc, part) => acc + part.challenges.length, 0) || 0) !== 1
                ? 's'
                : ''}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const ChallengeCategory = {
  Container: ChallengeCategoryContainer,
  Body: ChallengeContainerBody,
  Header: ChallengeContainerHeader,
  TableSection: ChallengeCategoryTableSection,
  InformationsSection: ChallengeCategoryInformationsSection,
}
