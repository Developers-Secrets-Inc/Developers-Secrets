import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export const CommentResponseTextArea = ({
    onCancelReply,
    onSubmitReply,
    replyContent,
    setReplyContent,
  }: {
    onCancelReply: () => void
    onSubmitReply: () => void
    replyContent: string
    setReplyContent: (content: string) => void
  }) => {
    return (
      <div className="ml-12 mt-2">
        <Textarea
          placeholder="Write a reply..."
          className="resize-none text-sm min-h-[60px]"
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-2">
          <Button variant="ghost" size="sm" onClick={onCancelReply}>
            Cancel
          </Button>
          <Button size="sm" onClick={onSubmitReply}>
            Reply
          </Button>
        </div>
      </div>
    )
  }