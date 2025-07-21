---
description:
globs:
alwaysApply: true
---
# Division Leaderboard UI

This rule describes how the division leaderboard is displayed to the user.

## Entry Point

*   The user accesses the leaderboard via the "Division" button in the [home-sidebar.tsx](mdc:src/components/sidebars/home-sidebar/home-sidebar.tsx).
*   This button opens a dialog containing the main leaderboard component.

## Components

*   **[division-leaderboard.tsx](mdc:src/components/leaderboards/division/division-leaderboard.tsx)**:
    *   The main container component.
    *   Uses `useEffect` to fetch data for the current user's leaderboard group by calling `getUserDivisionLeaderboard` from [index.ts](mdc:src/core/gamification/divisions/index.ts) on the client side.
    *   Handles loading states and error display.
    *   Renders a list of users using the `DivisionLeaderboardUser` component.
*   **[division-leaderboard-user.tsx](mdc:src/components/leaderboards/division/division-leaderboard-user.tsx)**:
    *   Renders a single row in the leaderboard.
    *   Displays the user's rank (with special icons/colors for top ranks), avatar, name, and live weekly XP score.
    *   Highlights the currently logged-in user's row.

## Data Fetching

*   The client-side `DivisionLeaderboard` component fetches data using the `getUserDivisionLeaderboard` server function located in [index.ts](mdc:src/core/gamification/divisions/index.ts).
*   This function identifies the user's current weekly group, fetches all members, calculates their *live* weekly XP using `getWeeklyUserExperience` from [index.ts](mdc:src/core/gamification/leaderboard/index.ts), fetches basic user info, sorts the members, assigns ranks, and returns the ranked list.
