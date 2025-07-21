import { Challenge } from '@/payload-types'
import { User } from '@/types/user'
import { notFound } from 'next/navigation'

export const DraftRedirect = ({
  children,
  challenge,
  user,
}: {
  children: React.ReactNode
  challenge: Challenge
  user: User
}) => {
  if (challenge.draft && user.informations?.role !== 'admin') {
    notFound()
  }

  return children
}
