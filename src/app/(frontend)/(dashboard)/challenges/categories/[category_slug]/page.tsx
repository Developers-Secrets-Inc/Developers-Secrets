import { HomeSidebar } from '@/components/sidebars/home-sidebar/home-sidebar'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { getCategoryBySlug, getSimilarCategories } from '@/core/challenges/categories'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { TypographyH1, TypographyP } from '@/components/typography'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { CircleDotIcon, CheckCircle2Icon, ArrowRightIcon, ChevronLeftIcon } from 'lucide-react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { getSessionUser } from '@/core/user'
import { getUserCompletionStatus } from '@/core/challenges/user-progression'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { buttonVariants } from '@/components/ui/button'
import { getChallengeCategoryBySlug } from '@/api/challenges/categories'

type Difficulty = 'very_easy' | 'easy' | 'medium' | 'hard' | 'horrible'
type CompletionStatus = 'not_started' | 'in_progress' | 'completed'

interface Challenge {
  id: number
  title: string
  slug: string
  difficulty: Difficulty
  baseExperience: number
  status?: CompletionStatus
}

const difficultyStyles: Record<Difficulty, string> = {
  very_easy: 'bg-cyan-500/10 text-cyan-500',
  easy: 'bg-emerald-500/10 text-emerald-500',
  medium: 'bg-amber-500/10 text-amber-500',
  hard: 'bg-red-500/10 text-red-500',
  horrible: 'bg-purple-500/10 text-purple-500',
}

function StatusIcon({ status }: { status: CompletionStatus }) {
  if (status === 'not_started') return null

  return (
    <div className="w-8">
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className="flex items-center justify-center">
              {status === 'in_progress' ? (
                <CircleDotIcon className="h-4 w-4 text-amber-500" />
              ) : (
                <CheckCircle2Icon className="h-4 w-4 text-emerald-500" />
              )}
            </div>
          </Tooltip.Trigger>
          <TooltipContentCustom sideOffset={2} align="center">
            {status === 'in_progress' ? 'In Progress' : 'Completed'}
          </TooltipContentCustom>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  )
}

function ChallengeRow({ challenge }: { challenge: Challenge }) {
  return (
    <TableRow>
      <TableCell>
        <StatusIcon status={challenge.status || 'not_started'} />
      </TableCell>
      <TableCell>
        <Link href={`/challenges/${challenge.slug}`} className="font-medium hover:underline">
          {challenge.title}
        </Link>
      </TableCell>
      <TableCell>
        <Badge className={cn(difficultyStyles[challenge.difficulty])} variant="secondary">
          {challenge.difficulty === 'very_easy' ? 'Very Easy' : challenge.difficulty.charAt(0).toUpperCase() + challenge.difficulty.slice(1)}
        </Badge>
      </TableCell>
      <TableCell>
        <span className="font-medium">{challenge.baseExperience} XP</span>
      </TableCell>
    </TableRow>
  )
}

function LoadingRow({ id }: { id: number }) {
  return (
    <TableRow>
      <TableCell colSpan={4} className="text-center text-muted-foreground">
        Loading challenge {id}...
      </TableCell>
    </TableRow>
  )
}

export default async function Page({ params }: { params: Promise<{ category_slug: string }> }) {
  const { category_slug } = await params
  const sessionResult = await getSessionUser()
  const category = await getChallengeCategoryBySlug(category_slug)
  const similarCategories = await getSimilarCategories(category_slug)

  if (!category || category.isLocked) {
    return <div>Category not found</div>
  }

  return (
    <SidebarProvider>
      <HomeSidebar />
      <SidebarInset>
        <HomeHeader />
        <div className="py-6 max-w-5xl mx-auto">
          <div className="mb-8">
            <Link
              href="/challenges"
              className={cn(buttonVariants({ variant: 'ghost' }), 'gap-2 pl-2 pr-4')}
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Back to Challenges
            </Link>
          </div>

          <div className="grid grid-cols-12 gap-6">
            {/* Table Section - 8 columns */}
            <div className="col-span-8 space-y-8">
              {category.parts?.map(async (part, index) => {
                return (
                  <div key={part.id} className="space-y-4">
                    <div>
                      <h2 className="text-2xl font-semibold">
                        Part {index + 1}: {part.name}
                      </h2>
                      {part.description && (
                        <p className="text-muted-foreground mt-2">{part.description}</p>
                      )}
                    </div>

                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="w-8"></TableHead>
                            <TableHead>Challenge</TableHead>
                            <TableHead>Difficulty</TableHead>
                            <TableHead>Experience</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {part.challenges.map((challenge) => {
                            if (typeof challenge === 'number') {
                              return <LoadingRow key={challenge} id={challenge} />
                            }
                            return <ChallengeRow key={challenge.id} challenge={challenge} />
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Right Sidebar - 4 columns */}
            <div className="col-span-4 space-y-6">
              {/* Category Information */}
              <div>
                <h1 className="text-2xl font-semibold mb-2">{category.name}</h1>
                {category.summary && (
                  <p className="text-muted-foreground mb-6">{category.summary}</p>
                )}

                <div className="space-y-4">
                  <div>
                    <h2 className="text-lg font-medium mb-2">About this category</h2>
                    <p className="text-muted-foreground">{category.description}</p>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div>
                      <span className="font-medium text-foreground">
                        {category.parts?.length || 0}
                      </span>{' '}
                      part{(category.parts?.length || 0) !== 1 ? 's' : ''}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">
                        {category.parts?.reduce((acc, part) => acc + part.challenges.length, 0) ||
                          0}
                      </span>{' '}
                      challenge
                      {(category.parts?.reduce((acc, part) => acc + part.challenges.length, 0) ||
                        0) !== 1
                        ? 's'
                        : ''}
                    </div>
                  </div>
                </div>
              </div>

              {/* Similar Categories Section */}
              {similarCategories.length > 0 && (
                <div className="rounded-lg border bg-card p-6">
                  <h3 className="text-lg font-semibold mb-4">Similar Categories</h3>
                  <div className="space-y-3">
                    {similarCategories.map((similarCategory) => (
                      <Link
                        key={similarCategory.id}
                        href={`/challenges/categories/${similarCategory.slug}`}
                        className="block"
                      >
                        <Card className="transition-colors hover:border-primary/50">
                          <CardHeader className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <CardTitle className="text-base">{similarCategory.name}</CardTitle>
                                <CardDescription className="line-clamp-1">
                                  {similarCategory.summary || similarCategory.description}
                                </CardDescription>
                              </div>
                              <ArrowRightIcon className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </CardHeader>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
