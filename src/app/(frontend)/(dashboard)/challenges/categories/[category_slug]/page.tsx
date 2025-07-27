import { categories } from '@/api/challenges/categories/types'
import { ChallengeCategory } from '../components'
import { getSessionUser } from '@/core/user'
import { notFound, redirect } from 'next/navigation'

export default async function Page({ params }: { params: Promise<{ category_slug: string }> }) {
  const { category_slug } = await params

  const category = await categories.getUnique.bySlugWithChallenges(category_slug)

  const user = await getSessionUser()

  if (!user.success) return redirect('/auth/login')

  const completionPercent = await categories.userProgression.getUnique.bySlug(
    user.value.id,
    category_slug,
  )

  const IS_CATEGORY_UNAVAILABLE = !category || category.isLocked
  if (IS_CATEGORY_UNAVAILABLE) return notFound()

  return (
    <ChallengeCategory.Container>
      <ChallengeCategory.Header />
      <ChallengeCategory.Body>
        <ChallengeCategory.TableSection parts={category.parts} />
        <ChallengeCategory.InformationsSection
          category={category}
          completionPercent={completionPercent}
        />
      </ChallengeCategory.Body>
    </ChallengeCategory.Container>
  )
}

