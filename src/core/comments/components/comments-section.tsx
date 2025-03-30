import { getUser } from '@/core/user'
import { Comment } from '@/payload-types'
import { CommentsHistory } from './comments-history'
import { NewCommentForm } from './new-comment-form'

export const CommentsSection = ({
  comments,
  onCreateComment,
  parentId,
}: {
  comments: Comment[]
  onCreateComment: (parentId: number, content: string, authorId: string) => Promise<void>
  parentId: number
}) => {
  const handleCommentSubmit = async (content: string) => {
    'use server'
    const user = await getUser()

    await onCreateComment(parentId, content, user.id)
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
