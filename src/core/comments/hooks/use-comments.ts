import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getComments } from '..'
import { CommentContext, CommentResponse } from '../types'
import { Comment } from '@/payload-types'
import { getUserById } from '@/core/user'

// Compteur global pour les IDs temporaires
let tempIdCounter = -1

export const useComments = (context: CommentContext, userId?: string) => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const COMMENTS_PER_PAGE = 10

  const queryKey = ['comments', context.type, context.parentId, userId, page] as const

  const {
    data,
    isLoading: isLoadingComments,
    isFetching,
  } = useQuery<CommentResponse>({
    queryKey,
    queryFn: () =>
      getComments({
        context,
        page,
        limit: COMMENTS_PER_PAGE,
        userId,
      }),
    staleTime: 60000,
    placeholderData: (previousData) => previousData,
  })

  // Fetch authors for all comments
  const authorIds = data?.comments.map((comment) => comment.authorId) ?? []
  const uniqueAuthorIds = [...new Set(authorIds)]

  const { data: authors, isLoading: isLoadingAuthors } = useQuery({
    queryKey: ['authors', uniqueAuthorIds],
    queryFn: async () => {
      const authorPromises = uniqueAuthorIds.map((id) => getUserById(id))
      const authorResults = await Promise.all(authorPromises)
      return Object.fromEntries(uniqueAuthorIds.map((id, index) => [id, authorResults[index]]))
    },
    enabled: uniqueAuthorIds.length > 0,
  })

  const commentsWithAuthors =
    data?.comments.map((comment) => ({
      comment,
      author: authors?.[comment.authorId] ?? null,
    })) ?? []

  const addComment = useMutation({
    mutationFn: async ({ content, authorId }: { content: string; authorId: string }) => {
      return await context.createComment(context.parentId, content, authorId)
    },
    onMutate: async (newComment) => {
      await queryClient.cancelQueries({ queryKey })
      const previousData = queryClient.getQueryData<CommentResponse>(queryKey)

      const tempId = tempIdCounter--
      const tempComment: Comment = {
        id: tempId,
        content: newComment.content,
        authorId: newComment.authorId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        votes: [],
        isReply: false,
        replies: [],
      }

      queryClient.setQueryData<CommentResponse>(queryKey, (old) => ({
        comments: [tempComment, ...(old?.comments || [])],
        totalPages: old?.totalPages ?? 1,
        totalComments: (old?.totalComments ?? 0) + 1,
      }))

      return { previousData }
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const deleteComment = useMutation({
    mutationFn: async (commentId: number) => {
      // Ne pas appeler l'API si c'est un commentaire temporaire
      if (commentId < 0) return
      return await context.deleteComment(commentId)
    },
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey })
      const previousData = queryClient.getQueryData<CommentResponse>(queryKey)

      queryClient.setQueryData<CommentResponse>(queryKey, (old) => {
        if (!old) return { comments: [], totalPages: 1, totalComments: 0 }

        // Fonction pour supprimer une réponse d'un commentaire
        const removeReplyFromComment = (comment: Comment): Comment => ({
          ...comment,
          replies:
            comment.replies?.filter((reply) => {
              if (typeof reply === 'number') {
                return reply !== commentId
              }
              return reply.id !== commentId
            }) || [],
        })

        // Vérifier si c'est un commentaire principal ou une réponse
        const isMainComment = old.comments.some((comment) => comment.id === commentId)

        if (isMainComment) {
          // Supprimer le commentaire principal
          return {
            comments: old.comments.filter((comment) => comment.id !== commentId),
            totalPages: old.totalPages,
            totalComments: Math.max(0, old.totalComments - 1),
          }
        } else {
          // Supprimer la réponse du commentaire parent
          return {
            comments: old.comments.map((comment) => removeReplyFromComment(comment)),
            totalPages: old.totalPages,
            totalComments: Math.max(0, old.totalComments - 1),
          }
        }
      })

      return { previousData }
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
    },
    onSettled: (_, __, commentId) => {
      // Ne pas invalider la requête si c'est un commentaire temporaire
      if (commentId < 0) return
      queryClient.invalidateQueries({ queryKey })
    },
  })

  const addReply = useMutation({
    mutationFn: async ({
      parentCommentId,
      content,
      authorId,
    }: {
      parentCommentId: number
      content: string
      authorId: string
    }) => {
      return await context.createReply(parentCommentId, content, authorId)
    },
    onMutate: async ({ parentCommentId, content, authorId }) => {
      await queryClient.cancelQueries({ queryKey })
      const previousData = queryClient.getQueryData<CommentResponse>(queryKey)

      const tempId = tempIdCounter--
      const tempReply: Comment = {
        id: tempId,
        content,
        authorId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        votes: [],
        isReply: true,
        replies: [],
      }

      queryClient.setQueryData<CommentResponse>(queryKey, (old) => ({
        comments:
          old?.comments.map((comment) =>
            comment.id === parentCommentId
              ? {
                  ...comment,
                  replies: [...(comment.replies || []), tempReply],
                }
              : comment,
          ) ?? [],
        totalPages: old?.totalPages ?? 1,
        totalComments: old?.totalComments ?? 0,
      }))

      return { previousData }
    },
    onError: (_, __, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  })

  return {
    comments: commentsWithAuthors,
    totalPages: data?.totalPages ?? 1,
    totalComments: data?.totalComments ?? 0,
    currentPage: page,
    setPage,
    isLoading: isLoadingComments || isLoadingAuthors,
    isFetching,
    addComment,
    deleteComment,
    addReply,
  }
}
