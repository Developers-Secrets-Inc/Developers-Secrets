import { z } from 'zod'
import { Challenge } from '@/payload-types'

const UserIdSchema = z.string().uuid()
export type UserId = z.infer<typeof UserIdSchema>

const ChallengeIdSchema = z.number().int().positive()
export type ChallengeId = z.infer<typeof ChallengeIdSchema>

const HasLikedSchema = z.boolean().nullable().default(false)
export type HasLiked = z.infer<typeof HasLikedSchema>

const HasDislikedSchema = z.boolean().nullable().default(false)
export type HasDisliked = z.infer<typeof HasDislikedSchema>

const RatingSchema = z.number().min(1).max(5).nullable().optional()
export type Rating = z.infer<typeof RatingSchema>

const CompletionStatusSchema = z
  .enum(['not_started', 'in_progress', 'completed'])
  .default('not_started')
export type CompletionStatus = z.infer<typeof CompletionStatusSchema>

const IsSolutionUnlockedSchema = z.boolean().nullable().default(false)
export type IsSolutionUnlocked = z.infer<typeof IsSolutionUnlockedSchema>

const CodeLanguageSchema = z.string().min(1)
export type CodeLanguage = z.infer<typeof CodeLanguageSchema>

const CodeBlockSchema = z.object({
  id: z.string().nullable().optional(),
  language: z.string().min(1),
  content: z.string(),
})
export type CodeBlock = z.infer<typeof CodeBlockSchema>

const CodeSchema = z.array(CodeBlockSchema).nullable().optional().default(null)
export type Code = z.infer<typeof CodeSchema>

const UserProgressionSchema = z.object({
  userId: UserIdSchema,
  challenge: z.union([z.number(), z.lazy(() => z.custom<Challenge>())]),
  hasLiked: HasLikedSchema,
  hasDisliked: HasDislikedSchema,
  rating: RatingSchema,
  completionStatus: CompletionStatusSchema,
  isSolutionUnlocked: IsSolutionUnlockedSchema,
  code: CodeSchema,
})
export type UserProgression = z.infer<typeof UserProgressionSchema>

export const validateChallengeId = (challengeId: number): ChallengeId => {
  console.log('challengeId', challengeId)

  const result = ChallengeIdSchema.safeParse(challengeId)
  if (!result.success) {
    throw new Error('Invalid challenge ID')
  }
  return result.data
}

export const validateUserId = (userId: string): UserId => {
  const result = UserIdSchema.safeParse(userId)
  if (!result.success) {
    throw new Error('Invalid user ID')
  }
  return result.data
}

export const validateHasLiked = (hasLiked: boolean): HasLiked => {
  const result = HasLikedSchema.safeParse(hasLiked)
  if (!result.success) {
    throw new Error('Invalid progress status')
  }
  return result.data
}

export const validateHasDisliked = (hasDisliked: boolean): HasDisliked => {
  const result = HasDislikedSchema.safeParse(hasDisliked)
  if (!result.success) {
    throw new Error('Invalid has disliked')
  }
  return result.data
}

export const validateRating = (rating: number): Rating => {
  const result = RatingSchema.safeParse(rating)
  if (!result.success) {
    throw new Error('Invalid rating')
  }
  return result.data
}

export const validateCompletionStatus = (status: string): CompletionStatus => {
  const result = CompletionStatusSchema.safeParse(status)
  if (!result.success) {
    throw new Error('Invalid completion status')
  }
  return result.data
}

export const validateIsSolutionUnlocked = (isUnlocked: boolean): IsSolutionUnlocked => {
  const result = IsSolutionUnlockedSchema.safeParse(isUnlocked)
  if (!result.success) {
    throw new Error('Invalid solution unlock status')
  }
  return result.data
}

export const validateCodeBlock = (codeBlock: CodeBlock): CodeBlock => {
  const result = CodeBlockSchema.safeParse(codeBlock)
  if (!result.success) {
    throw new Error('Invalid code block')
  }
  return result.data
}

export const validateUserProgression = (progression: UserProgression): UserProgression => {
  const result = UserProgressionSchema.safeParse(progression)
  if (!result.success) {
    throw new Error('Invalid user progression data')
  }
  return result.data
}

export const validateCodeLanguage = (language: string): CodeLanguage => {
  const result = CodeLanguageSchema.safeParse(language)
  if (!result.success) {
    throw new Error('Invalid code language')
  }
  return result.data
}

