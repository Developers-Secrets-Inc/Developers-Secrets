import { getChallengeTagBySlug } from '@/api/challenges/tags'
import { isNone } from '@/lib/maybe'
import { notFound, redirect, unauthorized } from 'next/navigation'
import { getChallengeById } from '@/api/challenges'
import { ChallengesTable } from '@/api/challenges/components/challenges-table'
import { ChallengeTag } from '@/payload-types'
import { getUser } from '@/core/users'
import { isFailure } from '@/lib/result'
import { composeChallengesWithCompletionStatus } from '@/api/challenges/progression'
import { TagInformationCard } from '@/api/challenges/tags/components/tag-informations-card'

export const getTagChallenges = async (tag: ChallengeTag) => {
  return await Promise.all(
    (tag.challenges || []).map(async (challenge) => {
      if (typeof challenge === 'number') {
        const result = await getChallengeById({ id: challenge })
        if (isNone(result)) {
          return notFound()
        }
        return result.value
      }
      return challenge
    }),
  )
}

export default async function Page({ params }: { params: Promise<{ tag_slug: string }> }) {
  const { tag_slug } = await params

  const [tag, user] = await Promise.all([getChallengeTagBySlug({ slug: tag_slug }), getUser()])

  if (isFailure(user)) {
    return redirect('/auth/login')
  }

  if (!(user.value.informations.role === 'admin')) {
    return unauthorized()
  }

  if (isNone(tag)) {
    return notFound()
  }

  const challenges = await composeChallengesWithCompletionStatus({
    challenges: await Promise.all(
      (tag.value.challenges ?? []).map(async (challenge) =>
        typeof challenge === 'number'
          ? await getChallengeById({ id: challenge }).then((value) => {
              if (isNone(value)) {
                throw new Error('Challenge not found')
              }

              return value.value
            })
          : challenge,
      ),
    ),
    userId: user.value.id,
  })

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <TagInformationCard tag={tag.value} challenges={challenges} />
        </div>
        <div className="lg:col-span-2">
          <ChallengesTable challenges={challenges} />
        </div>
      </div>
    </div>
  )
}

/*

- Vérifier que le tag existe.
- Un composant pour quand il n'y a pas de challenges pour ce tag. 

On va simplement créer une nouvelle collection ChallengeTag qui est associée à un concept et à une séquence de challenges.



<TagInformationCard tag={Tag}/>
<TagChallengesTable challenges={Challenge & Progression}/>
    - Search component inside and filter. Need to create a new challenges-table component more dynamic.
        - Use nuqs for client side filtering


*/
