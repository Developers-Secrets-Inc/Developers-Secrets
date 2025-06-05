---
description:
globs:
alwaysApply: true
---
# Division Leaderboard System

This system implements weekly competitive leaderboards based on user divisions.

## Core Concepts

*   **Divisions**: Users are grouped into divisions (e.g., Bronze, Silver) based on performance or level. Defined in [Divisions.ts](mdc:src/collections/Divisions.ts).
*   **Weekly Cycle**: Each week, new leaderboard groups are formed within each division.
*   **Ranking**: Users are ranked within their group based on XP earned during that week.
*   **Promotion/Demotion**: At the end of the week, users can be promoted to a higher division or demoted to a lower one based on their rank percentile, using thresholds defined in the `Divisions` collection.
*   **Rewards**: Users can receive rewards (currently coins) based on their final rank.

## Key Collections

*   [Divisions.ts](mdc:src/collections/Divisions.ts): Defines division properties (name, thresholds, rewards, rank order).
*   [UserGamification.ts](mdc:src/collections/UserGamification.ts): Stores the user's current assigned division.
*   [ExperienceLogs.ts](mdc:src/collections/ExperienceLogs.ts): Records individual XP gains, used for weekly score calculation.
*   [WeeklyDivisionLeaderboards.ts](mdc:src/collections/WeeklyDivisionLeaderboards.ts): Represents a specific leaderboard group for a division in a given week.
*   [WeeklyLeaderboardMembers.ts](mdc:src/collections/WeeklyLeaderboardMembers.ts): Links users to their weekly leaderboard group and stores their final weekly score/rank.

## Core Logic

*   Division assignment and promotion/demotion logic is partially handled by the `processWeeklyLeaderboardResults` job task in [payload.config.ts](mdc:src/payload.config.ts).
*   Helper functions for division logic are in [index.ts](mdc:src/core/gamification/divisions/index.ts).
*   Weekly XP calculation logic is in [index.ts](mdc:src/core/gamification/leaderboard/index.ts).
