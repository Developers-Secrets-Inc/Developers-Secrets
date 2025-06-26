---
title: Achievements - User Progress Tracking
---

# Achievements – User Progress Tracking

## Overview

This module manages the tracking and updating of user progress for achievements. It provides functions to fetch, create, and update progress records for each user-achievement pair, as well as to manage tier advancement.

## Main Functions

### `getUserAchievementProgress(userId, achievementId)`
- Fetches the progress record for a specific user and achievement.
- Returns `UserAchievementProgress | null`.

### `getAllUserAchievementProgress(userId, includeAchievementData?)`
- Fetches all achievement progress records for a user.
- If `includeAchievementData` is true, embeds full achievement data.

### `updateAchievementProgressRecord(userId, achievementId, progressIncrement)`
- Creates or updates a user's progress for a specific achievement.
- Increments the current progress by the given amount.
- Returns the updated or newly created progress record.

### `setUserAchievementTier(userId, achievementId, newTierIndex)`
- Updates the achieved tier index for a user's progress record.
- Does nothing if the record does not exist or the tier is already set.

## Types

```typescript
interface UserAchievementProgress {
  id: number;
  userId: string;
  achievement: number | Achievement;
  currentProgress: number;
  currentTierIndex: number;
  // ...other fields
}
```

## Best Practices
- Always check for the existence of a progress record before updating the tier.
- Use `updateAchievementProgressRecord` to safely increment progress (handles creation if needed).
- Use `getAllUserAchievementProgress` for dashboards or analytics.

## References
- [Payload UserAchievementProgress Type](../../../payload-types.ts)
- [Achievements - Server Actions](./achievements-action.md)