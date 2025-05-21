# feat: Install Storybook base setup

This PR introduces the initial setup for Storybook in the project as per issue #34.

The following steps were performed using `pnpm` and `create-storybook@latest`:

1.  Installed Storybook v8.6.14 for Next.js.
2.  Added necessary dependencies and created the `.storybook/` directory with initial configuration files (`main.ts`, `preview.ts`).
3.  Included example stories in `src/stories/`.
4.  Added the `@storybook/experimental-addon-test` as part of the interactive setup.

**Note on the Test Addon:**
During the installation, the `@storybook/experimental-addon-test` was added. However, the automated setup for this addon failed because it requires the Vite-based builder (`@storybook/experimental-nextjs-vite`), while the standard Next.js integration uses the Webpack-based builder (`@storybook/nextjs`). This issue will need to be addressed if we decide to use the test addon, potentially by migrating to the Vite builder as suggested in the command output.

Future steps will involve configuring Storybook further and writing stories for our components as outlined in issue #34. 