import { HomeSidebar } from '@/components/sidebars/home-sidebar/home-sidebar'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { getUser } from '@/core/user'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser()
  if (!user) {
    redirect('/auth/login')
  }

  return (
    <SidebarProvider>
      <HomeSidebar />
      <SidebarInset>
        <HomeHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
