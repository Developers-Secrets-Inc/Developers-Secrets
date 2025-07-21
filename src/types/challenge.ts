import { User } from "./user"


export type Comment = {
  id: string 
  author: User 
  content: string 
  votes: number 
  createdAt: Date 
}

export type CommentWithReplies = Comment & {
  replies: Comment[]
}


export type ChallengeDescription = {
  statement: string
  engagement: {
    acceptedSolutions: number
    failedSolutions: number
    totalSubmissions: number
    acceptanceRate: number
  }
  hints: string[]
  similarChallenges: {
    title: string 
    slug: string 
    difficulty: string
  }[]
  comments: CommentWithReplies[]
}

export type ChallengeOfficialSolution = {
  id: string 
  statement: string 
  comments: CommentWithReplies[]
}



export type ChallengeSolution = {
  id: string 
  title: string 
  slug: string 

  author: User
  views: number 
  votes: number 
  comments: CommentWithReplies[]
}


export type RunTimeErrorSubmission = {
  id: string 
  testsPassed: number 
  testsTotal: number 
  error: string 
  lastExpectedOutput: {
    param: string 
    value: string 
  }[]
  code: {
    language: string 
    content: string 
  }
}

export type WrongAnswerSubmission = {
  id: string 
  testsPassed: number 
  testsTotal: number 
  input: string 
  output: string 
  expectedOutput: string 
  createdAt: Date 
  code: {
    language: string 
    content: string 
  }
}


export type TimeLimitExceededSubmission = {
  id: string 
  testsPassed: number 
  testsTotal: number 
  createdAt: Date 
  lastExpectedOutput: {
    param: string 
    value: string 
  }[]
  code: {
    language: string 
    content: string 
  }
}

export type AcceptedSubmission = {
  id: string 
  testsPassed: number 
  testsTotal: number 
  createdAt: Date 
  code: {
    language: string 
    content: string 
  }
}


export type ChallengeInformations = {
  id: string
  slug: string
  title: string
}

export type ChallengeGamification = {
  difficulty: string
  baseExperience: number
}

export type ChallengeConcepts = {
  concepts: string[]
}

export type ChallengeEngagement = {
  likes: number
  dislikes: number
}


export type ChallengeTestCase = {
  paramName: string 
  paramValue: string 
}


export type ChallengeCode = {
  language: string 
  initialCode: string 
  testCases: ChallengeTestCase[]
}



export type Challenge = ChallengeInformations &
  ChallengeGamification &
  ChallengeEngagement &
  ChallengeConcepts & {
    description: ChallengeDescription
    officialSolution: ChallengeSolution
    usersSolutions: ChallengeSolution[]
    submissions: ChallengeSubmission[]
    code: ChallengeCode
  }
