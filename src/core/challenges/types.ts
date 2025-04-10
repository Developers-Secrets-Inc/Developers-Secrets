import { z } from 'zod'

// Basic schemas
const TitleSchema = z.string().min(1)
export type Title = z.infer<typeof TitleSchema>

const SlugSchema = z.string().min(1)
export type Slug = z.infer<typeof SlugSchema>

const DifficultySchema = z.enum(['easy', 'medium', 'hard', 'horrible'])
export type Difficulty = z.infer<typeof DifficultySchema>

const ExperienceSchema = z.number().int().positive()
export type Experience = z.infer<typeof ExperienceSchema>

// Ratings schemas
const RatingsSchema = z.object({
  total: z.number().default(0),
  count: z.number().default(0),
  average: z.number().min(0).max(5).default(0),
})
export type Ratings = z.infer<typeof RatingsSchema>

// Concepts schema
const ConceptSchema = z.object({
  concept: z.string(),
})
export type Concept = z.infer<typeof ConceptSchema>

// Engagement schema
const EngagementSchema = z.object({
  likes: z.number().default(0),
  dislikes: z.number().default(0),
})
export type Engagement = z.infer<typeof EngagementSchema>

// Description schemas
const SubmissionStatsSchema = z.object({
  acceptedSolutions: z.number().default(0),
  failedSolutions: z.number().default(0),
  totalSubmissions: z.number().default(0),
  acceptanceRate: z.number().min(0).max(100).default(0),
})
export type SubmissionStats = z.infer<typeof SubmissionStatsSchema>

const HintSchema = z.object({
  content: z.string(),
})
export type Hint = z.infer<typeof HintSchema>

const DescriptionSchema = z.object({
  statement: z.string(),
  submissionStats: SubmissionStatsSchema,
  hints: z.array(HintSchema),
  similarChallenges: z.array(z.number()), // IDs of related challenges
  comments: z.array(z.number()), // Comment IDs
})
export type Description = z.infer<typeof DescriptionSchema>

// Solution schemas
const OfficialSolutionSchema = z.object({
  statement: z.string(),
  comments: z.array(z.number()), // Comment IDs
})
export type OfficialSolution = z.infer<typeof OfficialSolutionSchema>

// Code schemas
const TestCaseSchema = z.object({
  input: z.string(),
  expectedOutput: z.string(),
})
export type TestCase = z.infer<typeof TestCaseSchema>

const CodeVersionSchema = z.object({
  language: z.string(),
  initialCode: z.string(),
  testCases: z.array(TestCaseSchema),
})
export type CodeVersion = z.infer<typeof CodeVersionSchema>

// Submission schemas
const SubmissionBaseSchema = z.object({
  submissionType: z.enum(['accepted', 'runtimeError', 'wrongAnswer', 'timeLimitExceeded']),
  authorId: z.string(),
  testsPassed: z.number(),
  testsTotal: z.number(),
  createdAt: z.date(),
  code: z.object({
    language: z.string(),
    content: z.string(),
  }),
})

const RuntimeErrorSubmissionSchema = SubmissionBaseSchema.extend({
  submissionType: z.literal('runtimeError'),
  error: z.string(),
  lastExpectedOutput: z.array(
    z.object({
      param: z.string(),
      value: z.string(),
    }),
  ),
})

const WrongAnswerSubmissionSchema = SubmissionBaseSchema.extend({
  submissionType: z.literal('wrongAnswer'),
  input: z.string(),
  output: z.string(),
  expectedOutput: z.string(),
})

const TimeLimitExceededSubmissionSchema = SubmissionBaseSchema.extend({
  submissionType: z.literal('timeLimitExceeded'),
  lastExpectedOutput: z.array(
    z.object({
      param: z.string(),
      value: z.string(),
    }),
  ),
})

const AcceptedSubmissionSchema = SubmissionBaseSchema.extend({
  submissionType: z.literal('accepted'),
})

const SubmissionSchema = z.discriminatedUnion('submissionType', [
  AcceptedSubmissionSchema,
  RuntimeErrorSubmissionSchema,
  WrongAnswerSubmissionSchema,
  TimeLimitExceededSubmissionSchema,
])
export type Submission = z.infer<typeof SubmissionSchema>

// Main Challenge schema
const ChallengeSchema = z.object({
  title: TitleSchema,
  slug: SlugSchema,
  difficulty: DifficultySchema,
  baseExperience: ExperienceSchema,
  ratings: RatingsSchema,
  concepts: z.array(ConceptSchema),
  engagement: EngagementSchema,
  description: DescriptionSchema,
  officialSolution: OfficialSolutionSchema,
  userSolutions: z.array(z.number()), // User solution IDs
  submissions: z.array(SubmissionSchema),
  codeVersions: z.array(CodeVersionSchema),
})
export type Challenge = z.infer<typeof ChallengeSchema>

// Validation functions
export const validateTitle = (title: string): Title => {
  const result = TitleSchema.safeParse(title)
  if (!result.success) {
    throw new Error('Invalid title')
  }
  return result.data
}

export const validateSlug = (slug: string): Slug => {
  const result = SlugSchema.safeParse(slug)
  if (!result.success) {
    throw new Error('Invalid slug')
  }
  return result.data
}

export const validateDifficulty = (difficulty: string): Difficulty => {
  const result = DifficultySchema.safeParse(difficulty)
  if (!result.success) {
    throw new Error('Invalid difficulty')
  }
  return result.data
}

export const validateChallenge = (challenge: Challenge): Challenge => {
  const result = ChallengeSchema.safeParse(challenge)
  if (!result.success) {
    throw new Error('Invalid challenge data')
  }
  return result.data
}

export const validateSubmission = (submission: Submission): Submission => {
  const result = SubmissionSchema.safeParse(submission)
  if (!result.success) {
    throw new Error('Invalid submission data')
  }
  return result.data
}

export const validateCodeVersion = (codeVersion: CodeVersion): CodeVersion => {
  const result = CodeVersionSchema.safeParse(codeVersion)
  if (!result.success) {
    throw new Error('Invalid code version data')
  }
  return result.data
}
