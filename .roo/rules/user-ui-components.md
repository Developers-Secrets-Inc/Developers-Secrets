---
description: 
globs: 
alwaysApply: true
---
# User UI Components

This rule outlines the main React components related to user display and interaction.

## Core Components

*   **`UserAvatar`**: Displays the user's avatar image or initials. Defined in [user-avatar.tsx](mdc:src/core/user/components/user-avatar.tsx).
*   **`UserDropdownMenu`**: The dropdown menu triggered by clicking the user avatar. Shows user details, provides navigation (e.g., Settings), and initiates logout. Defined in [user-dropdown-menu.tsx](mdc:src/core/user/components/user-dropdown-menu.tsx).
*   **`LogoutConfirmationDialog`**: A modal dialog to confirm user logout. Calls the `logoutSessionUser` server action. Defined in [logout-confirmation-dialog.tsx](mdc:src/core/user/components/dialogs/logout-confirmation-dialog.tsx).
*   **`SettingsDialog`**: A comprehensive modal for managing user settings across various categories (General, Profile, Preferences, Subscription, Security). Uses forms and interacts with multiple server actions for persistence. Defined in [settings-dialog.tsx](mdc:src/core/user/components/dialogs/settings-dialog.tsx).
*   **`LoginCard` / `SignupCard`**: Placeholder components intended for login and sign-up forms. Defined in [login-card.tsx](mdc:src/core/user/components/cards/login-card.tsx) and [signup-card.tsx](mdc:src/core/user/components/cards/signup-card.tsx).
*   **Forms**: Reusable form components might be located in `src/core/user/components/forms/` (directory exists but content not shown).

