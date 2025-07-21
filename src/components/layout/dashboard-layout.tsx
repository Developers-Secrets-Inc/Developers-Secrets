import React from 'react'
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar'
import { HomeSidebar } from '@/components/sidebars/home-sidebar/home-sidebar'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <HomeSidebar />
      <SidebarInset>
        <HomeHeader />
        {/* Le contenu spécifique de la page sera rendu ici */}
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
