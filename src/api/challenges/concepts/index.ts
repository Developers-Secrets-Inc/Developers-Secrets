'use server'

import 'server-only'

import { ChallengeConceptOutcome } from '@/payload-types'
import { getPayload } from 'payload'
import config from '@payload-config'

export const getChallengeConcepts = async (
  challengeId: number,
): Promise<ChallengeConceptOutcome> => {
    const payload = await getPayload({ config })

    const challengeConceptDocuments = await payload.find({
        collection: 'challenge-concept-outcomes',
        where: { challenge: { equals: challengeId }}
    })

    const challengeConcept = challengeConceptDocuments.docs[0]
    console.log(challengeConcept)
    
    if (!challengeConcept) throw new Error(`Could not find a challenge with ID ${challengeId}`)
    return challengeConcept
}