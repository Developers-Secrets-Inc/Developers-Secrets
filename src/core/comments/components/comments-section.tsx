import { getUser } from '@/core/user'
import { Comment } from '@/payload-types'
import { CommentsHistory } from './comments-history'
import { NewCommentForm } from './new-comment-form'

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

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <NewCommentForm onSubmit={handleCommentSubmit} />
      </div>
      <CommentsHistory comments={comments} />
    </div>
  )
}
