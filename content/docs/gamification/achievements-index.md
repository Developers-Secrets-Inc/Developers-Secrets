---
title: Achievements - Getters
---

# Achievements – Getters

## Overview

This module exposes functions to fetch achievements from the Payload CMS database.

## Main Functions

### `getAchievements()`
- Returns a list of all active achievements.
- Uses the `isActive` field to filter.

### `getAchievementById(achievementId)`
- Returns a specific achievement by its ID (string or number).
- Returns `null` if not found.

### `getAchievementsByType(achievementType)`
- Returns all active achievements of a given type (e.g., 'challenges_completed').

## Best Practices
- Use these getters on the server side to load achievement data.
- Always check for the presence of an achievement (may return null).

## References
- [Payload Achievement Type](../../../payload-types.ts)