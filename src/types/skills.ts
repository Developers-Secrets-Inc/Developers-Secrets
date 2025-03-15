import { User } from './user'

// Everything here is controlled by the admin panel (except for the user progression).
// We should not have any functions to modify this data.
// The only reason to have edit functions is in case of a new custom admin panel in the future.

export type Concept = Readonly<{
  id: string
  name: string

  prerequisites: Concept[]
  nextConcepts: Concept[]
  similarConcepts: Concept[]

  skills: Skill[]
}>

export type Skill = Readonly<{
  id: string
  name: string

  concepts: Concept[]
}>

export type UserConceptProgression = Readonly<{
  user: User
  concept: Concept

  // The user gain progress in a concept by reading articles and completing challenges.
  // Every challenge is associated with a set of concepts with a certain progression level.
  // When the user completes a challenge, the progress of the associated concepts is increased.
  //
  // If the user progress is 100%, challenges associated with the concept have no effects on the user progression.
  progress: number

  // This date could be used to determine if the user has been idle for a while
  // and should be given a reminder to practice the concept.
  lastUpdated: Date
}>

// TODO: Add ranks based on skill level
// Here, nothing is stored in the database.
// The level and experience are calculated when needed.
// We calculate it by getting all the concepts progression of the user
// and summing up the progress of each concept.
//
// So, we should have a function like `getUserSkillProgression(user: User, skill: Skill)`
// that will return the progression of the skill for the user. So, this object is read-only.
export type UserSkillProgression = Readonly<{
  user: User
  skill: Skill

  // This level is calculated based on the experience as explained below.
  // It is not stored in the database, but is calculated when needed.
  // Because the calculation may be intensive, it may be cached with Redis.
  level: number

  // The experience is based on the completion of all concepts related to the skill.
  // If there are 80 skills, the maximum experience is 8,000 (80 * 100%).
  // Having 8,000 experience means the user is at the maximum level (100).
  // If new concepts are added, the maximum experience will increase and the user will lose progress.
  experience: number

  // This date could be used to determine if the user has been idle for a while
  // and should be given a reminder to practice the skill.
  lastUpdated: Date
}>
