# Système de Commentaires

Ce document détaille la conception et l'implémentation du système de commentaires pour la plateforme de défis de programmation.

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture des données](#architecture-des-données)
3. [Gestion des erreurs](#gestion-des-erreurs)
4. [Composant CommentsSection](#composant-commentssection)
5. [Composants intermédiaires](#composants-intermédiaires)
6. [Composant CommentItem](#composant-commentitem)
7. [Composant CommentForm](#composant-commentform)
8. [Actions serveur](#actions-serveur)
9. [Intégration](#intégration)
10. [Plan de développement](#plan-de-développement)

## Vue d'ensemble

Le système de commentaires prend en charge trois contextes différents :

1. **Commentaires de description de challenge** - Associés à la description d'un défi
2. **Commentaires de solution officielle** - Associés à la solution officielle d'un défi
3. **Commentaires de solution utilisateur** - Associés aux solutions soumises par les utilisateurs

Malgré ces différents contextes, tous les commentaires partagent une structure commune et sont gérés par un composant unifié `CommentsSection`. Des composants intermédiaires spécifiques à chaque contexte (`DescriptionComments`, `OfficialSolutionComments`, `UserSolutionComments`) se chargeront de récupérer les commentaires depuis la collection appropriée et de passer les fonctions nécessaires au composant `CommentsSection`.

## Architecture des données

### Collection `Comments`

```typescript
interface Comment {
  id: string;
  authorId: string;
  content: string;
  votes: number;
  createdAt: Date;
  updatedAt: Date;
  
  // Champs pour la traçabilité et le contexte
  targetType: 'challenge' | 'officialSolution' | 'userSolution';
  targetId: string; // ID de la cible (défi, solution)
  
  // Pour les réponses (optionnel)
  parentId?: string; // ID du commentaire parent
  
  // Modération
  reports?: Array<{
    userId: string;
    reason: string;
    details?: string;
    createdAt: Date;
  }>;
}
```

Cette architecture permet :
- Un stockage unifié de tous les commentaires
- Une gestion efficace des réponses (commentaires imbriquées)
- Un système de modération via les reports
- Une traçabilité claire du contexte de chaque commentaire

### Intégration avec Payload CMS

La collection `Comments` sera implémentée dans Payload CMS avec les champs correspondants à l'interface `Comment`. Cette collection sera créée dans le fichier `src/collections/Comments.ts` et ajoutée à la configuration de Payload CMS.

## Gestion des erreurs

Pour garantir une expérience utilisateur optimale et faciliter le débogage, nous définissons une série d'erreurs personnalisées pour le système de commentaires :

```typescript
// Erreurs de base
class CommentError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CommentError';
  }
}

// Erreurs spécifiques
class CommentCreationError extends CommentError {
  constructor(message: string = 'Erreur lors de la création du commentaire') {
    super(message);
    this.name = 'CommentCreationError';
  }
}

class CommentUpvoteError extends CommentError {
  constructor(message: string = 'Erreur lors du vote positif') {
    super(message);
    this.name = 'CommentUpvoteError';
  }
}

class CommentDownvoteError extends CommentError {
  constructor(message: string = 'Erreur lors du vote négatif') {
    super(message);
    this.name = 'CommentDownvoteError';
  }
}

class CommentReportError extends CommentError {
  constructor(message: string = 'Erreur lors du signalement du commentaire') {
    super(message);
    this.name = 'CommentReportError';
  }
}

class CommentRetrievalError extends CommentError {
  constructor(message: string = 'Erreur lors de la récupération des commentaires') {
    super(message);
    this.name = 'CommentRetrievalError';
  }
}

class CommentNotFound extends CommentError {
  constructor(message: string = 'Commentaire non trouvé') {
    super(message);
    this.name = 'CommentNotFound';
  }
}

class UserNotAuthenticated extends CommentError {
  constructor(message: string = 'Utilisateur non authentifié') {
    super(message);
    this.name = 'UserNotAuthenticated';
  }
}

class InvalidCommentData extends CommentError {
  constructor(message: string = 'Données de commentaire invalides') {
    super(message);
    this.name = 'InvalidCommentData';
  }
}
```

Chaque erreur sera utilisée dans les actions serveur appropriées pour indiquer clairement la nature du problème rencontré.

## Composant CommentsSection

Le composant `CommentsSection` sera un composant React client avec état qui gère l'affichage, la création et l'interaction avec les commentaires.

### Props

```typescript
interface CommentsSectionProps {
  comments: Comment[];
  onCreateComment: (content: string, parentId?: string) => Promise<Comment>;
  onUpvote: (commentId: string) => Promise<void>;
  onDownvote: (commentId: string) => Promise<void>;
  onReportComment: (commentId: string, reason: string, details?: string) => Promise<void>;
}
```

### Comportements

1. **Affichage des commentaires**
   - Tri par votes ou date
   - Pagination pour les listes longues
   - Affichage hiérarchique des réponses (indentation)

2. **Interactions**
   - Upvote/Downvote avec mise à jour optimiste
   - Réponse à un commentaire existant
   - Signalement de commentaires inappropriés

### Gestion d'état

Le composant utilise React Query ou SWR pour :
- Mettre en cache les commentaires
- Implémenter des mutations optimistes
- Synchroniser les données après les actions utilisateur

## Composants intermédiaires

Les composants intermédiaires sont chargés de récupérer les commentaires spécifiques à chaque contexte et de fournir les fonctions de manipulation appropriées au composant `CommentsSection`.

### DescriptionComments

```typescript
interface DescriptionCommentsProps {
  challengeId: string;
}

const DescriptionComments: React.FC<DescriptionCommentsProps> = ({ challengeId }) => {
  // Récupérer les commentaires pour la description du challenge
  // Fournir les fonctions de manipulation spécifiques
  
  return (
    <CommentsSection
      comments={comments}
      onCreateComment={(content, parentId) => createChallengeComment(challengeId, content, parentId)}
      onUpvote={(commentId) => upvoteComment(commentId)}
      onDownvote={(commentId) => downvoteComment(commentId)}
      onReportComment={(commentId, reason, details) => reportComment(commentId, reason, details)}
    />
  );
};
```

### OfficialSolutionComments

```typescript
interface OfficialSolutionCommentsProps {
  challengeId: string;
}

const OfficialSolutionComments: React.FC<OfficialSolutionCommentsProps> = ({ challengeId }) => {
  // Récupérer les commentaires pour la solution officielle
  // Fournir les fonctions de manipulation spécifiques
  
  return (
    <CommentsSection
      comments={comments}
      onCreateComment={(content, parentId) => createOfficialSolutionComment(challengeId, content, parentId)}
      onUpvote={(commentId) => upvoteComment(commentId)}
      onDownvote={(commentId) => downvoteComment(commentId)}
      onReportComment={(commentId, reason, details) => reportComment(commentId, reason, details)}
    />
  );
};
```

### UserSolutionComments

```typescript
interface UserSolutionCommentsProps {
  solutionId: string;
}

const UserSolutionComments: React.FC<UserSolutionCommentsProps> = ({ solutionId }) => {
  // Récupérer les commentaires pour la solution utilisateur
  // Fournir les fonctions de manipulation spécifiques
  
  return (
    <CommentsSection
      comments={comments}
      onCreateComment={(content, parentId) => createUserSolutionComment(solutionId, content, parentId)}
      onUpvote={(commentId) => upvoteComment(commentId)}
      onDownvote={(commentId) => downvoteComment(commentId)}
      onReportComment={(commentId, reason, details) => reportComment(commentId, reason, details)}
    />
  );
};
```

## Composant CommentItem

Le composant `CommentItem` est responsable de l'affichage individuel de chaque commentaire.

### Props

```typescript
interface CommentProps {
  comment: Comment;
  onUpvote: (commentId: string) => Promise<void>;
  onDownvote: (commentId: string) => Promise<void>;
  onReply: (commentId: string, content: string) => Promise<void>;
  onReportComment: (commentId: string, reason: string, details: string) => Promise<void>;
  isReply?: boolean;
}
```

### Comportements

1. **Affichage des informations de l'auteur**
   - Avatar, nom, date de publication
2. **Affichage du contenu du commentaire**
3. **Gestion des interactions**
   - Affichage des actions (répondre, signaler)
   - Gestion de l'état de réponse (affichage du formulaire de réponse)
4. **Affichage des réponses**
   - Affichage hiérarchique des réponses (indentation)
   - Possibilité de masquer/afficher les réponses

## Composant CommentForm

Le composant `CommentForm` est un formulaire pour la création de nouveaux commentaires ou de réponses.

### Props

```typescript
interface CommentFormProps {
  onSubmit: (content: string) => void;
  isReply?: boolean;
  parentId?: string;
  isLoading?: boolean;
}
```

### Comportements

1. **Affichage d'un champ de texte**
2. **Gestion de la soumission du formulaire**
3. **Gestion de l'état de chargement**

## Actions serveur

Les actions suivantes seront implémentées dans `src/app/actions/comment-actions.ts` :

```typescript
// Création
async function createComment(content: string, targetType: string, targetId: string, parentId?: string): Promise<Comment>;
async function createChallengeComment(challengeId: string, content: string, parentId?: string): Promise<Comment>;
async function createOfficialSolutionComment(challengeId: string, content: string, parentId?: string): Promise<Comment>;
async function createUserSolutionComment(solutionId: string, content: string, parentId?: string): Promise<Comment>;

// Interactions
async function upvoteComment(commentId: string): Promise<void>;
async function downvoteComment(commentId: string): Promise<void>;
async function reportComment(commentId: string, reason: string, details?: string): Promise<void>;

// Récupération
async function getComments(targetType: string, targetId: string, page?: number, limit?: number): Promise<{comments: Comment[], total: number}>;
async function getChallengeComments(challengeId: string, page?: number, limit?: number): Promise<{comments: Comment[], total: number}>;
async function getOfficialSolutionComments(challengeId: string, page?: number, limit?: number): Promise<{comments: Comment[], total: number}>;
async function getUserSolutionComments(solutionId: string, page?: number, limit?: number): Promise<{comments: Comment[], total: number}>;
```

### Authentification

Toutes les actions qui nécessitent une authentification utiliseront la fonction `getUser()` de `src/core/user/index.ts` pour récupérer l'utilisateur actuel. Si l'utilisateur n'est pas authentifié, une erreur `UserNotAuthenticated` sera levée.

### Logique d'optimisation

Pour améliorer les performances :
- Pagination côté serveur des commentaires
- Chargement différé des réponses
- Mise en cache appropriée des requêtes fréquentes

## Intégration

L'intégration du système de commentaires dans les différentes sections :

### Commentaires de description de challenge

```tsx
<DescriptionComments challengeId={challenge.id} />
```

### Commentaires de solution officielle

```tsx
<OfficialSolutionComments challengeId={challenge.id} />
```

### Commentaires de solution utilisateur

```tsx
<UserSolutionComments solutionId={userSolution.id} />
```

## Plan de développement

### Phase 1 : Architecture des données
- Création de la collection `Comments` dans Payload CMS
- Création des classes d'erreurs personnalisées
- Ajout des hooks nécessaires pour la gestion des votes

### Phase 2 : Actions serveur
- Implémentation des actions de création/votes/signalements
- Intégration avec l'authentification Supabase
- Gestion des erreurs personnalisées

### Phase 3 : Composants UI
- Développement du composant `CommentsSection`
- Création du composant `CommentItem` pour l'affichage individuel
- Implémentation du formulaire de création de commentaires
- Développement du système de réponses imbriquées

### Phase 4 : Composants intermédiaires
- Implémentation des composants `DescriptionComments`, `OfficialSolutionComments` et `UserSolutionComments`
- Tests d'intégration avec l'interface utilisateur
- Optimisation des performances (mise en cache, pagination)

### Phase 5 : Modération et sécurité
- Système de signalement de commentaires
- Interface d'administration pour la modération
- Protection contre le spam et les abus

### Phase 6 : Tests et déploiement
- Tests unitaires et d'intégration
- Déploiement par étapes pour chaque contexte de commentaires
- Surveillance des performances et ajustements

## Avantages de cette approche

1. **Uniformité** - Un seul système pour tous les types de commentaires
2. **Extensibilité** - Facilement adaptable à de nouveaux contextes
3. **Maintenance** - Code centralisé pour les fonctionnalités communes
4. **Expérience utilisateur** - Interface cohérente à travers la plateforme
5. **Performance** - Optimisations ciblées pour améliorer les temps de chargement
6. **Sécurité** - Gestion robuste des erreurs et de l'authentification