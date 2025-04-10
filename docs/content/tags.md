# Système de Tags

## Vue d'ensemble
Le système de tags permet aux utilisateurs de créer et utiliser des tags de manière flexible, avec un mécanisme de validation basé sur l'usage contextuel.

## Structure de données

### Collection PayloadCMS
```typescript
// src/collections/Tags.ts
import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { value: 'test' },
        { value: 'public' },
      ],
      defaultValue: 'test',
    },
    {
      name: 'usageCount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'creatorId',
      type: 'text',
      required: true,
    },
    {
      name: 'lastUsedAt',
      type: 'date',
      required: true,
    },
  ],
}
```

## Fonctions Core

### Lecture vs Utilisation
Le système fait une distinction claire entre la lecture d'un tag et son utilisation :
- **Lecture** : Simple récupération des informations du tag (pas d'impact sur les statistiques)
- **Utilisation** : Utilisation contextuelle du tag (mise à jour des statistiques)

### Fonctions à implémenter
```typescript
// Création d'un nouveau tag (toujours en status "test")
const createTag = async (name: string, creatorId: string): Promise<void>;

// Récupération d'un tag (simple lecture, pas d'impact sur les stats)
const getTagByName = async (name: string): Promise<Tag>;

// Passage d'un tag en "public" (après vérification des critères)
const setTagToPublic = async (tag: Tag): Promise<void>;

// Utilisation contextuelle d'un tag (met à jour usageCount et lastUsedAt)
const increaseTagUsage = async (tag: Tag, quantity: number): Promise<void>;
```

## Critères de passage en "public"
- Minimum de 10 utilisations
- Au moins 3 utilisateurs différents
- Tag existant depuis plus de 7 jours

## Considérations techniques
- Les statistiques d'utilisation sont mises à jour uniquement lors d'une utilisation contextuelle
- La lecture simple d'un tag n'impacte pas ses statistiques
- L'utilisation est gérée explicitement via la fonction `increaseTagUsage`

## Prochaines étapes
1. Implémenter la collection PayloadCMS
2. Développer les fonctions core avec la distinction lecture/utilisation
3. Créer les composants React
4. Ajouter les tests
5. Documenter le système 