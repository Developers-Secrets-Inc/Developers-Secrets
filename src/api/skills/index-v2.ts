'use server'

import 'server-only'

import { Concept, Skill } from '@/payload-types'








type ConceptWithProgression = Omit<Concept, 'subConcepts'>  & {
    progression: number
    subConcepts: ConceptWithProgression[]
}

type SkillWithConceptsProgression = Omit<Skill, 'rootConcepts'> & {
    rootConcepts: ConceptWithProgression[]
}



// ! This should be memoised to avoid repetitive requests.
export const getSkillTree = async (userId: string, skillSlug: string): Promise<Skill> => {}

export const getSkillTreeWithProgressions = async (userId: string, skillSlug: string): Promise<SkillWithConceptsProgression> => {

}


/* 

User progression should also be memoised but is more unstable because change does not occur in the admin panel but when the user is completing certain actions like a challenge. So, if we cache it, we need to handle the server revalidation.

- We need to get the raw skill tree, the corresponding progression for a specific user and the ability to mutate it. 
    - But in reality, it should be more 

*/
