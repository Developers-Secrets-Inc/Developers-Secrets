import { Concept } from "./skills"

type Markdown = string
type Code = string
type Language = "py" | "js" | "ts"


type InitialContentInformations = Readonly<{
  id: string 
  slug: string 

  name: string 
  description: string
}>


export type ArticleChallenge = Readonly<{
  id: string 
  solution: Markdown

  language: Language
  initialCode: Code

  tests: {
    input: Code 
    expectedOutput: Code
  }[]
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


// TODO: Add learning path (like backend, frontend, etc.)
export type Course = InitialContentInformations & Readonly<{
  chapters: Chapter[]
  // This system should be completely polymorphic. We should not think
  // about a specific role. In the code, we will have something like :
  //
  // if not (user.role === course.requiredUserRole) {
  //   throw new Error("User is not authorized to access this course.");
  // }
  requiredUserRole: "basic" | "pro" | "max" // TODO: Replace with a common role type. Like `UserRole`.
  status: "draft" | "published" | "archived"

  // ? Courses that can be unlocked after completing this course.
  unlockedCourses: Course[]

  // ? Courses or chapters that must be completed before completing this course.
  // Why also chapters ? For example, if the user finished the OOP chapter 
  // in the "Python", we could unlock the Advanced OOP course. We do not need
  // to finish the whole course to unlock it.
  prerequisites: (Course | Chapter)[]
}>

export type UserCourseProgression = {
  isAccomplished: boolean;
  prerequisitesCompleted: boolean;

}
