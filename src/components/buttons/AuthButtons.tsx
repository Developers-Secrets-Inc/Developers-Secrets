import { getUser } from '@/core/user'
import { AuthButtonsClient } from './AuthButtons.client'

export const AuthButtons = async () => {
  try {
    const user = await getUser()
    return <AuthButtonsClient user={user} />
  } catch (error) {
    // Log error on server side for debugging
    console.error('AuthButtons: Failed to get user:', error)
    // If error occurs, render the client component with null user (not logged in)
    return <AuthButtonsClient user={null} />
  }
}
