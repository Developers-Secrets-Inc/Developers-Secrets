import { useContext } from 'react'
import { CommentContext, CommentContextType } from '../components/comment-provider'

export const useComment = (): CommentContextType => {
  const comment = useContext(CommentContext)
  if (!comment) {
    throw new Error('Comment not found')
  }
  return comment
}

