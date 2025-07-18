import { getSkillConcepts, getSkillConceptsWithProgression } from '@/api/skills'
import { SkillTreeHeader } from '@/api/skills/components/tree/header'
import SkillTree from '@/api/skills/components/tree/skill-tree'
import { getUser } from '@/core/user'
import { redirect } from 'next/navigation'
import SkillAdminBubble from '@/api/skills/components/admin/skill-admin-bubble'
import { AdminComponent } from '@/core/user/components/admin-component'
import { EnrichedConcept } from '@/api/skills/hooks/use-concepts-progression' // Import EnrichedConcept
import { normalizeEnrichedConcept } from '@/api/skills/hooks/use-concepts-progression' // Import normalizeEnrichedConcept

export default async function Page({ params }: { params: Promise<{ skill_slug: string }> }) {
  const { skill_slug } = await params
  const { skill } = await getSkillConcepts(skill_slug)
  const user = await getUser()

  if (!user) {
    return redirect('/auth/login')
  }

  const rawInitialData = await getSkillConceptsWithProgression(user.id, skill_slug)
  const initialData: EnrichedConcept[] = rawInitialData.map(normalizeEnrichedConcept)

  return (
    <div className="flex flex-col h-full min-h-screen">
      <SkillTreeHeader />
      <div className="flex-1 min-h-0">
        <SkillTree
          skill={skill}
          skillSlug={skill_slug}
          userId={user.id}
          initialData={initialData}
        />
      </div>
      <AdminComponent>
        <SkillAdminBubble skillSlug={skill_slug} userId={user.id} />
      </AdminComponent>
    </div>
  )
}
