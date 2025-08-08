# Plan de Développement : Architecture Événementielle des Challenges

This document outlines the key steps to implement a robust and reactive event-driven architecture for the challenge system, using Next.js Server Actions and TanStack Query for client-server synchronization.

## Phase 1: Client-Side Event Bus Setup

1.  **Event Bus Creation:**
    *   Define an `event-bus.ts` module (e.g., `src/lib/event-bus.ts`) with a custom, lightweight Publish/Subscribe implementation.
    *   Expose `emit` and `on` functions for event management, ensuring no external dependencies are introduced.

2.  **Initial Integration:**
    *   Identify key client-side event trigger points (e.g., after code submission, after AI evaluation).
    *   Modify <mcsymbol name="SubmitButton" filename="ai-exercice-submit-button.tsx" path="src/api/exercices/ai/components/ai-exercice-submit-button.tsx" startline="39" type="function"></mcsymbol> (<mcfile name="ai-exercice-submit-button.tsx" path="src/api/exercices/ai/components/ai-exercice-submit-button.tsx"></mcfile>) to emit a `submission-completed` event after `submitCode` succeeds.

## Phase 2: Frontend Responsibility Decoupling

1.  **Submission Logic Refactoring:**
    *   Create a new hook or component (e.g., `useChallengeSubmissionHandler`) that subscribes to the `submission-completed` event from the event bus.
    *   Move submission result processing logic (updating `useSubmissionResultsStore`, `useAiEvaluationStore`, `startEvaluation`, `completeEvaluation`) from <mcsymbol name="SubmitButton" filename="ai-exercice-submit-button.tsx" path="src/api/exercices/ai/components/ai-exercice-submit-button.tsx" startline="39" type="function"></mcsymbol> to this new handler.
    *   The submit button should only trigger the `submitCode` call and emit the event.

2.  **Challenge Completion Handling (Frontend):**
    *   Create another hook or component (e.g., `useChallengeCompletionHandler`) that subscribes to a `challenge-completed-client` event (emitted when client-side completion conditions are met, e.g., `aiSuccessPercentage >= 30`).
    *   Move frontend completion logic (`setCompleted`, `openCompletionDialog`, `queryClient.invalidateQueries` for tabs, `progressQuest`) to this handler.

## Phase 3: Server Actions and TanStack Query Integration

1.  **Server Actions Creation:**
    *   Define Server Actions for critical backend operations (e.g., `completeChallengeAction` to add experience, update quests, etc.).
    *   Implement data validation (e.g., with Zod) and robust authentication/authorization checks in each Server Action.

2.  **TanStack Query Mutations:**
    *   In frontend handlers (e.g., `useChallengeCompletionHandler`), replace direct backend action calls (like `setCompleted`, `addExperience`, `trackAchievementProgress`) with TanStack Query mutations that call corresponding Server Actions.
    *   Use mutation `onSuccess` to invalidate relevant TanStack Query caches (`queryClient.invalidateQueries({ queryKey: [...] })`) to refresh client-side data.

3.  **Existing TanStack Query Updates:**
    *   Ensure all `useQuery` calls displaying data potentially modified by Server Actions have well-defined `queryKey`s and are ready for invalidation.

## Phase 4: Testing and Optimization

1.  **Unit and Integration Tests:**
    *   Test each component and hook separately.
    *   Test the complete event flow from user action to frontend update via backend.

2.  **Invalidation Optimization:**
    *   Refine `queryKey`s to minimize unnecessary re-fetches while ensuring data freshness.
    *   Consider using `queryClient.setQueryData` for optimistic updates if justified by user experience.

## Phase 5: Near-Instant Challenge Loading Architecture

1.  **Data Pre-fetching and Caching:**
    *   Implement data pre-fetching for upcoming challenges or challenge-related assets (e.g., problem descriptions, initial code, test cases) using Next.js data fetching mechanisms (e.g., `getServerSideProps`, `getStaticProps`, or client-side pre-fetching with TanStack Query).
    *   Utilize TanStack Query's caching capabilities to store challenge data on the client-side, minimizing subsequent load times.

2.  **Optimized Asset Delivery:**
    *   Analyze and optimize the size and delivery of challenge-related assets (e.g., images, large text files).
    *   Consider using content delivery networks (CDNs) for static assets.

3.  **Lazy Loading and Code Splitting:**
    *   Implement lazy loading for non-critical components and features within the challenge interface to reduce initial bundle size.
    *   Utilize Next.js code splitting to load only the necessary JavaScript for a given challenge.

This plan enables incremental progress toward a cleaner, more secure, and more reactive architecture by leveraging modern Next.js and TanStack Query tools, while also addressing performance for challenge loading.