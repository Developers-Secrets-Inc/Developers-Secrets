import { SkillTreeHeader } from '@/api/skills/components/tree/header'

export default async function Page({ params }: { params: Promise<{ skill_slug: string }> }) {
  const { skill_slug } = await params
  return <SkillTreeHeader />
}
