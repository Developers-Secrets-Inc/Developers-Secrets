import { Concept, Skill, UserConceptProgression, UserSkillProgression } from '@/types/skills'
import { User } from '@/types/user'

export const getConceptById = async (id: string): Promise<Concept> => {
  // TODO: Implement actual logic
  return {} as Concept
}

export const getConceptByName = async (name: string): Promise<Concept> => {
  // TODO: Implement actual logic
  return {} as Concept
}

export const getSkillById = async (id: string): Promise<Skill> => {
  // TODO: Implement actual logic
  return {} as Skill
}

export const getSkillByName = async (name: string): Promise<Skill> => {
  // TODO: Implement actual logic
  return {} as Skill
}

export const getUserConceptProgression = async (
  user: User,
  concept: Concept,
): Promise<UserConceptProgression> => {
  // TODO: Implement actual logic
  return {
    user,
    concept,
    progress: 0,
    lastUpdated: new Date(),
  } as UserConceptProgression
}

export const isConceptCompletedByUser = async (user: User, concept: Concept): Promise<boolean> => {
  // TODO: Implement actual logic
  return false
}

export const increaseUserConceptProgression = async (
  user: User,
  concept: Concept,
  amount: number,
): Promise<UserConceptProgression> => {
  // TODO: Implement actual logic
  return {
    user,
    concept,
    progress: amount,
    lastUpdated: new Date(),
  } as UserConceptProgression
}

export const getUserSkillProgression = async (
  user: User,
  skill: Skill,
): Promise<UserSkillProgression> => {
  // TODO: Implement actual logic
  return {
    user,
    skill,
    level: 0,
    experience: 0,
    lastUpdated: new Date(),
  } as UserSkillProgression
}
