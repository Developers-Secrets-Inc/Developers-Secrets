---
title: Quests System (Assignment, Progress, Rewards)
---

# Quests System – Assignment, Progress, Rewards

## Overview

The quests system provides users with daily quests to complete for rewards (XP, chests, items). It manages quest assignment, progress tracking, completion, and quest replacement. Each user receives a set of quests per day, with difficulty and type variety.

## Usage

- Each day, users are assigned 4 quests: 2 easy, 1 medium, 1 hard.
- Quests track progress (e.g., XP gained, challenges completed) and can be completed for rewards.
- Completing a quest grants XP and a chest (rarity based on difficulty).
- Users can replace a quest (limited by user role) if they don't want to complete it.
- Progress is updated automatically as users perform relevant actions (e.g., gain XP, complete challenges).

## API / Main Functions

### `setUserDailyQuests(userId)`
Assigns a new set of daily quests to the user, replacing any existing quests.

### `getUserQuests(userId)`
Returns all current quests assigned to the user, with progress and completion status.

### `increaseUserQuestProgression(userId, questId, quantity)`
Increments the progress of a specific quest for the user.

### `completeUserQuest(questId, skipExperienceReward?)`
Marks a quest as completed, grants XP and a chest, and sends a notification. If `skipExperienceReward` is true, XP is not granted (used for internal logic).

### `replaceUserQuest(questId)`
Replaces a quest with a new one of the same difficulty, respecting daily replacement limits based on user role.
Returns `{ success, error? }`.

### `getQuestReplacementInfo()`
Returns the user's role, number of replacements used today, and the maximum allowed.

### `areUserDailyQuestsExpired(userId)`
Checks if the user's daily quests have expired (e.g., after 24 hours).

## Types

```typescript
type Quest = {
  id: number;
  title: string;
  type: 'experienceGained' | 'challengesCompleted';
  difficulty: 'easy' | 'medium' | 'hard';
  value: number;
  experience: number;
  // ...other fields
}

type UserQuest = {
  id: number;
  userId: string;
  quest: number | Quest;
  currentProgression: number;
  isCompleted: boolean;
  // ...other fields
}
```

## Best Practices
- Always assign a fresh set of quests each day (replace old ones).
- Track progress automatically based on user actions (XP gain, challenge completion).
- Enforce replacement limits based on user role (basic, pro, max).
- Use notifications to inform users of quest completion and rewards.
- Avoid duplicate quests in the same daily set.

## References
- [Quest Type](../../../payload-types.ts)
- [UserQuest Type](../../../payload-types.ts)
- [Inventory System](./inventory-system.md)
- [Achievements System](./achievements-index.md)