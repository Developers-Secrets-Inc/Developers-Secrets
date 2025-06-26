---
title: Achievements - Server Actions
---

# Achievements – Server Actions

## Overview

This module manages achievement progress, validation, and rewards on the server side. It orchestrates the granting of rewards (XP, coins, items), user notifications, and tier (level) management for achievements.

## Main Functions

### `trackAchievementProgress(userId, achievementType, quantity)`
- Increments a user's progress for all active achievements of the given type.
- If a tier threshold is crossed, triggers tier unlock, rewards, and notification.
- Handles creation or update of the user's progress record.

### Tier Rewards
- XP: via `addExperience`
- Coins: via `addCurrency`
- Item: via `addItemToInventory` (fetches item details if needed)
- Notification: via `createNotification` (dynamic content based on tier)

### Tier Management
- Updates the achieved tier index (`setUserAchievementTier`)
- If the last tier is reached and a next achievement is defined, logs info (can be extended)

## Usage Examples

- Call `trackAchievementProgress(userId, 'challenges_completed', 1)` after a challenge is completed
- Call `trackAchievementProgress(userId, 'experience_gained', 50)` after XP is gained

## Best Practices
- Always validate arguments (userId, type, quantity)
- Use helper functions for rewards (XP, coins, items)
- Handle errors gracefully to avoid blocking the user

## References
- [addExperience](../level.ts)
- [addCurrency](../marketplace/currency/index.ts)
- [addItemToInventory](../inventory/index.ts)
- [createNotification](../../notifications/index.ts)
- [Payload Achievement Type](../../../payload-types.ts)