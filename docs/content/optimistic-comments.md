# Système de Commentaires avec Pagination et Mises à Jour Optimistes

Ce document détaille l'implémentation d'un système de commentaires moderne utilisant React Query pour la gestion d'état et incluant une pagination élégante.

## Architecture Globale

Le système repose sur quatre piliers :
1. React Query pour la gestion d'état et les requêtes
2. Pagination avec priorité aux commentaires de l'utilisateur
3. Mises à jour optimistes pour une UX fluide
4. Architecture extensible pour différents contextes de commentaires

## Contextes de Commentaires

Le système est conçu pour gérer différents contextes de commentaires :

1. **Commentaires de Challenge** :
   - **Description** :
     - Attachés à `challenge.description.comments`
     - Utilisés pour discuter de l'énoncé du challenge
     - Accessibles via `getChallengeDescriptionComments`
   - **Solution Officielle** :
     - Attachés à `challenge.officialSolution.comments`
     - Utilisés pour discuter de la solution officielle
     - Accessibles via `getChallengeOfficialSolutionComments`

2. **Commentaires de Solution Utilisateur** :
   - Attachés à `userSolution.comments`
   - Utilisés pour discuter des solutions proposées par les utilisateurs
   - Accessibles via `getUserSolutionComments`

## Implémentation

### 1. Types et Interfaces

```typescript
type CommentContext = {
  type: 'challenge_description' | 'challenge_solution' | 'user_solution';
  parentId: number;
  getComments: (parentId: number) => Promise<Comment[]>;
  createComment: (parentId: number, content: string, authorId: string) => Promise<void>;
}

interface GetCommentsOptions {
  context: CommentContext;
  page: number;
  limit: number;
  userId?: string;
}
```

### 2. Configuration du Backend

```typescript
export const getComments = async ({
  context,
  page = 1,
  limit = 10,
  userId
}: GetCommentsOptions) => {
  const payload = await getPayload({ config })

  // Récupérer les commentaires existants selon le contexte
  const existingComments = await context.getComments(context.parentId)

  // Récupérer les commentaires de l'utilisateur en premier
  const userComments = userId ? await payload.find({
    collection: 'comments',
    where: {
      and: [
        { authorId: { equals: userId } },
        { id: { in: existingComments.map(c => c.id) }}
      ]
    },
    sort: '-createdAt',
  }) : { docs: [] }

  // Puis les autres commentaires
  const otherComments = await payload.find({
    collection: 'comments',
    where: {
      and: [
        { id: { in: existingComments.map(c => c.id) }},
        ...(userId ? [{ authorId: { not_equals: userId } }] : [])
      ]
    },
    page,
    limit: userId ? Math.max(0, limit - userComments.docs.length) : limit,
    sort: '-createdAt',
  })

  return {
    comments: [...userComments.docs, ...otherComments.docs].slice(0, limit),
    totalPages: Math.ceil(otherComments.totalDocs / limit),
    totalComments: otherComments.totalDocs + userComments.docs.length
  }
}
```

### 3. Contextes Prédéfinis

```typescript
export const commentContexts = {
  challengeDescription: (challengeId: number): CommentContext => ({
    type: 'challenge_description',
    parentId: challengeId,
    getComments: getChallengeDescriptionComments,
    createComment: createDescriptionComment
  }),

  challengeSolution: (challengeId: number): CommentContext => ({
    type: 'challenge_solution',
    parentId: challengeId,
    getComments: getChallengeOfficialSolutionComments,
    createComment: createOfficialSolutionComment
  }),

  userSolution: (solutionId: number): CommentContext => ({
    type: 'user_solution',
    parentId: solutionId,
    getComments: getUserSolutionComments,
    createComment: createUserSolutionComment
  })
}
```

### 4. Hook React Query

```typescript
export const useComments = (context: CommentContext, userId?: string) => {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const COMMENTS_PER_PAGE = 10

  const {
    data,
    isLoading
  } = useQuery({
    queryKey: ['comments', context.type, context.parentId, userId, page],
    queryFn: () => getComments({
      context,
      page,
      limit: COMMENTS_PER_PAGE,
      userId
    }),
    staleTime: 60000,
    keepPreviousData: true
  })

  const addComment = useMutation({
    mutationFn: async ({ content, authorId }) => {
      return await context.createComment(context.parentId, content, authorId)
    },
    onMutate: async (newComment) => {
      await queryClient.cancelQueries(['comments', context.type, context.parentId])
      const previousData = queryClient.getQueryData(['comments', context.type, context.parentId])
      
      queryClient.setQueryData(['comments', context.type, context.parentId], (old: any) => ({
        ...old,
        comments: [
          {
            id: `temp-${Date.now()}`,
            ...newComment,
            createdAt: new Date().toISOString()
          },
          ...old.comments
        ]
      }))

      return { previousData }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(['comments', context.type, context.parentId], context?.previousData)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['comments', context.type, context.parentId])
    }
  })

  return {
    comments: data?.comments ?? [],
    totalPages: data?.totalPages ?? 1,
    currentPage: page,
    setPage,
    isLoading,
    addComment
  }
}
```

### 5. Composant Principal

```typescript
interface CommentsSectionProps {
  context: CommentContext;
  user: User | null;
}

export const CommentsSection = ({ context, user }: CommentsSectionProps) => {
  const {
    comments,
    totalPages,
    currentPage,
    setPage,
    isLoading,
    addComment
  } = useComments(context, user?.id)

  return (
    <div className="space-y-6">
      <NewCommentForm
        onSubmit={content => addComment({ content, authorId: user?.id })}
      />

      {isLoading ? (
        <CommentsSkeleton />
      ) : (
        <>
          <div className="space-y-4">
            {comments.map(comment => (
              <Comment
                key={comment.id}
                comment={comment}
                isAuthor={comment.authorId === user?.id}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <PaginationComponent
              currentPage={currentPage}
              totalPages={totalPages}
              paginationItemsToDisplay={5}
              onPageChange={setPage}
            />
          )}
        </>
      )}
    </div>
  )
}
```

### 6. Utilisation

```typescript
// Pour les commentaires de description de challenge
<CommentsSection
  context={commentContexts.challengeDescription(challenge.id)}
  user={user}
/>

// Pour les commentaires de solution officielle
<CommentsSection
  context={commentContexts.challengeSolution(challenge.id)}
  user={user}
/>

// Pour les commentaires de solution utilisateur
<CommentsSection
  context={commentContexts.userSolution(solution.id)}
  user={user}
/>
```

## Avantages de cette Approche

1. **Extensibilité** :
   - Architecture générique adaptable à tout type de commentaires
   - Ajout facile de nouveaux contextes sans modifier le code existant
   - Réutilisation du même composant pour tous les cas d'usage

2. **Séparation des Responsabilités** :
   - Logique de récupération des commentaires isolée par contexte
   - Interface unifiée via le type `CommentContext`
   - Configuration centralisée des contextes

3. **Performance** :
   - Mise en cache intelligente avec React Query
   - Pagination efficace par contexte
   - Mises à jour optimistes fluides

4. **Maintenabilité** :
   - Code modulaire et typé
   - Configuration déclarative des contextes
   - Facilement testable

## Prochaines Étapes

1. Ajout de la modification et suppression des commentaires
2. Système de réponses aux commentaires
3. Intégration des notifications en temps réel
4. Ajout de filtres spécifiques par contexte
5. Système de modération par contexte
