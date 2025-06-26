---
title: AchievementsDialog (React Component)
---

# AchievementsDialog

## Description

Le composant `AchievementsDialog` affiche la liste des succès (achievements) d'un utilisateur dans une boîte de dialogue (modal). Il permet de visualiser la progression, les niveaux atteints, les récompenses à venir et l'état de complétion de chaque succès.

## Utilisation

```tsx
<AchievementsDialog
  open={open}
  onOpenChange={setOpen}
  initialAchievements={achievements}
  initialError={error}
/>
```

- `open` : booléen contrôlant l'ouverture de la modal.
- `onOpenChange` : callback pour changer l'état d'ouverture.
- `initialAchievements` : liste des achievements à afficher (voir type `DisplayAchievement`).
- `initialError` : message d'erreur à afficher en cas d'échec du chargement.

## Fonctionnalités

- Affiche chaque achievement avec :
  - Icône selon le type (XP, challenges, streak, etc.)
  - Titre, description, niveau actuel/max, progression vers le prochain palier
  - Badge de complétion ou de niveau
  - Barre de progression
- Gestion des états :
  - Chargement (squelettes)
  - Erreur
  - Aucun succès disponible
- Animation d'apparition (Framer Motion)
- Accessibilité : navigation clavier, responsive

## Types

```typescript
interface DisplayAchievement extends Omit<PayloadAchievement, 'type'> {
  type: 'experience_gained' | 'challenges_completed' | 'streak' | ...
  userProgress?: UserAchievementProgress
  displayLevel: number
  maxLevel: number
  progressTowardsNext: number
  nextTierThresholdDisplay: number
  nextTierDescription: string
  isCompleted: boolean
}
```

## Exemples d'UI

- Succès complété : badge vert, icône colorée, barre pleine
- Succès en cours : badge neutre, barre de progression partielle
- Succès verrouillé : grisé

## Bonnes pratiques

- Utiliser ce composant dans une modal/dialog contrôlée par le parent
- Précharger les données côté serveur ou via React Query
- Gérer les erreurs et loading states pour une UX fluide

## Références
- [Payload Achievement Type](../../../../src/payload-types.ts)
- [UserAchievementProgress](../../../../src/payload-types.ts)