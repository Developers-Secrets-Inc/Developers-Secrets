import { DashboardHeader } from '@/components/sidebars/home-sidebar/dashboard-header'
import { HomeSidebar } from '@/components/sidebars/home-sidebar/home-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { RedirectIfNotSignedIn } from '@/core/user/components/signed-in'
import DashboardSettingsBubble from '@/core/admin/settings/components/dashboard-settings-bubble'
import { AdminComponent } from '@/core/user/components/admin-component'
import { AppSidebar } from '@/components/layout/app-sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RedirectIfNotSignedIn redirectTo="/auth/signup">
      <SidebarProvider style={{ '--sidebar-width': '270px' } as React.CSSProperties}>
        <AppSidebar />
        <SidebarInset>
          <DashboardHeader />
          {children}
        </SidebarInset>

        {/* <AdminComponent> */}
        {/* <DashboardSettingsBubble /> */}
        {/* </AdminComponent> */}
      </SidebarProvider>
    </RedirectIfNotSignedIn>
  )
}
