export type CourseOutline = {
  courseName: string
  courseSlug: string
  chapters: {
    name: string
    slug: string
    parts: {
      name: string
      slug: string
      completionStatus: 'not_started' | 'in_progress' | 'completed'
    }[]
  }[]
}