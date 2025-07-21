### Submission System Refactoring Plan

**Primary Objective:** Enhance the robustness, maintainability, and type safety of the challenge submission system.

---

#### **1. Centralize Submission Types and Interfaces**

*   **Current State:** Submission-related types are scattered across `index.client.ts`, `actions.ts` (for Payload data), and `use-submissions.ts` (for React Query data), leading to potential inconsistencies and redundancy.
*   **Proposed Change:** Create a new file `src/core/challenges/submissions/types.ts` to house all core submission-related TypeScript interfaces and types.
    *   Define a base `ISubmission` interface.
    *   Define specific interfaces for each submission type (`IAcceptedSubmission`, `IRunTimeErrorSubmission`, `IWrongAnswerSubmission`, `ITimeLimitExceededSubmission`) extending `ISubmission`.
    *   Define `IPayloadSubmissionData` for the Payload CMS collection, ensuring it can accommodate all specific submission types.
    *   Define `IClientSubmission` for the React Query hook, which might be a simplified version of `IPayloadSubmissionData`.
*   **Impact:** Improved type consistency, reduced redundancy, and easier maintenance of submission data structures across the application.

---

#### **2. Improve Error Handling and Type Safety in `use-submissions.ts`**

*   **Current State:** The `onSuccess` callback in `useSubmissions` hook has TypeScript errors (`'serverSubmission' is possibly 'undefined'`) because the return type of `handleSubmission` is not explicitly guaranteeing `data` on success.
*   **Proposed Change:**
    *   Refine the return type of `handleSubmission` (in `client-actions.ts` and `actions.ts`) to explicitly define the shape of the success and error responses. Use a discriminated union or a `Result` type pattern (similar to `src/core/user/result.ts`) to clearly indicate when `data` is present.
    *   Update the `onSuccess` callback in `use-submissions.ts` to safely access `serverSubmission` properties, potentially by checking `result.success` or narrowing the type.
    *   Ensure `addSubmission.mutationFn` correctly throws an error if `result.success` is false.
*   **Impact:** Eliminates TypeScript errors, makes error handling more explicit, and improves the reliability of optimistic updates.

---

#### **3. Streamline `submitCode` Logic in `index.client.ts`**

*   **Current State:** The `submitCode` function is monolithic, handling code compilation, test execution, and determining the final submission type.
*   **Proposed Change:** Refactor `submitCode` into smaller, more focused functions to improve modularity, readability, and testability:
    *   **Introduce `TestResultErrorDetails` Type:** Create a new type to encapsulate the details of a failed test, including `input`, `expectedOutput`, `actualOutput` (optional), `error` (optional), and `type` (`runtimeError`, `wrongAnswer`, `timeLimitExceeded`). This will provide a structured way to return error information.
    *   **Create `runAllTests` Helper Function:** Extract the core test execution loop into a new asynchronous function, e.g., `runAllTests(code: CodeSubmission, tests: Test[]): Promise<{ passed: number; failedTest?: TestResultErrorDetails }>`. This function will be responsible for sequentially executing all tests, handling compilation errors, incorrect outputs, and time limit exceedances. It will return the number of passed tests and, if a test fails, the `TestResultErrorDetails` of that failure.
    *   **Simplify `submitCode`:** The `submitCode` function will then become much simpler. It will call `runAllTests` and, based on its result (all tests passed or a specific test failed), it will construct and return the appropriate submission type (`AcceptedSubmission`, `WrongAnswerSubmission`, `RunTimeErrorSubmission`, or `TimeLimitExceededSubmission`).
*   **Impact:** Improves readability, modularity, and testability of the core submission logic by clearly separating concerns.

---

#### **4. Review `client-actions.ts` for Simplification**

*   **Current State:** `client-actions.ts` acts as a thin wrapper around the server action `handleSubmission`, primarily for client-side error logging.
*   **Proposed Change:** Keep the current structure for now, as it provides a clear separation and a single point for client-side error interception. Ensure the error logging is comprehensive. Revisit this if direct server action calls become a more common pattern or if the wrapper adds no significant value.
*   **Impact:** Maintains current clear separation while acknowledging potential future simplification.

---

#### **5. Implicit: Payload Collection Schema Alignment**

*   **Current State:** The `SubmissionData` type in `actions.ts` is designed to match the `challenge-submissions` Payload collection.
*   **Proposed Action:** (Verification) Ensure that the actual Payload collection schema defined in `src/collections/ChallengeSubmissions.ts` is fully aligned with the refined `IPayloadSubmissionData` type from `types.ts` (after Step 1). This is crucial for successful data persistence.
*   **Impact:** Guarantees data integrity and prevents schema mismatches between the application and the CMS.

---

This plan provides a structured approach to refactor the submission system, focusing on type safety, modularity, and maintainability.
