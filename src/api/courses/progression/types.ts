export type CompletionStatus = 'not_started' | 'in_progress' | 'completed'

export type ChapterPartStatusInfo = {
  id: number
  name: string
  slug: string
  completionStatus: CompletionStatus
}

export type ChapterProgressionData = {
  chapterSlug: string
  chapterName: string
  parts: ChapterPartStatusInfo[]
}

export type PartProgressionDotProps = {
  part: ChapterPartStatusInfo
  currentPartSlug: string
  courseSlug: string
  chapterSlug: string
}