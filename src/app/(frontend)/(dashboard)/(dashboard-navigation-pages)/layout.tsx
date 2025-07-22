import { DashboardHeader } from '@/components/sidebars/home-sidebar/dashboard-header'
import { HomeSidebar } from '@/components/sidebars/home-sidebar/home-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { RedirectIfNotSignedIn } from '@/core/user/components/signed-in'
import { UserStoreHydrator } from '@/core/users/components/user-store-hydrator'
import { getUser } from '@/core/users'
import { redirect } from 'next/navigation'
import { isFailure } from '@/lib/result'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()

  if (isFailure(user)) {
    return redirect('/auth/login')
  }

  return (
    <RedirectIfNotSignedIn redirectTo="/auth/signup">
      <SidebarProvider>
        <HomeSidebar />
        <SidebarInset>
          <DashboardHeader />
          <UserStoreHydrator user={user.value}>{children}</UserStoreHydrator>
        </SidebarInset>
      </SidebarProvider>
    </RedirectIfNotSignedIn>
  )
}
