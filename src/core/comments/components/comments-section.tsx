'use client'

import { useComments } from '../hooks/use-comments'
import { CommentContext } from '../types'
import { CommentsHistory } from './comments-history'
import { NewCommentForm } from './new-comment-form'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { useUser } from '@/core/user/hooks/use-user'

interface CommentsSectionProps {
  context: CommentContext
}

export const CommentsSection = ({ context }: CommentsSectionProps) => {
  const { user } = useUser()
  const {
    comments,
    totalPages,
    currentPage,
    setPage,
    isLoading,
    isFetching,
    addComment,
    deleteComment,
    addReply,
  } = useComments(context, user?.id)

  const handleCommentSubmit = async (content: string) => {
    if (!user) return
    await addComment.mutateAsync({ content, authorId: user.id })
  }

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <NewCommentForm onSubmit={handleCommentSubmit} />
      </div>

      {isLoading ? (
        <div className="flex justify-center">
          <span className="loading loading-spinner">Loading...</span>
        </div>
      ) : (
        <>
          <CommentsHistory
            comments={comments}
            onDelete={deleteComment.mutateAsync}
            onAddReply={addReply.mutateAsync}
          />

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(1)}
                disabled={currentPage === 1 || isFetching}
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(currentPage - 1)}
                disabled={currentPage === 1 || isFetching}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm">
                Page {currentPage} sur {totalPages}
              </span>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(currentPage + 1)}
                disabled={currentPage === totalPages || isFetching}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage(totalPages)}
                disabled={currentPage === totalPages || isFetching}
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
