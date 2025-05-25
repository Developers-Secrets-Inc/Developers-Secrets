**Report on the Articles Feature**

This feature manages the display of tutorials, articles, examples, and associated references, with a slug-based structure for tutorials and articles.

**File structure and routing:**

*   The main pages for articles, examples, and references are located in `src/app/(frontend)/articles/[tutorial_slug]/`.
*   The `page.tsx` file at the root of `[tutorial_slug]` redirects to the first article of the tutorial.
*   The `examples/page.tsx` and `references/page.tsx` pages redirect respectively to the first example or reference article of the tutorial, if corresponding sections exist. Otherwise, they redirect to the main tutorial page.
*   Specific article, example, and reference pages are located under `[tutorial_slug]/[article_slug]/page.tsx`, `[tutorial_slug]/examples/[example_slug]/page.tsx`, and `[tutorial_slug]/references/[reference_slug]/page.tsx`.
*   `not-found.tsx` pages are present at different levels (`articles`, `[tutorial_slug]`, `[tutorial_slug]/[article_slug]`, etc.) to handle cases where a tutorial or article is not found.

**Key Components:**

*   **`src/app/(frontend)/articles/[tutorial_slug]/[article_slug]/page.tsx`**: This is the main server component for displaying a specific article. It orchestrates data fetching (tutorial, specific article, list of tutorial articles, popular articles, personalized recommendations), handles errors, and renders the other components of the page.
*   **`src/app/(frontend)/articles/[tutorial_slug]/components/article-sidebar.tsx`**: A client component (`'use client'`) that displays the sidebar. It includes a content type switcher (`ArticlesSwitcher`), a search form (`SearchForm`), and navigation within the tutorial (sections and articles). It also manages modals for feedback and support. It uses `useEffect` to load support status client-side.
*   **`src/app/(frontend)/articles/[tutorial_slug]/components/articles-switcher.tsx`**: A client component (`'use client'`) to switch between the tutorial, examples, references, and potentially other sections (like the compiler, currently disabled). Uses a `DropdownMenu`.
*   **`src/app/(frontend)/articles/[tutorial_slug]/[article_slug]/components/article-outline.tsx`**: Likely used to display the structure (outline) of the article.
*   **`src/app/(frontend)/articles/[tutorial_slug]/components/article-content.tsx`**: Displays the main article content and article recommendations (`RecommendedArticles`). Uses the `Markdown` component for rendering text content.
*   **`src/app/(frontend)/articles/[tutorial_slug]/components/markdown.tsx`**: A client component (`'use client'`) for rendering Markdown content. It uses `react-markdown` and `remark-gfm`, and provides custom components for Markdown elements (headings, paragraphs, lists, code blocks, etc.), including syntax highlighting via `CodeBlock` and `CodeBlockCode`. It uses `memo` for render optimization.
*   **`src/app/(frontend)/articles/actions.ts`**: Contains server actions (`'use server'`) to invalidate data cache (`revalidateTag`) related to articles and tutorials. This ensures displayed data is up-to-date.

**Data Flow and Logic:**

1.  When a user navigates to an article (`/articles/[tutorial_slug]/[article_slug]`), the server component `page.tsx` (`src/app/(frontend)/articles/[tutorial_slug]/[article_slug]/page.tsx`) is executed.
2.  This component calls various server functions (potentially cached) from the core application (`@/core/articles`) to fetch necessary data (tutorial, specific article, list of tutorial articles, popular articles, personalized recommendations).
3.  Data is converted into internal types (`convertPayloadArticleToArticle`, `convertPayloadTutorialToTutorial`).
4.  The article outline is generated (`getArticleOutline`).
5.  The various UI components (sidebar, content, outline) are rendered with the fetched data.
6.  The `ArticleSidebar` (client component) displays navigation and handles user interactions (search, feedback, support). It loads support status client-side via a server action.
7.  The `ArticleContent` (server component) passes the Markdown content to the `Markdown` (client component) for display.
8.  Server actions in `actions.ts` are used by other parts of the application (not visible here) to invalidate the cache when article or tutorial data is updated in the CMS (Payload).

**Observations for refactoring:**

*   The `ArticleSidebar.tsx` component is quite long (225 lines) and could benefit from decomposition (`component-size-and-single-responsibility` rule). It manages multiple local states (`feedbackOpen`, `supportOpen`, `supportStatus`) and conditional rendering logic (`getStatusColor`, `orderedMenuItems`). The modals `FeedbackDialog` and `SupportDialog` could potentially be moved to simplify the main sidebar component.
*   The `Markdown.tsx` component is also long (219 lines) and handles the rendering of various Markdown elements. While it uses `memo`, the logic for each element type (h1, p, code, etc.) is integrated, which could be extracted if it becomes more complex. The `TypographyX` components could potentially be rendered directly here rather than via imported separate components if it simplifies the structure without losing clarity. The logic for `parseMarkdownIntoBlocks` seems to circumvent some of the power of `react-markdown`; it might be simpler to let `react-markdown` handle the structure directly unless there's a specific reason for this block-based approach.
*   The `SearchForm.tsx` component is the longest (226 lines) and requires urgent refactoring according to the `component-size-and-single-responsibility` rule.
*   The `ArticlesSwitcher.tsx` component is also close to the limit (135 lines) and could potentially be simplified, perhaps by externalizing the `menuItems` configuration or the reordering logic.
*   The `notFound` error handling logic in pages (`page.tsx` and `[article_slug]/page.tsx`, etc.) is repeated but managed correctly. 