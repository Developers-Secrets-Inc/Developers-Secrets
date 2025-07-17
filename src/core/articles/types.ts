// Define a utility recursive type for Payload's select.
// This handles nested objects and arrays of objects.
export type PayloadSelect<T> = {
  [K in keyof T]?: T[K] extends ReadonlyArray<infer U> // If it's an array
    ? U extends object // If array elements are objects
      ? PayloadSelect<U> // Recurse for object elements
      : true // If array elements are primitives (like IDs) or other simple types, just include the array
    : T[K] extends object // If it's a non-array object
      ? PayloadSelect<T[K]> // Recurse for object fields
      : true // If it's a primitive (string, number, boolean, etc.)
}

// Define a type that deep-projects an object based on a select object
export type Projected<T extends { id?: any }, S> = {
  id: T['id'] // Always include 'id' as Payload always returns it
} & {
  [K in keyof S]: K extends keyof T // Ensure K exists in T
    ? S[K] extends true // If S[K] is true, include T[K]
      ? T[K]
      : S[K] extends object // If S[K] is an object (nested select)
        ? T[K] extends ReadonlyArray<infer U> // If T[K] is an array of objects
          ? U extends object
            ? Array<Projected<U, S[K]>> // Recursively project array elements
            : T[K] // Array of primitives (keep original type)
          : T[K] extends object // If T[K] is a single object
            ? Projected<T[K], S[K]> // Recursively project the object
            : never // Should not happen if S[K] is object but T[K] is not
        : never // S[K] is false or undefined, omit
    : never // K does not exist in T, omit
}

// Type for the return value of getTutorialBySlug and getArticleBySlugAndType
export type GetProjectedType<
  T extends { id?: any },
  S extends PayloadSelect<T> | undefined,
> = S extends undefined
  ? T // If no select, return full T
  : S extends true // If select is true, return full T
    ? T
    : Projected<T, S>
