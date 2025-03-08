import { Concept } from "./skills"

type Markdown = string


type InitialContentInformations = Readonly<{
  id: string 
  slug: string 

  name: string 
  description: string
}>

// TODO: Add challenge
export type Article = InitialContentInformations & Readonly<{
  content: Markdown

  navigation: {
    // Optional is used to indicate that the article is the first or last one.
    previousSlug: string | null
    nextSlug: string | null
  }

  linkedConcepts: Concept[]
}>

export type Chapter = InitialContentInformations & Readonly<{
  articles: Article[]
  isLocked: boolean

  unlockedCourses?: Course[]
  prerequisites?: Chapter[]
}>


export type Course = InitialContentInformations & Readonly<{
  chapters: Chapter[]

  unlockedCourses: Course[]
  prerequisites: Course[]
}>
