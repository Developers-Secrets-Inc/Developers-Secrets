import { getChallengeTagBySlug } from '@/api/challenges/tags'
import { isNone } from '@/lib/maybe'
import { notFound, redirect, unauthorized } from 'next/navigation'
import { getChallengeById } from '@/api/challenges'
import { ChallengesTable } from '@/api/challenges/components/challenges-table'
import { ChallengeTag } from '@/payload-types'
import { getUser } from '@/core/users'
import { isFailure } from '@/lib/result'

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

  const [tag, user] = await Promise.all([
    getChallengeTagBySlug({ slug: tag_slug }),
    getUser()
  ]) 

  if (isFailure(user)) {
    return redirect('/auth/login')
  }

  if (!(user.value.informations.role === 'admin')) {
    return unauthorized()
  }

  if (isNone(tag)) {
    return notFound()
  }

  console.log(tag)

  return <ChallengesTable challenges={await getTagChallenges(tag.value)} />
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
