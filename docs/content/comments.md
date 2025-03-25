# Optimisation des Commentaires

## Architecture Actuelle
Les commentaires sont actuellement implémentés comme des composants client-side avec :
- Gestion d'état locale avec useState
- Rendu côté client pour tous les composants
- Chargement dynamique des données

## Objectifs d'Optimisation
1. Migration vers Server Components
2. Génération statique partielle des commentaires
3. UI Optimiste pour les interactions

## Plan d'Architecture

### 1. Migration vers Server Components

#### Composants à migrer en Server Components
- `CommentContent` : Affichage statique du contenu
- `CommentAvatar` : Rendu de l'avatar utilisateur
- `CommentHeader` : Information de l'en-tête (sauf les actions)
- `CommentThread` : Container des commentaires

#### Composants à garder en Client Components
- `Comment` (composant principal) : Gestion des états et interactions
- `CommentActions` : Interactions utilisateur
- `NewCommentForm` : Formulaire d'ajout
- `CommentVotes` : Système de vote
- `ReportCommentDialog` : Modal de signalement

### 2. Architecture Hybride Statique/Dynamique

#### Génération Statique des Commentaires
- Utilisation de `generateStaticParams` pour pré-générer les pages de commentaires existants
- Régénération périodique via revalidate au niveau page (ex: toutes les 60 secondes)
- Les commentaires existants sont transformés en HTML statique lors du build

#### Server Actions pour les Interactions
```typescript
// Exemple conceptuel de l'architecture
'use server'
// Actions pour gérer les interactions avec les commentaires statiques
async function interactWithStaticComment() {
  // Logique d'interaction sans invalider le HTML statique
}

// Actions pour les nouveaux commentaires
async function handleNewComments() {
  // Gestion séparée des nouveaux commentaires
}
```

#### Séparation des Flux de Données
1. **Commentaires Statiques**
   - Générés au build time
   - Stockés comme HTML statique
   - Interactions gérées via Server Actions
   - Pas de refetch nécessaire pour le contenu de base

2. **Nouveaux Commentaires**
   - Chargés et affichés séparément
   - Rendu côté client avec état local
   - Synchronisation en temps réel possible
   - Interface distincte du contenu statique

### 3. UI Optimiste

#### Stratégie d'Implémentation
1. Server Actions avec gestion optimiste
2. Mise à jour immédiate de l'UI avant confirmation serveur
3. Gestion des erreurs et rollback en cas d'échec

#### Architecture des Mutations
- Server Actions pour toutes les mutations (votes, réponses, etc.)
- Cache local pour les interactions avec les commentaires statiques
- État séparé pour les nouveaux commentaires
- Synchronisation périodique avec le serveur

#### Gestion des États
1. **État Statique**
   - HTML pré-rendu pour les commentaires existants
   - Cache local pour les interactions (votes, réponses)
   - Invalidation sélective via Server Actions

2. **État Dynamique**
   - État React pour les nouveaux commentaires
   - Synchronisation bidirectionnelle avec le serveur
   - Fusion progressive avec le contenu statique lors des rebuilds 