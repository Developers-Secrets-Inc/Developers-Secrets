import { getSkillConcepts, enrichConceptsWithProgressAndLock } from '@/api/skills'
import { SkillTreeHeader } from '@/api/skills/components/tree/header'
import { SkillTree } from '@/api/skills/components/tree/skill-tree'
import { getUser } from '@/core/user'
import { redirect } from 'next/navigation'

function normalizeConceptDescriptions(concepts: any[]): any[] {
  return concepts.map((concept) => ({
    ...concept,
    description: concept.description ?? undefined,
    subConcepts: concept.subConcepts ? normalizeConceptDescriptions(concept.subConcepts) : [],
  }))
}

export default async function Page({ params }: { params: Promise<{ skill_slug: string }> }) {
  const { skill_slug } = await params
  const { skill, concepts } = await getSkillConcepts(skill_slug)
  const user = await getUser()

  if (!user) {
    return redirect('/auth/login')
  }
  console.log(user.id)

  const normalizedConcepts = normalizeConceptDescriptions(concepts)
  const enrichedConcepts = await enrichConceptsWithProgressAndLock(normalizedConcepts, user.id)

  return (
    <div className="flex flex-col h-full min-h-screen">
      <SkillTreeHeader />
      <div className="flex-1 min-h-0">
        <SkillTree skill={skill} concepts={enrichedConcepts} />
      </div>
    </div>
  )
}
