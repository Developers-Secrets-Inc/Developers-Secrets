'use server'

import { FileSystemNode } from '@/core/compiler/code-editor/types'
import { query } from '@/core/functions'
import 'server-only'
import { z } from 'zod'
import { generateObject } from 'ai'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'

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
const EvaluationSchema = z.object({
  score: z.number().min(0).max(10).describe('Score from 0 to 10 for code quality'),
  improvements: z.array(z.string()).describe('List of suggested improvements'),
  strengths: z.array(z.string()).describe('Code strengths and good practices found'),
  suggestions: z.array(z.string()).describe('Specific suggestions to improve the code'),
  category: z.enum(['excellent', 'good', 'average', 'needs_improvement', 'poor']).describe('Overall quality category')
})

const openRouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
})

function fileTreeToString(nodes: FileSystemNode[], depth = 0): string {
  return nodes.map(node => {
    const indent = '  '.repeat(depth)
    
    if (node.type === 'file') {
      return `${indent}📄 ${node.name} (${node.language}):\n${node.content}\n\n`
    } else {
      const childrenText = fileTreeToString(node.children, depth + 1)
      return `${indent}📁 ${node.name}/\n${childrenText}`
    }
  }).join('')
}

export async function evaluatePrompt(args: { prompt: string; fileTree: FileSystemNode[] }) {
  try {
    // Convert file tree to readable text
    const codeStructure = fileTreeToString(args.fileTree)
    
    // Generate evaluation using AI SDK
    const result = await generateObject({
      model: openRouter('openai/gpt-4.1-nano'),
      schema: EvaluationSchema,
      prompt: `
Analyze the following code against the given prompt and provide a detailed evaluation.

**Exercise Prompt:**
${args.prompt}

**Submitted Code Structure:**
${codeStructure}

**Evaluation Instructions:**
1. Evaluate code quality on a scale from 0 to 10
2. Check if the code meets the prompt requirements
3. Analyze structure, readability, and best practices
4. Identify strengths and possible improvements
5. Provide concrete and constructive suggestions

**Evaluation Criteria:**
- Prompt requirements compliance (30%)
- Code quality and best practices (25%)
- Structure and organization (20%)
- Readability and documentation (15%)
- Error handling and robustness (10%)
      `,
    })
    
    return result.object
  } catch (error) {
    console.error('Error during evaluation:', error)
    throw new Error('Unable to evaluate code at the moment')
  }
}