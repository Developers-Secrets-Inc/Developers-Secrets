import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { HomeHeader } from "@/components/sidebars/home-sidebar/home-header";
import { HomeSidebar } from "@/components/sidebars/home-sidebar/home-sidebar";



export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
    <HomeSidebar />
    <SidebarInset>
      <HomeHeader />
      <div className="flex flex-1 gap-8 max-w-[1400px] mx-auto py-8 px-4">
        {children}
      </div>
    </SidebarInset>
  </SidebarProvider>
  )
}

