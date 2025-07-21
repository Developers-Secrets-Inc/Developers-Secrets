import { useComment } from '../hooks/use-comment'

export const CommentContent = () => {
  const { comment } = useComment()

  return <p className="text-sm mb-2">{comment.content}</p>
}
