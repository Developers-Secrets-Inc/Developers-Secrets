Currently, linking concepts within articles might not provide immediate context to the reader.
We need to implement a feature where hovering over a linked concept in an article displays a tooltip with a brief definition or summary of that concept.

This should use a custom tooltip component to allow for specific styling and potentially richer content than a standard browser tooltip. The existing `@/components/ui/tooltip.tsx` could serve as a base or reference, but the implementation should be tailored for this specific use case within articles.

The content of the tooltip should be richer than just text, potentially including a title, a brief description, and relevant metadata, similar to the structure provided by a `HoverCard` component. This would allow for a more informative preview of the linked concept.

Here is an example of a `HoverCard` structure that could serve as inspiration for the tooltip content:

```typescript
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export default function HoverCardDemo() {
  return (
    <div className="max-w-md text-sm">
      <HoverCard>
        <HoverCardTrigger asChild>
          <a className="flex size-16 overflow-hidden rounded-md" href="#">
            <img
              className="size-full object-cover"
              src="/dialog-content.png"
              width={382}
              height={216}
              alt="Content image"
            />
          </a>
        </HoverCardTrigger>
        <HoverCardContent className="w-[320px]" showArrow>
          <div className="space-y-3">
            <div className="space-y-1">
              <h2 className="font-semibold">
                Building a Design System with Next.js and Tailwind CSS
              </h2>
              <p className="text-muted-foreground text-sm">
                Learn how to build a comprehensive design system using Tailwind
                CSS, including component architecture, and theme customization.
              </p>
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              <span>8 min read</span>
              <span>·</span>
              <span>Updated 2 days ago</span>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}
```

**Steps:**

- Identify linked concepts in the markdown parsing process or frontend rendering.
- Wrap linked concepts with a component that triggers a tooltip on hover.
- Create a custom tooltip component, potentially based on the existing Shadcn `tooltip.tsx` but designed to accommodate richer content.
- Fetch or generate the content for the tooltip (e.g., from a dictionary of concepts or metadata).
- Ensure accessibility and mobile responsiveness. 