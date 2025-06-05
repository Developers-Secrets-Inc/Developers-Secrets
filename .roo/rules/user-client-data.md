---
description: 
globs: 
alwaysApply: true
---
# User Client-Side Data Fetching

This rule describes how user data is fetched and managed on the client-side.

## Hook

*   **`useSessionUser`**: Located in [use-user.ts](mdc:src/core/user/hooks/use-user.ts), this React hook utilizes `@tanstack/react-query`.
*   It calls the `getUser` server action (from [index.ts](mdc:src/core/user/index.ts)) to fetch the combined Supabase and Payload information for the currently logged-in user.
*   Provides standard query states: `user` data, `isLoading`, `isError`, and `error`.

