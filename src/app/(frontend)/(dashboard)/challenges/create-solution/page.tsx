import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { HomeSidebar } from '@/components/sidebars/home-sidebar/home-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { getPayloadChallenge } from '@/core/challenges'
import {
    getUserSolution
} from '@/core/challenges/users-solutions'
import { getUser } from '@/core/user'
import { FC } from 'react'
import CreateSolutionForm from './components/CreateSolutionForm'

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

  // Récupérer toutes les solutions de l'utilisateur
  const existingSolution = await getUserSolution(challengeId, user.id)

  return (
    <SidebarProvider>
      <HomeSidebar />
      <SidebarInset>
        <HomeHeader />
        <div className="flex-1 w-full">
          <CreateSolutionForm
            challenge={challenge}
            userId={user.id}
            existingSolution={existingSolution}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default CreateSolutionPage
