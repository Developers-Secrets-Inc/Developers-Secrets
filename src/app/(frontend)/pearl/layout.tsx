import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { PearlSidebar } from './components/pearl-sidebar'
import { PearlHeader } from './components/pearl-header'

export default function PearlLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <PearlSidebar />
      <SidebarInset>
        <PearlHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
