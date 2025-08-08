import { Comment as PayloadComment } from '@/payload-types'
import { User } from '@/core/users/types'
import { createContext } from 'react'

export type CommentContextType = {
  comment: PayloadComment
  author: User
}

export const CommentContext = createContext<CommentContextType | undefined>(undefined)

export const CommentProvider = ({
  comment,
  author,
  children,
}: {
  comment: PayloadComment
  author: User
  children: React.ReactNode
}) => {
  return <CommentContext.Provider value={{ comment, author }}>{children}</CommentContext.Provider>
}
