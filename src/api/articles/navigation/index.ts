import { extractOutline, OutlineItem } from "@/core/markdown/parser"

export const getArticleOutline = (content: string): OutlineItem[] => {
  return extractOutline(content)
}