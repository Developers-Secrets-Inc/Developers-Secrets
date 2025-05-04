---
description: 
globs: 
alwaysApply: true
---
# User Authentication

This rule describes the user authentication system, primarily handled by Supabase.

## Core Functionality

*   **User Creation**: New users are created using Supabase Auth via `createUser` in [auth.ts](mdc:src/core/user/auth.ts). This function also triggers the creation of initial user information in Payload CMS using `createInitialUserInformation` from [index.ts](mdc:src/core/user/index.ts).
*   **Logout**: User sessions are terminated using `logoutSessionUser` in [auth.ts](mdc:src/core/user/auth.ts).
*   **Credential Changes**:
    *   Email updates are handled by `changeUserEmail` in [auth.ts](mdc:src/core/user/auth.ts).
    *   Password updates are handled by `changeUserPassword` in [auth.ts](mdc:src/core/user/auth.ts).

## Types and Errors

*   Basic types like `Email` and `Password` are defined and validated in [types.ts](mdc:src/core/user/types.ts).
*   Authentication-related errors like `UserCreationError` are defined in [errors.ts](mdc:src/core/user/errors.ts).

