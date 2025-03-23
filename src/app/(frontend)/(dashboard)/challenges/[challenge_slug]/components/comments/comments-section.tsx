import { getUser } from '@/core/user'
import { NewCommentForm } from './new-comment-form'
import { Comment } from '@/payload-types'
import {
  modifyComment,
  deleteComment,
  replyToComment,
  upvoteComment,
  reportComment,
  downvoteComment,
} from '@/core/comments'
import { CommentsHistory } from './comments-history'

export const CommentsSection = ({
  comments,
  challengeId,
  onCreateComment,
}: {
  comments: Comment[]
  onCreateComment: (challengeId: number, content: string, authorId: string) => Promise<void>
  challengeId: number
}) => {
  const handleCommentSubmit = async (content: string) => {
    'use server'
    const user = await getUser()

    await onCreateComment(challengeId, content, user.id)
  }

  console.log(comments)

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <NewCommentForm onSubmit={handleCommentSubmit} />
      </div>
      <CommentsHistory comments={comments} />
    </div>
  )
}
