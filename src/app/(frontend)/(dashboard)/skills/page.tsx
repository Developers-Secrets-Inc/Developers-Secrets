import { getUser } from '@/core/user'
import { redirect } from 'next/navigation'
import { SidebarProvider } from '@/components/ui/sidebar'
import { SidebarInset } from '@/components/ui/sidebar'
import { HomeHeader } from '@/components/sidebars/home-sidebar/home-header'
import { HomeSidebar } from '@/components/sidebars/home-sidebar/home-sidebar'
import SkillsClientWrapper from '@/components/skills/skills-client-wrapper'
import { getAllSkills } from '@/core/skills'

export default async function SkillsPage() {
  const user = await getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const availableSkills = await getAllSkills()

  return (
    <SidebarProvider>
      <HomeSidebar />
      <SidebarInset>
        <HomeHeader />
        <div className="flex-1 w-full h-[calc(100vh-4rem)] overflow-auto px-4 mx-auto">
          <SkillsClientWrapper skills={availableSkills} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
