---
title: Achievements - Getters
---

# Achievements – Getters

## Description

Ce module expose les fonctions de récupération des succès (achievements) depuis la base de données Payload CMS.

## Fonctions principales

### `getAchievements()`
- Retourne la liste de tous les achievements actifs.
- Utilise le champ `isActive` pour filtrer.

### `getAchievementById(achievementId)`
- Retourne un achievement précis par son ID (string ou number).
- Retourne `null` si non trouvé.

### `getAchievementsByType(achievementType)`
- Retourne tous les achievements actifs d'un type donné (ex : 'challenges_completed').

## Bonnes pratiques
- Utiliser ces getters côté serveur pour charger les données d'achievements.
- Toujours vérifier la présence de l'achievement (null possible).

## Références
- [Payload Achievement Type](../../../payload-types.ts)