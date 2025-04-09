import { z } from 'zod'

const UserSolutionIdSchema = z.number().int().min(1, 'ID is required')
export type UserSolutionId = z.infer<typeof UserSolutionIdSchema>

const UserSolutionTitleSchema = z.string().min(1, 'Title is required')
export type UserSolutionTitle = z.infer<typeof UserSolutionTitleSchema>

const UserSolutionDescriptionSchema = z.string().min(1, 'Description is required')
export type UserSolutionDescription = z.infer<typeof UserSolutionDescriptionSchema>

const UserSolutionUpvotesSchema = z.number().int().min(0)
export type UserSolutionUpvotes = z.infer<typeof UserSolutionUpvotesSchema>

const UserSolutionDownvotesSchema = z.number().int().min(0)
export type UserSolutionDownvotes = z.infer<typeof UserSolutionDownvotesSchema>

const UserSolutionViewsSchema = z.number().int().min(0)
export type UserSolutionViews = z.infer<typeof UserSolutionViewsSchema>

const UserSolutionCommentsCountSchema = z.number().int().min(0)
export type UserSolutionCommentsCount = z.infer<typeof UserSolutionCommentsCountSchema>

const UserSolutionDateSchema = z.date()
export type UserSolutionDate = z.infer<typeof UserSolutionDateSchema>

const UserSolutionUrlSchema = z.string().url('URL must be a valid URL')
export type UserSolutionUrl = z.infer<typeof UserSolutionUrlSchema>


const UserSolutionUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  avatar: z.string().url('Avatar must be a valid URL'),
  initials: z.string().min(1, 'Initials is required'),
})
export type UserSolutionUser = z.infer<typeof UserSolutionUserSchema>


const CommunitySolutionSchema = z.object({
  id: UserSolutionIdSchema,
  user: UserSolutionUserSchema,
  title: UserSolutionTitleSchema,
  description: UserSolutionDescriptionSchema,
  upvotes: UserSolutionUpvotesSchema,
  downvotes: UserSolutionDownvotesSchema,
  views: UserSolutionViewsSchema,
  comments: UserSolutionCommentsCountSchema,
  createdAt: UserSolutionDateSchema,
  url: UserSolutionUrlSchema,
})
export type CommunitySolution = z.infer<typeof CommunitySolutionSchema>


export const validateCommunitySolution = (solution: CommunitySolution): CommunitySolution => {
  const result = CommunitySolutionSchema.safeParse(solution)
  if (!result.success) {
    throw new Error('Invalid community solution')
  }
  return result.data
}

