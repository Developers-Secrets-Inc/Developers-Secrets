---
title: Achievements - Server Actions
---

# Achievements – Server Actions

## Description

Ce module gère la progression, la validation et la récompense des succès (achievements) côté serveur. Il orchestre l'attribution des récompenses (XP, pièces, objets), la notification utilisateur et la gestion des paliers (tiers).

## Fonctions principales

### `trackAchievementProgress(userId, achievementType, quantity)`
- Incrémente la progression d'un utilisateur pour tous les achievements actifs du type donné.
- Si un palier est franchi, déclenche la validation du palier, l'attribution des récompenses et la notification.
- Gère la création ou la mise à jour du record de progression.

### Récompenses de palier
- XP : via `addExperience`
- Pièces : via `addCurrency`
- Objet : via `addItemToInventory` (récupère les détails de l'objet si besoin)
- Notification : via `createNotification` (contenu dynamique selon le palier)

### Gestion des paliers
- Mise à jour de l'index de palier atteint (`setUserAchievementTier`)
- Si le dernier palier est atteint et qu'un achievement suivant est défini, log d'information (extension possible)

## Exemples d'usage

- Appeler `trackAchievementProgress(userId, 'challenges_completed', 1)` après la complétion d'un challenge
- Appeler `trackAchievementProgress(userId, 'experience_gained', 50)` après un gain d'XP

## Bonnes pratiques
- Toujours vérifier la validité des arguments (userId, type, quantité)
- Utiliser les helpers pour l'attribution des récompenses (XP, pièces, objets)
- Gérer les erreurs silencieusement pour ne pas bloquer l'utilisateur

## Références
- [addExperience](../level.ts)
- [addCurrency](../marketplace/currency/index.ts)
- [addItemToInventory](../inventory/index.ts)
- [createNotification](../../notifications/index.ts)
- [Payload Achievement Type](../../../payload-types.ts)