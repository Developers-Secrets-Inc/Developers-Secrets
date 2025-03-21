import { User } from 'payload/generated-types'

export interface CommentType {
  id: string
  content: string
  author: User
  date: string
  upvotes: number
  downvotes: number
  parentId?: string
}

export interface Comment {
  id: number
  content: string
  authorId: string
  challenge: number
  targetType: 'description' | 'officialSolution' | 'userSolution'
  parentId?: string | null
  votes?: number | null
  reports?:
    | {
        userId: string
        reason: string
        details?: string | null
        createdAt: string
        id?: string | null
      }[]
    | null
  createdAt: string
  updatedAt: string
}
