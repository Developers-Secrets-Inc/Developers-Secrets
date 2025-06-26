---
title: AchievementsDialog (React Component)
---

# AchievementsDialog

## Overview

The `AchievementsDialog` component displays a user's achievements in a modal dialog. It allows users to view their progress, current and maximum levels, upcoming rewards, and completion status for each achievement.

## Usage

```tsx
<AchievementsDialog
  open={open}
  onOpenChange={setOpen}
  initialAchievements={achievements}
  initialError={error}
/>
```

## Props

- `open` (boolean): Controls whether the dialog is open.
- `onOpenChange` (function): Callback to change the open state.
- `initialAchievements` (DisplayAchievement[] | null): List of achievements to display (see `DisplayAchievement` type).
- `initialError` (string | null): Error message to display if loading fails.

## Features

- Displays each achievement with:
  - Icon based on type (XP, challenges, streak, etc.)
  - Title, description, current/max level, progress toward next tier
  - Completion or level badge
  - Progress bar
- Handles loading (skeletons), error, and empty states
- Animated appearance (Framer Motion)
- Accessible: keyboard navigation, responsive layout

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

## UI Examples

- Completed achievement: green badge, colored icon, full progress bar
- In-progress achievement: neutral badge, partial progress bar
- Locked achievement: grayed out

## Best Practices

- Use this component inside a controlled modal/dialog
- Preload data server-side or with React Query
- Handle errors and loading states for smooth UX

## References
- [Payload Achievement Type](../../../../src/payload-types.ts)
- [UserAchievementProgress](../../../../src/payload-types.ts)