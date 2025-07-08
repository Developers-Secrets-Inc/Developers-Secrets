---
description:
globs:
alwaysApply: true
---
# Weekly Division Leaderboard Jobs

This rule describes the automated weekly cycle for managing division leaderboards, orchestrated by Payload Jobs triggered via Vercel Cron.

## Triggering

*   Jobs are triggered by Vercel Cron configuration defined in [vercel.json](mdc:vercel.json).
*   Vercel Cron calls the `/api/payload-jobs/run` endpoint with specific queue parameters (`weekly-start` or `weekly-end`).
*   Access to the endpoint is secured via `CRON_SECRET` environment variable check defined in [payload.config.ts](mdc:src/payload.config.ts).

## Job Tasks

Both tasks are defined in [payload.config.ts](mdc:src/payload.config.ts):

1.  **`createWeeklyDivisionLeaderboards` (Queue: `weekly-start`)**
    *   Runs at the beginning of the week (e.g., Monday morning).
    *   Fetches active users and their current divisions from [UserGamification.ts](mdc:src/collections/UserGamification.ts).
    *   Groups users by division.
    *   Creates new [WeeklyDivisionLeaderboards.ts](mdc:src/collections/WeeklyDivisionLeaderboards.ts) records for each group.
    *   Creates corresponding [WeeklyLeaderboardMembers.ts](mdc:src/collections/WeeklyLeaderboardMembers.ts) records linking users to the new leaderboards.

2.  **`processWeeklyLeaderboardResults` (Queue: `weekly-end`)**
    *   Runs at the end of the week (e.g., Sunday night).
    *   Finds unprocessed leaderboards for the completed week.
    *   For each leaderboard:
        *   Calculates each member's score using `getWeeklyUserExperience` from [index.ts](mdc:src/core/gamification/leaderboard/index.ts), which reads [ExperienceLogs.ts](mdc:src/collections/ExperienceLogs.ts).
        *   Updates `weeklyExperience` and `finalRank` in [WeeklyLeaderboardMembers.ts](mdc:src/collections/WeeklyLeaderboardMembers.ts).
        *   Applies promotion/demotion using `findTargetDivision` from [index.ts](mdc:src/core/gamification/divisions/index.ts) and updates [UserGamification.ts](mdc:src/collections/UserGamification.ts).
        *   Awards coin rewards based on rank and definitions in [Divisions.ts](mdc:src/collections/Divisions.ts).
        *   Marks the [WeeklyDivisionLeaderboards.ts](mdc:src/collections/WeeklyDivisionLeaderboards.ts) record as processed.
