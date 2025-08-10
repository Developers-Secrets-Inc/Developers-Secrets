import { getUser } from "../"
import { isFailure } from "@/lib/result"



export const AdminComponent = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUser()
  if (isFailure(user)) {
    return null
  }
  const isAdmin = user.value.informations.role === 'admin'
  if (!isAdmin) {
    return null
  }
  return <>{children}</>
}
