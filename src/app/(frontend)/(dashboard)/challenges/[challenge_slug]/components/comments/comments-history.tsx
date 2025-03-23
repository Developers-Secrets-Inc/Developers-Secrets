import { Comment } from '@/payload-types'
import { CommentReport, modifyComment, deleteComment, replyToComment, reportComment, downvoteComment, upvoteComment } from '@/core/comments'
import { UserComment } from './user-comment'
import { getUserById } from '@/core/user'

export const CommentsHistory = ({ comments }: { comments: Comment[] }) => {
  return (
    <div>
      {comments.map((comment, index) => (
        <div key={comment.id} className={index !== 0 ? 'border-t pt-4' : ''}>
          <CommentThread comment={comment} />
        </div>
      ))}
    </div>
  )
}

export const CommentThread = async ({ comment }: { comment: Comment }) => {
  const author = await getUserById(comment.authorId)
  
  return (
    <div className="space-y-3">
      <UserComment
        comment={comment}
        author={author}
      />
    </div>
  )
}

// TODO: Handle delete, modifity, upvote, downvote, reply, report
