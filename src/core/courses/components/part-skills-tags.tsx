import { CoursePart, Skill, Concept, ImplementationConcept } from '@/payload-types'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getPayload } from 'payload'
import config from '@payload-config'

interface PartSkillsTagsProps {
  part: CoursePart
}

// Define the greyish style for the skill/concept badges
const tagBadgeStyle = 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20 hover:bg-zinc-500/20'

export async function PartSkillsTags({ part }: PartSkillsTagsProps) {
  const conceptIds = new Set<number>()
  const implConceptIdsToFetch = new Set<number>() // IDs of ImplementationConcepts to fetch

  if (part.skillImpacts && Array.isArray(part.skillImpacts)) {
    for (const impactBlock of part.skillImpacts) {
      if (impactBlock.blockType === 'skillConceptImpact') {
        const implConceptRelation = impactBlock.implementationConcept as
          | (ImplementationConcept & { concept?: Concept | number | null })
          | number
          | undefined
          | null

        if (typeof implConceptRelation === 'number') {
          implConceptIdsToFetch.add(implConceptRelation)
        } else if (
          typeof implConceptRelation === 'object' &&
          implConceptRelation !== null &&
          implConceptRelation.concept
        ) {
          const conceptRef = implConceptRelation.concept
          if (typeof conceptRef === 'number') {
            conceptIds.add(conceptRef)
          } else if (typeof conceptRef === 'object' && conceptRef?.id) {
            conceptIds.add(conceptRef.id)
          }
        }
      } else if (impactBlock.blockType === 'baseConceptImpact') {
        const conceptRef = impactBlock.concept as Concept | number | undefined | null

        if (typeof conceptRef === 'number') {
          conceptIds.add(conceptRef)
        } else if (typeof conceptRef === 'object' && conceptRef?.id) {
          conceptIds.add(conceptRef.id)
        }
      }
    }
  }

  const payload = await getPayload({ config })

  // Fetch ImplementationConcepts if needed
  if (implConceptIdsToFetch.size > 0) {
    try {
      const implConceptsResult = await payload.find({
        collection: 'implementationConcepts',
        where: { id: { in: Array.from(implConceptIdsToFetch) } },
        limit: implConceptIdsToFetch.size,
        depth: 1,
        pagination: false,
      })

      for (const fetchedImplConcept of implConceptsResult.docs) {
        const conceptRef = fetchedImplConcept.concept
        if (typeof conceptRef === 'number') {
          conceptIds.add(conceptRef)
        } else if (typeof conceptRef === 'object' && conceptRef?.id) {
          conceptIds.add(conceptRef.id)
        }
      }
    } catch (error) {
      console.error('[PartSkillsTags] Error fetching implementationConcepts:', error)
    }
  }

  const uniqueConceptIds = Array.from(conceptIds)

  const conceptNames = new Set<string>()
  if (uniqueConceptIds.length > 0) {
    try {
      const conceptsResult = await payload.find({
        collection: 'concepts',
        where: { id: { in: uniqueConceptIds } },
        limit: uniqueConceptIds.length,
        depth: 0,
        pagination: false,
      })
      conceptsResult.docs.forEach((concept) => concept.name && conceptNames.add(concept.name))
    } catch (error) {
      console.error('[PartSkillsTags] Error fetching concepts:', error)
    }
  }

  const uniqueTags = Array.from(conceptNames)

  if (uniqueTags.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      {uniqueTags.map((tagName) => (
        <Badge key={tagName} variant="outline" className={cn(tagBadgeStyle)}>
          {tagName}
        </Badge>
      ))}
    </div>
  )
}

// Optional: Add a skeleton loader component
export const PartSkillsTagsSkeleton = () => {
  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <div className="h-5 w-16 rounded-md bg-muted animate-pulse"></div>
      <div className="h-5 w-20 rounded-md bg-muted animate-pulse"></div>
    </div>
  )
}
