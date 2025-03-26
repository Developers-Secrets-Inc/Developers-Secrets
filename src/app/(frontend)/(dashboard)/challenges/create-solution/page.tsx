import { FC } from 'react'
import CreateSolutionForm from './components/CreateSolutionForm'
import { getUser } from '@/core/user'

interface CreateSolutionPageProps {
  searchParams: Promise<{
    challenge_id: string
  }>
}

const CreateSolutionPage: FC<CreateSolutionPageProps> = async ({ searchParams }) => {
  const { challenge_id } = await searchParams
  const challengeId = parseInt(challenge_id)
  const user = await getUser()

  if (isNaN(challengeId)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">ID de challenge invalide</div>
      </div>
    )
  }

  return <CreateSolutionForm challengeId={challengeId} userId={user.id} />
}

export default CreateSolutionPage
