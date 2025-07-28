import { CoursePart } from "@/payload-types"

export type CoursePartContextType = {
  coursePart: CoursePart
  metadata: {
    courseSlug: string 
    chapterSlug: string
  }
}