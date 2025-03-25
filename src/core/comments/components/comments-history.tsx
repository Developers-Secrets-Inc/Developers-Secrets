import { getUserById } from '@/core/user'
import { Comment } from '@/payload-types'
import { CommentThread } from './comment-thread'

export const CommentsHistory = async ({ comments }: { comments: Comment[] }) => {
  const commentItems = await Promise.all(
    comments.map(async (comment, index) => (
      <div key={comment.id} className={index !== 0 ? 'border-t pt-4' : ''}>
        <CommentThread comment={comment} author={await getUserById(comment.authorId)} />
      </div>
    )),
  )

  return <div>{commentItems}</div>
}
