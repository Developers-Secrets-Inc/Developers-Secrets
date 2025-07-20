'use server'

import 'server-only'
import { find } from '..'
import config from '@payload-config'

import { Skill, Concept } from '@/payload-types'
import { getPayload } from 'payload'
import { getConceptProgress, isConceptLocked } from './progression'

// Récupère un concept complet et tous ses subConcepts récursivement
export async function getConceptWithSubConcepts(id: number): Promise<Concept> {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'concepts',
    where: { id: { equals: id } },
    depth: 0,
    limit: 1,
  })
  const concept = res.docs[0]
  if (!concept) throw new Error(`Concept not found: ${id}`)

  let subConcepts: Concept[] = []
  if (Array.isArray(concept.subConcepts) && concept.subConcepts.length > 0) {
    subConcepts = await Promise.all(
      concept.subConcepts.map(async (subConcept) => {
        return typeof subConcept === 'number'
          ? await getConceptWithSubConcepts(subConcept)
          : await getConceptWithSubConcepts(subConcept.id)
      }),
    )
  }

  return {
    ...concept,
    subConcepts,
  }
}

export const getSkillTreesSelectInformations = async (): Promise<
  {
    id: number
    name: string
    slug: string
  }[]
> => {
  const skillsDocs = await find({
    collection: 'skills',
    select: {
      name: true,
      slug: true,
    },
  })

  return skillsDocs.docs
}

export type ConceptNode = {
  id: number
  name: string
  slug: string
  description?: string
  type: 'abstract' | 'concrete'
  subConcepts: ConceptNode[]
  requiredConcepts: number[]
}

export type ConceptNodeWithProgress = ConceptNode & {
  progress: number
  isLocked: boolean
  subConcepts: ConceptNodeWithProgress[]
}

export async function enrichConceptsWithProgressAndLock(
  concepts: ConceptNode[],
  userId: string,
): Promise<ConceptNodeWithProgress[]> {
  return Promise.all(
    concepts.map(async (concept) => {
      const [progress, isLocked, subConcepts] = await Promise.all([
        getConceptProgress(userId, concept.id),
        isConceptLocked(userId, concept.id),
        enrichConceptsWithProgressAndLock(concept.subConcepts, userId),
      ])
      return {
        ...concept,
        progress: progress,
        isLocked: isLocked,
        subConcepts,
      }
    }),
  )
}

export const getSkillConcepts = async (
  skillSlug: string,
): Promise<{
  skill: {
    id: number
    name: string
    slug: string
    description?: string
  }
  concepts: Concept[]
}> => {
  const payload = await getPayload({ config })
  // 1. Récupérer le skill par son slug, rootConcepts (ids uniquement)
  const skillsRes = await payload.find({
    collection: 'skills',
    where: { slug: { equals: skillSlug } },
    depth: 0,
    limit: 1,
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      rootConcepts: true, // ids uniquement
    },
  })
  const skill = skillsRes.docs[0]
  if (!skill) throw new Error('Skill not found')

  // 2. Pour chaque rootConcept id, récupérer le concept complet récursivement
  const concepts: Concept[] = Array.isArray(skill.rootConcepts)
    ? await Promise.all(
        skill.rootConcepts
          .map((c: number | Concept) => (typeof c === 'number' ? c : c.id))
          .map((id: number) => getConceptWithSubConcepts(id)),
      )
    : []

  return {
    skill: {
      id: skill.id,
      name: skill.name,
      slug: skill.slug,
      description: skill.description ?? undefined,
    },
    concepts,
  }
}

// Recursively enrich a concept and all its subConcepts with progression
async function enrichConceptWithProgression(
  userId: string,
  concept: Concept,
): Promise<Concept & { progression: number; isLocked: boolean }> {
  const [progression, isLocked] = await Promise.all([
    getConceptProgress(userId, concept.id),
    isConceptLocked(userId, concept.id),
  ])
  let subConcepts: (Concept & { progression: number; isLocked: boolean })[] = []
  if (Array.isArray(concept.subConcepts) && concept.subConcepts.length > 0) {
    subConcepts = await Promise.all(
      concept.subConcepts
        .filter((sc): sc is Concept => typeof sc === 'object' && sc !== null)
        .map((sub) => enrichConceptWithProgression(userId, sub)),
    )
  }
  return {
    ...concept,
    progression,
    isLocked,
    subConcepts,
  }
}

export const getSkillConceptsWithProgression = async (
  userId: string,
  skillSlug: string,
): Promise<(Concept & { progression: number; isLocked: boolean })[]> => {
  const { concepts } = await getSkillConcepts(skillSlug)
  const enrichedConcepts = await Promise.all(
    concepts.map((concept) => enrichConceptWithProgression(userId, concept)),
  )
  return enrichedConcepts
}

export const updateConceptProgression = async (
  userId: string,
  conceptId: number,
  newProgression: number,
): Promise<number> => {
  const payload = await getPayload({ config })

  // Try to find an existing progression entry
  const res = await payload.find({
    collection: 'userConceptProgressions',
    where: {
      and: [{ user: { equals: userId } }, { concept: { equals: conceptId } }],
    },
    select: { progressValue: true },
    limit: 1,
  })
  const existing = res.docs[0]

  if (existing) {
    // Update the existing progression
    await payload.update({
      collection: 'userConceptProgressions',
      id: existing.id,
      data: { progressValue: newProgression },
    })
  } else {
    // Create a new progression entry
    await payload.create({
      collection: 'userConceptProgressions',
      data: {
        user: userId,
        concept: conceptId,
        progressValue: newProgression,
      },
    })
  }
  return newProgression
}

export const increaseConceptProgression = async (
  userId: string,
  conceptId: number,
  quantity: number,
): Promise<void> => {
  const payload = await getPayload({ config })

  const res = await payload.find({
    collection: 'userConceptProgressions',
    where: {
      and: [{ user: { equals: userId } }, { concept: { equals: conceptId } }],
    },
    select: { progressValue: true },
    limit: 1,
  })
  const existing = res.docs[0]
  console.log(existing)

  if (!existing) {
    await updateConceptProgression(userId, conceptId, quantity)
  } else {
    await updateConceptProgression(userId, conceptId, existing.progressValue + quantity)
  }

  console.log('Successfuly increased one concept')
}

export const completeSubConcepts = async (userId: string, conceptId: number): Promise<number[]> => {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'concepts',
    where: { id: { equals: conceptId } },
    depth: 2,
    limit: 1,
  })
  const concept = res.docs[0]
  if (!concept) return []

  let completedIds: number[] = []

  if (Array.isArray(concept.subConcepts) && concept.subConcepts.length > 0) {
    for (const sub of concept.subConcepts) {
      const subConceptId = typeof sub === 'object' && sub !== null ? sub.id : sub
      await updateConceptProgression(userId, subConceptId, 100)
      const subCompleted = await completeSubConcepts(userId, subConceptId)
      completedIds.push(subConceptId, ...subCompleted)
    }
  }
  // Ajouter le concept parent à la liste (en premier)
  return [conceptId, ...completedIds]
}

export const getConceptById = async (conceptId: number): Promise<Concept> => {
  const payload = await getPayload({ config })

  const concept = await payload.findByID({
    collection: 'concepts',
    id: conceptId,
  })

  if (!concept) throw new Error(`Could not find concept with ID ${conceptId}`)
  return concept
}
