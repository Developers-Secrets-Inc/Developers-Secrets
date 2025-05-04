import { getSessionUser } from ".."



export const AdminComponent = async ({ children }: { children: React.ReactNode }) => {
  const user = await getSessionUser()
  if (!user.success) {
    return null
  }
  const isAdmin = user.value.informations.role === 'admin'
  if (!isAdmin) {
    return null
  }
  return <>{children}</>
}
