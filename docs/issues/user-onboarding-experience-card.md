## Implement User Onboarding - Experience Card (Step 2)

This pull request implements the second step of the user onboarding process, focusing on the user's current experience.

**Changes include:**

- Created `CurrentExperienceCard.tsx` component.
- Added a `MultipleSelector` for selecting programming languages (Python and React).
- Added a second `MultipleSelector` for selecting concepts related to the chosen languages.
- Implemented logic to dynamically update the concepts based on the selected programming languages using `useMemo`.
- Added a close icon with a tooltip to skip the onboarding process.
- Modified the footer buttons for navigation, including a "Previous Step" button.
- Updated `page.tsx` to include the `CurrentExperienceCard` for step 2.

This addresses issue #47. 