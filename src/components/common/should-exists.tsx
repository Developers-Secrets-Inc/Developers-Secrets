import { notFound } from 'next/navigation'

// This function takes an element of any type T that might be null or undefined.
// If the element is null or undefined, it calls Next.js's notFound() function,
// which stops execution and renders the not-found page.
// Otherwise, it returns the element, which is guaranteed to be of type T.
// This is useful for fetching data that must exist for the page to render.
export const ShouldExists = <T,>({ element }: { element: T | null | undefined }): T => {
  if (element === null || element === undefined) {
    // notFound() throws an error, so the code below is unreachable.
    // However, TypeScript requires a return type that covers the successful path.
    notFound()
  }
  return element
}
