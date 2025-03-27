import { FC } from 'react'
import CreateSolutionForm from './components/CreateSolutionForm'
import { getUser } from '@/core/user'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { HomeSidebar } from '@/components/sidebars/home-sidebar/home-sidebar'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { getPayloadChallenge } from '@/core/challenges'

interface CreateSolutionPageProps {
  searchParams: Promise<{
    challenge_id: string
  }>
}

const CreateSolutionPage: FC<CreateSolutionPageProps> = async ({ searchParams }) => {
  try {
    const { challenge_id } = await searchParams
    const challengeId = parseInt(challenge_id)

    if (isNaN(challengeId)) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500">ID de challenge invalide</div>
        </div>
      )
    }

    const user = await getUser()
    const challenge = await getPayloadChallenge(challengeId)

    if (!user || !user.id) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-red-500">Utilisateur non authentifié</div>
        </div>
      )
    }

    return (
      <SidebarProvider>
        <HomeSidebar />
        <SidebarInset>
          <HomeHeader />
          <div className="flex-1 w-full">
            <CreateSolutionForm
              challengeId={challengeId}
              userId={user.id}
              challengeTitle={challenge.title}
              challengeSlug={challenge.slug}
            />
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
  } catch (error) {
    console.error('Error in CreateSolutionPage:', error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          Une erreur s&apos;est produite lors du chargement de la page.
          {error instanceof Error ? ` ${error.message}` : ''}
        </div>
      </div>
    )
  }
}

export default CreateSolutionPage
