import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ListChecksIcon,
  SendIcon,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface Concept {
  id: string
  name: string
  masteryPercentage: number
  remainingTopics?: string[]
  isCurrent: boolean
}

interface LearningPath {
  id: string
  title: string
  concepts: Concept[]
}

const dummyLearningPaths: LearningPath[] = [
  {
    id: 'path-python',
    title: 'Fondamentaux de Python',
    concepts: [
      { id: 'py-vars', name: 'Variables & Types', masteryPercentage: 100, isCurrent: false },
      {
        id: 'py-cond',
        name: 'Structures Conditionnelles',
        masteryPercentage: 70,
        isCurrent: true,
        remainingTopics: ['`if/else` imbriqués', 'Utilisation de `elif`'],
      },
      { id: 'py-loops', name: 'Boucles (`for`, `while`)', masteryPercentage: 15, isCurrent: false },
      { id: 'py-funcs', name: 'Fonctions', masteryPercentage: 0, isCurrent: false },
    ],
  },
  {
    id: 'path-react',
    title: 'React Hooks Essentiels',
    concepts: [
      { id: 'react-state', name: 'useState', masteryPercentage: 100, isCurrent: false },
      {
        id: 'react-effect',
        name: 'useEffect',
        masteryPercentage: 40,
        isCurrent: true,
        remainingTopics: ['Cleanup function', 'Dependency array pitfalls'],
      },
      { id: 'react-context', name: 'useContext', masteryPercentage: 0, isCurrent: false },
    ],
  },
  {
    id: 'path-css',
    title: 'Layout CSS Moderne',
    concepts: [
      { id: 'css-flex', name: 'Flexbox', masteryPercentage: 90, isCurrent: false },
      {
        id: 'css-grid',
        name: 'CSS Grid',
        masteryPercentage: 60,
        isCurrent: true,
        remainingTopics: ['grid-template-areas', 'minmax() function'],
      },
      { id: 'css-resp', name: 'Responsive Design', masteryPercentage: 20, isCurrent: false },
    ],
  },
]

function LearningPathCard({ path }: { path: LearningPath }) {
  const currentConceptIndex = path.concepts.findIndex((c) => c.isCurrent)
  const currentConcept = currentConceptIndex !== -1 ? path.concepts[currentConceptIndex] : null
  const prevConcept = currentConceptIndex > 0 ? path.concepts[currentConceptIndex - 1] : null
  const nextConcept =
    currentConceptIndex !== -1 && currentConceptIndex < path.concepts.length - 1
      ? path.concepts[currentConceptIndex + 1]
      : null

  // Dummy slug for the next challenge link
  const nextChallengeSlug = `concept-${currentConcept?.id ?? 'start'}`

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>{path.title}</CardTitle>
        {currentConcept && (
          <CardDescription>Concept actuel : {currentConcept.name}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        {currentConcept ? (
          <>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Maîtrise du concept</span>
                <span className="text-sm text-muted-foreground">
                  {currentConcept.masteryPercentage}%
                </span>
              </div>
              <Progress value={currentConcept.masteryPercentage} className="h-2" />
            </div>
            {currentConcept.remainingTopics && currentConcept.remainingTopics.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-1.5 flex items-center gap-1.5">
                  <ListChecksIcon className="h-4 w-4" /> À voir ensuite :
                </h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground pl-2">
                  {currentConcept.remainingTopics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Parcours terminé ou non commencé.</p>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-3 pt-4 border-t">
        <div className="flex justify-between w-full text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <ChevronLeftIcon className="h-3 w-3" />{' '}
            {prevConcept ? prevConcept.name : 'Début du parcours'}
          </span>
          <span className="flex items-center gap-1">
            {nextConcept ? nextConcept.name : 'Fin du parcours'}{' '}
            <ChevronRightIcon className="h-3 w-3" />
          </span>
        </div>
        {currentConcept && (
          <Button asChild className="w-full" size="sm">
            {/* Replace '#' with a link to the actual next challenge/learning page */}
            <Link href={`/challenges/${nextChallengeSlug}`}>
              <SendIcon className="h-4 w-4 mr-2" />
              Continuer l&apos;apprentissage
            </Link>
          </Button>
        )}
        {!currentConcept && path.concepts.length > 0 && (
          <Button asChild className="w-full" size="sm" variant="secondary">
            {/* Replace '#' with a link to the path overview page */}
            <Link href="#">
              <CheckIcon className="h-4 w-4 mr-2" />
              Parcours terminé
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export function LearningPathCarousel() {
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="w-full max-w-[800px] mx-auto"
    >
      <CarouselContent>
        {dummyLearningPaths.map((path) => (
          <CarouselItem key={path.id}>
            <div className="p-1 h-full">
              <LearningPathCard path={path} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      {/* Position buttons top-right above the card, styled as a group */}
      <div className="absolute top-[-1rem] right-0 inline-flex -space-x-px">
        <CarouselPrevious
          className="relative left-auto top-auto right-auto bottom-auto rounded-none rounded-l-md focus-visible:z-10 shadow-none"
          variant="outline"
          size="icon"
        />
        <CarouselNext
          className="relative left-auto top-auto right-auto bottom-auto rounded-none rounded-r-md focus-visible:z-10 shadow-none"
          variant="outline"
          size="icon"
        />
      </div>
    </Carousel>
  )
}
