import { FileSystemNode } from '@/core/compiler/code-editor/types'
import { z } from 'zod'


const FileSystemNodeSchema: z.ZodType<FileSystemNode> = z.lazy(() =>
  z.union([
    z.object({
      id: z.string(),
      type: z.literal('file'),
      name: z.string(),
      content: z.string(),
      language: z.string(),
      locked: z.boolean().optional()
    }),
    z.object({
      id: z.string(),
      type: z.literal('folder'),
      name: z.string(),
      children: z.array(FileSystemNodeSchema),
      locked: z.boolean().optional()
    })
  ])
)

// Schema for the evaluation response
export const EvaluationSchema = z.object({
  score: z.number().min(0).max(10).describe('Score from 0 to 10 for code quality'),
  improvements: z.array(z.string()).describe('List of suggested improvements'),
  strengths: z.array(z.string()).describe('Code strengths and good practices found'),
  suggestions: z.array(z.string()).describe('Specific suggestions to improve the code'),
  category: z.enum(['excellent', 'good', 'average', 'needs_improvement', 'poor']).describe('Overall quality category')
})
