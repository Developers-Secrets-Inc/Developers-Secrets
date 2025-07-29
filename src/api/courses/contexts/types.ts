import { CoursePart, CoursePartAiChat } from '@/payload-types'
import { Message } from 'ai'

export type CoursePartContextType = {
  coursePart: CoursePart
  metadata: {
    courseSlug: string
    chapterSlug: string
    coursePartAIChat: CoursePartAiChat
    messages: Message[]
    quotas: number
  }
}
