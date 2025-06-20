import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { HomeSidebar } from '@/components/sidebars/home-sidebar/home-sidebar'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'

export default function Page() {
  return (
    <SidebarProvider open={false}>
      <HomeSidebar />
      <SidebarInset>
        <HomeHeader />
        <div className="flex flex-1 flex-col gap-4 px-4">
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={50} minSize={40}>
              One
            </ResizablePanel>

            <ResizableHandle withHandle />

            <ResizablePanel defaultSize={50} minSize={40} className="flex flex-col h-full">
              Two
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
