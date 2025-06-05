---
description: 
globs: 
alwaysApply: true
---
# User Information Management

This rule outlines how detailed user profile information is managed using Payload CMS.

## Core Concepts

*   User-specific details beyond basic authentication (like name, avatar, role, preferences) are stored in the `user-informations` Payload collection.
*   This data is linked to the Supabase user via the `userId` field.

## Key Files & Logic

*   **Types & Schemas**: Comprehensive Zod schemas and TypeScript types for all user information fields are defined in [types.ts](mdc:src/core/user/user-informations/types.ts).
*   **Server Actions**: Functions to interact with the Payload collection reside in [index.ts](mdc:src/core/user/user-informations/index.ts). This includes:
    *   `getUserInformations`: Fetches user details by user ID.
    *   `updateUserInformations` (and specific helpers like `updateUserName`, `updateUserRole`): Modifies user data in the Payload collection.
*   **Integration**: The main [index.ts](mdc:src/core/user/index.ts) file integrates Supabase user data with Payload user information, providing functions like `getUser`, `getUserById`, and `createInitialUserInformation`.
*   **Errors**: Specific errors related to finding or managing user information (`UserNotFoundError`, `UserInformationsNotFoundError`, `SupabaseUserNotFoundError`) are defined in [errors.ts](mdc:src/core/user/errors.ts) and [errors.ts](mdc:src/core/user/user-informations/errors.ts).

