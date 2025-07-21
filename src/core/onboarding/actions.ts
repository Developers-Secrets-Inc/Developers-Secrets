'use server'

import 'server-only'

import { setCodingLevel, setTimeCoding } from '.'

export const setFirstPartOfOnboarding = async (
  userId: string,
  codingLevel: CodingLevel,
  timeCoding: TimeCoding,
): Promise<void> => {
  await setCodingLevel(userId, codingLevel)
  await setTimeCoding(userId, timeCoding)
}