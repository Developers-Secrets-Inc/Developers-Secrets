# Skill Tree System Development Plan

This document outlines the development plan for the new skill tree system, incorporating all discussions and clarifications.

## Goal

Develop a simplified skill tree system with a single `Concepts` collection, where the tree structure is defined externally, and user progression is tracked for both individual concepts and overall skills. The progression of abstract concepts will be a pre-calculated, stored value for O(1) retrieval.

## Phases

### Phase 1: Data Model Definition (Payload CMS Collections)

This phase focuses on defining and modifying the Payload CMS collections to support the skill tree system.

1.  [x] **Modify `Skills` Collection (`src/collections/Skills.ts`)**
    *   **Action:** Add a new field `rootConcepts` to link top-level concepts for each skill tree.
    *   **Field Definition:**
        ```typescript
        {
          name: 'rootConcepts',
          label: 'Root Concepts for this Skill Tree',
          type: 'relationship',
          relationTo: 'concepts', // Relates to the Concepts collection
          hasMany: true,
          required: false,
          admin: {
            description: 'The top-level concepts that form the entry points for this skill tree.',
          },
        },
        ```

2.  [x] **Modify `Concepts` Collection (`src/collections/Concepts.ts`)**
    *   **Action:** Remove `parentSkill` and `parentConcept` fields.
    *   **Action:** Add a `type` field to distinguish between abstract and concrete concepts.
    *   **Action:** Reintroduce `subConcepts` field to define direct parent-child relationships for progression calculation.
    *   **Field Definition (Type):**
        ```typescript
        {
          name: 'type',
          label: 'Concept Type',
          type: 'select',
          options: [
            { label: 'Abstract', value: 'abstract' },
            { label: 'Concrete', value: 'concrete' },
          ],
          required: true,
          defaultValue: 'abstract',
          admin: {
            description: 'Distinguishes between abstract concepts (general ideas like "Loops") and concrete applications/implementations (specific tasks like "Iterate in a loop").',
          },
        },
        ```
    *   **Field Definition (Sub-Concepts):**
        ```typescript
        {
          name: 'subConcepts',
          label: 'Sub-Concepts',
          type: 'relationship',
          relationTo: 'concepts', // Self-relation
          hasMany: true,
          required: false,
          admin: {
            description: 'Concepts that are direct children of this concept. Used for calculating weighted average progression for abstract concepts.',
          },
        },
        ```
    *   **Verification:** Ensure `prerequisiteConcepts` and `nextConcepts` fields are correctly defined as self-relationships (`relationTo: 'concepts'`) to define prerequisites and follow-ups.

3.  [x] **Deprecate/Remove Existing Collections**
    *   **Action:** Deprecate or remove `src/collections/BaseConcepts.ts`. Its functionality is now absorbed into the consolidated `Concepts` collection.
    *   **Action:** Deprecate or remove `src/collections/SkillConcepts.ts`. The link between `Skills` and `Concepts` is now handled by `Skills.rootConcepts` and the `requiredConcepts`/`nextConcepts` relationships within `Concepts`.
    *   **Action:** Deprecate or remove `src/collections/UserImplementationConceptProgressions.ts`. This functionality is not part of the initial simplified system.

4.  [x] **Define `UserOverallSkillProgressions` Collection (`src/collections/UserOverallSkillProgressions.ts`)**
    *   **Action:** Create a new Payload CMS collection to track a user's overall mastery of a top-level `Skill`.
    *   **Fields:**
        *   `user`: `text` (Supabase User ID)
        *   `skill`: `relationship` to `skills`
        *   `overallMasteryPercentage`: `number` (0-100)
        *   `lastUpdated`: `date`
    *   **Indexes:** `user`, `skill` (unique).

5.  [x] **Define `ChallengeConceptOutcomes` Collection (`src/collections/ChallengeConceptOutcomes.ts`)**
    *   **Action:** Create a new Payload CMS collection to represent the progression of concepts within a challenge.
    *   **Fields:**
        *   `challenge`: `relationship` to `challenges` (required, unique).
        *   `conceptProgressions`: `array` of objects, where each object represents a concrete concept's completion within this challenge.
            *   `concept`: `relationship` to `concepts` (required, must be a concrete concept).
            *   `completionPercentage`: `number` (0-100, required).
    *   **Indexes:** `challenge` (unique).

6.  [x] **Update `UserConceptProgressions` Collection (`src/collections/UserConceptProgressions.ts`)**
    *   **Action:** Ensure its `concept` field correctly relates to the modified `Concepts` collection.
    *   **Clarification:** The `progressValue` for *abstract* concepts in this collection will be a *stored, calculated* value, not derived on-the-fly.

### Phase 2: Backend Logic (API & Services)

This phase focuses on implementing the core logic for skill and concept progression, and exposing it via API endpoints. All logic will reside in `src/core/skills/`.

1.  **Core Logic Functions (`src/core/skills/`)**
    *   **`calculateConceptMastery(userId, conceptId)`:**
        *   **For Concrete Concepts:** Calculates mastery based on `ChallengeConceptOutcomes` and user's challenge completion. This value is directly stored in `UserConceptProgressions`.
        *   **For Abstract Concepts:** This function will *not* calculate on-the-fly. Instead, the `progressValue` for abstract concepts will be updated via a "rollup" mechanism (see `updateUserConceptProgression`). It will represent the weighted average of its `subConcepts`.
    *   **`calculateOverallSkillMastery(userId, skillId)`:**
        *   Calculates overall mastery for a `Skill` by averaging the `progressValue` of its `rootConcepts`. This value will be stored in `UserOverallSkillProgressions`.
    *   **`unlockConcept(userId, conceptId)`:**
        *   Checks `prerequisiteConcepts` for the given `conceptId`.
        *   Marks the concept as "unlocked" for the user if prerequisites are met (e.g., `progressValue` > 0).
    *   **`getUserSkillTree(userId)`:**
        *   Fetches and combines data from `Skills`, `Concepts`, `UserConceptProgressions`, and `UserOverallSkillProgressions` to construct the full skill tree structure for a user.
    *   **`updateUserConceptProgression(userId, challengeId)`:**
        *   Triggered upon challenge completion.
        *   **Action:** Retrieve `conceptProgressions` from `ChallengeConceptOutcomes` for the given `challengeId`.
        *   For each concrete concept in `conceptProgressions`, update the `UserConceptProgressions` for the `userId` with the `completionPercentage`.
        *   **Rollup Mechanism:** After a concrete concept's `progressValue` is updated:
            1.  Identify its parent `abstract` concepts (concepts that list this concrete concept in their `subConcepts` field).
            2.  For each parent abstract concept, recalculate its `progressValue` based on the weighted average of its `subConcepts`' current `progressValue` (retrieved from `UserConceptProgressions`).
            3.  Recursively update the parent abstract concept's `UserConceptProgressions` record, triggering further rollups up the tree until a root abstract concept or a skill is reached. This ensures O(1) retrieval for abstract concept progression.
        *   Triggers `unlockConcept` and `calculateOverallSkillMastery`.

2.  **API Endpoints (`src/app/api/skill-tree/`)**
    *   `GET /api/skill-tree`: Returns a list of top-level `Skills` with overall user progression.
    *   `GET /api/skill-tree/:skillId`: Returns the detailed tree for a specific `Skill`, including user progression for all `Concepts` within it.
    *   `GET /api/skill-tree/concept/:conceptId`: Returns details for a specific `Concept`, including user's progression.

3.  **Integration with Challenges**
    *   **Action:** Modify the challenge completion logic (`src/core/challenges/submissions/`) to call `updateUserConceptProgression` after a challenge is successfully completed.

### Phase 3: Frontend Implementation (UI)

This phase focuses on building the user interface for displaying the skill tree.

1.  **Skill Tree Dashboard (`src/app/(frontend)/(dashboard)/skills/page.tsx`)**
    *   **Action:** Implement a page to display a list of top-level `Skills` with their `overallMasteryPercentage`.
    *   **Interaction:** Allow users to click on a `Skill` to navigate to its detailed tree view.
    *   **Data Fetching:** Will use React Query for efficient data management.

2.  **Detailed Skill Tree View (`src/app/(frontend)/(dashboard)/skills/[skill_slug]/page.tsx`)**
    *   **Action:** Implement a page to fetch and render the detailed skill tree for a selected `Skill`.
    *   **Data Fetching:** Will use React Query for efficient data management.
    *   **Visualization:** Use a suitable graph visualization library (e.g., React Flow, D3.js, or custom SVG rendering) to display `Concepts` as nodes and `requiredConcepts`/`nextConcepts`/`subConcepts` as edges.
    *   **Visual Cues:** Differentiate between concept types (abstract/concrete), unlocked/locked status, and display `progressValue` on each node.
    *   **Interaction:** Implement click handlers for nodes to display detailed information about the `Concept`.

3.  **Optimistic UI and React Query Integration**
    *   **Action:** Implement optimistic updates for skill and concept progression in the UI.
    *   **Mechanism:** Utilize React Query's mutation and invalidation features. When a challenge is completed (or any action that updates progression), the UI will optimistically update, and the relevant React Query caches (`skill-tree`, `user-skill-progressions`, etc.) will be invalidated and revalidated upon server confirmation (or page reload).

4.  **UI Components (`src/components/skills/`)**
    *   **`SkillCard.tsx`:** Component for displaying top-level skills on the dashboard.
    *   **`ConceptNode.tsx`:** Component for rendering individual concept nodes within the tree visualization.
    *   **`ConceptDetailPanel.tsx`:** Component to display detailed information about a selected `Concept` (name, description, type, progress, prerequisites, next concepts).

### Phase 4: Integration & Testing

This phase ensures the system is robust and functional.

1.  **Unit Tests:**
    *   **Action:** Write comprehensive unit tests for all new and modified backend logic functions (`calculateConceptMastery`, `calculateOverallSkillMastery`, `unlockConcept`, `getUserSkillTree`, `updateUserConceptProgression`).
    *   **Action:** Test Payload CMS collection definitions and relationships.

2.  **Integration Tests:**
    *   **Action:** Test the full flow from challenge completion to skill progression updates and concept unlocking.
    *   **Action:** Test API endpoints for correct data retrieval and updates.

3.  **Frontend End-to-End (E2E) Tests:**
    *   **Action:** Verify skill tree rendering, navigation, and interactivity.
    *   **Action:** Ensure accurate display of user progression and unlocked status.

## High-Level Flow Diagram (Revised)

```mermaid
graph TD
    A[User Completes Challenge] --> B{Challenge Submission Logic};
    B --> C[Call updateUserConceptProgression];
    C --> D[Retrieve Concept Progressions from ChallengeConceptOutcomes];
    D --> E[Update UserConceptProgressions for Concrete Concept];
    E -- Trigger Rollup --> F{Recalculate Parent Abstract Concept Progress};
    F -- Store in UserConceptProgressions --> G[Recursively Update Ancestors];
    G --> H{Trigger unlockConcept};
    G --> I{Trigger calculateOverallSkillMastery};
    I --> J[Update UserOverallSkillProgressions in DB];
    K[Frontend Skill Tree Dashboard] --> L[Fetch List of Skills with Overall Progress];
    L --> M[Render Skill Cards];
    N[Frontend Detailed Skill Tree View] --> O[Fetch Detailed Skill Tree for selected Skill];
    O --> P[Render Concept Nodes and Relationships];
    E -- Data Sync --> O;
    J -- Data Sync --> L;


