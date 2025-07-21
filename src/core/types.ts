export type CommentAuthor = {
  name: string
  avatar?: string
  initials: string
}

export type CommentType = {
  id: string
  content: string
  author: CommentAuthor
  date: Date
  upvotes: number
  downvotes: number
  replies?: CommentType[]
  parentId?: string
}
