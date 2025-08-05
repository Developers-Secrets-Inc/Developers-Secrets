'use server'

import { FileSystemNode } from '@/core/compiler/code-editor/types'
import { createOpenRouter } from '@openrouter/ai-sdk-provider'
import { generateObject } from 'ai'
import 'server-only'
import { EvaluationSchema } from './types'

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

