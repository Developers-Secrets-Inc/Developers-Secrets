import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { HomeSidebar } from '@/components/sidebars/home-sidebar/home-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { getPayloadChallenge } from '@/core/challenges'
import { getUserSolution } from '@/core/challenges/users-solutions'
import { getUser } from '@/core/user'
import { FC } from 'react'
import CreateSolutionForm from './components/CreateSolutionForm'
import { SolutionFormStoreInitializer } from './store/solution-form-store'
import { Option } from '@/components/ui/multiselect'
import { Tag as PayloadTag, UserSolution } from '@/payload-types'
import SolutionComments from './components/SolutionComments'
import SolutionStats from './components/SolutionStats'
import { UserSolutionTags } from './components/user-solution-tags'
import { SolutionFormHeader } from './components/header/create-solution-header'

interface CreateSolutionPageProps {
  searchParams: Promise<{
    challenge_id: string
  }>
}

const ChallengeNotFound = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-red-500">ID de challenge invalide</div>
    </div>
  )
}

const UserNotAuthenticated = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-red-500">Utilisateur non authentifié</div>
    </div>
  )
}

const convertTagsToOptions = (tags: (PayloadTag | number)[] | null | undefined): Option[] => {
  if (!tags) return []
  return tags
    .map((tag) => {
      if (typeof tag === 'number') return null
      if (
        typeof tag === 'object' &&
        tag !== null &&
        'id' in tag &&
        'name' in tag &&
        'status' in tag
      ) {
        return {
          value: tag.id.toString(),
          label: tag.status === 'test' ? `${tag.name} (private)` : tag.name,
        }
      }
      return null
    })
    .filter((option): option is Option => option !== null)
}

// Helper function to calculate stats
const calculateStats = (solution: UserSolution | null) => {
  if (!solution) {
    return { views: 0, likes: 0, dislikes: 0 }
  }

  const views = solution.views || 0
  const likes = solution.votes?.filter((vote) => vote.status === 'upvote').length || 0
  const dislikes = solution.votes?.filter((vote) => vote.status === 'downvote').length || 0

  return { views, likes, dislikes }
}

const CreateSolutionPage: FC<CreateSolutionPageProps> = async ({ searchParams }) => {
  const { challenge_id } = await searchParams
  const challengeId = parseInt(challenge_id)

  if (isNaN(challengeId)) {
    return <ChallengeNotFound />
  }

  const user = await getUser()
  const challenge = await getPayloadChallenge(challengeId)

  if (!user || !user.id) {
    return <UserNotAuthenticated />
  }

  const existingSolutionData = await getUserSolution(challengeId, user.id)

  const initialSolutionForStore = existingSolutionData
    ? {
        ...existingSolutionData,
        tags: convertTagsToOptions(existingSolutionData.tags),
      }
    : null

  if (!challenge) {
    return <ChallengeNotFound />
  }

  // Calculate stats
  const stats = calculateStats(existingSolutionData)

  // Get solution ID as number or null
  const solutionIdForComments = existingSolutionData ? existingSolutionData.id : null
  // Ensure it's a number if not null
  const validSolutionId =
    typeof solutionIdForComments === 'number'
      ? solutionIdForComments
      : typeof solutionIdForComments === 'string' && !isNaN(parseInt(solutionIdForComments, 10))
        ? parseInt(solutionIdForComments, 10)
        : null

  return (
    <SidebarProvider>
      <HomeSidebar />
      <SidebarInset>
        <SolutionFormStoreInitializer
          initialSolution={initialSolutionForStore}
          challenge={challenge}
          userId={user.id}
        />
        <HomeHeader />
        <div className="w-full h-full flex flex-col">
          <SolutionFormHeader />

          <div className="flex-1 overflow-auto">
            <div className="mx-auto px-4 sm:px-6 lg:px-12 h-full">
              <div className="flex gap-6 h-full">
                <div className="w-3/4 flex flex-col gap-6 py-6">
                  <CreateSolutionForm />
                </div>
                <div className="w-1/4 border-l border-border pl-6 py-6">
                  <div className="sticky top-6 space-y-4">
                    <UserSolutionTags />
                    <SolutionStats
                      views={stats.views}
                      likes={stats.likes}
                      dislikes={stats.dislikes}
                    />
                    <SolutionComments solutionId={validSolutionId} userId={user.id} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default CreateSolutionPage
