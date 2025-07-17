'use server'

import 'server-only'
import { find as findApi } from '@/api'
import config from '@payload-config'
import { getPayload } from 'payload'

export const getConceptProgress = async (userId: string, conceptId: number): Promise<number> => {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'userConceptProgressions',
    where: {
      and: [{ user: { equals: userId } }, { concept: { equals: conceptId } }],
    },
    limit: 1,
    select: { progressValue: true },
  })
  const entry = res.docs[0]
  return entry && typeof entry.progressValue === 'number' ? entry.progressValue : 0
}

export const getSkillProgress = async (userId: string, skillId: number): Promise<number> => {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'user-overall-skill-progressions',
    where: {
      and: [{ user: { equals: userId } }, { skill: { equals: skillId } }],
    },
    limit: 1,
    select: { overallMasteryPercentage: true },
  })
  const entry = res.docs[0] as { overallMasteryPercentage?: number } | undefined
  return entry && typeof entry.overallMasteryPercentage === 'number'
    ? entry.overallMasteryPercentage
    : 0
}

export const isConceptLocked = async (userId: string, conceptId: number): Promise<boolean> => {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'concepts',
    where: { id: { equals: conceptId } },
    limit: 1,
    select: { requiredConcepts: true },
    depth: 1,
  })
  const concept = res.docs[0] as { requiredConcepts?: Array<{ id: number }> }
  
  console.log(concept)
  if (!concept || !concept.requiredConcepts || concept.requiredConcepts.length === 0) {
    return false 
  }
  
  for (const req of concept.requiredConcepts) {
    const progress = await getConceptProgress(userId, req.id)
    if (progress < 100) {
      return true 
    }
  }
  return false 
}
