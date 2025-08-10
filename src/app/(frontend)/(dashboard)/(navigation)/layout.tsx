import { AppSidebar } from '@/components/layout/app-sidebar'
import { DashboardHeader } from '@/components/sidebars/home-sidebar/dashboard-header'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { RedirectIfNotSignedIn } from '@/core/users/components/signed-in'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RedirectIfNotSignedIn redirectTo="/auth/signup">
      <SidebarProvider style={{ '--sidebar-width': '270px' } as React.CSSProperties}>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </RedirectIfNotSignedIn>
  )
}
