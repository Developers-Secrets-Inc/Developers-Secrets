import { SkillsClientWrapper } from '@/components/skills/skills-client-wrapper'
import { getAllSkills } from '@/core/skills'
import { AuthGuard } from '@/components/auth/auth-guard'
import { DashboardLayout } from '@/components/layout/dashboard-layout'

const SkillsPage = async () => {
  const availableSkills = await getAllSkills()

  return (
    <AuthGuard>
      <DashboardLayout>
        <SkillsClientWrapper skills={availableSkills} />
      </DashboardLayout>
    </AuthGuard>
  )
}

export default SkillsPage
