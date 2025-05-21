### Subject: Add MDX support to the Markdown component

### Description:

The current `Markdown` component located in `src/components/markdown.tsx` uses `react-markdown` and `remark-gfm` to render standard Markdown content. 

We need to enhance this component to support MDX (Markdown with JSX) to allow for more dynamic and interactive content within our Markdown files. This involves replacing or augmenting the current parsing logic to handle embedded JSX components.

**Target file:** `src/components/markdown.tsx`

**Acceptance Criteria:**
- The `Markdown` component can correctly parse and render standard Markdown.
- The component can correctly parse and render MDX syntax, including embedded React components.
- Appropriate dependencies for MDX parsing are added.
- The implementation follows best practices for Next.js and React components.

### Why is this needed?

Supporting MDX will allow us to create richer content for articles, documentation, and other areas of the application where we use Markdown, enabling the inclusion of interactive elements directly within the content. 