'use client'

import { useCallback } from 'react'
import { BlockNoteEditor, PartialBlock, Block } from '@blocknote/core'
import { useCreateBlockNote } from '@blocknote/react'

// Define the shape of the object returned by the hook
interface UseSolutionEditorResult {
  editor: BlockNoteEditor | null
  // isReady state is removed as readiness depends on the parent providing blocks
  getCurrentContent: () => Promise<string>
}

/**
 * Normalizes newline spacing in exported Markdown.
 * Replaces sequences of 2 or more newlines with a specific pattern (newline, space, newline)
 * which might be needed for consistent paragraph rendering or to match a specific Markdown flavor.
 * @param markdown The raw Markdown string from the editor.
 * @returns Markdown string with normalized paragraph spacing.
 */
const formatMarkdownParagraphSpacing = (markdown: string): string => {
  return markdown.replace(/\n\n+/g, (match: string) => match.split('\n').join('\n \n'))
}

/**
 * Converts BlockNote blocks to a formatted Markdown string.
 * Handles the conversion using blocksToMarkdownLossy and applies paragraph spacing normalization.
 * @param editor The BlockNoteEditor instance.
 * @param blocks The array of blocks to convert.
 * @returns A promise resolving to the formatted Markdown string.
 */
const convertBlocksToMarkdown = async (
  editor: BlockNoteEditor,
  blocks: Block[],
): Promise<string> => {
  const rawMarkdown = await editor.blocksToMarkdownLossy(blocks)
  return formatMarkdownParagraphSpacing(rawMarkdown)
}

/**
 * Custom hook to manage the BlockNote editor instance
 * and provide content retrieval.
 * It expects the initial content to be provided as parsed blocks.
 *
 * @param initialBlocks Optional initial content as BlockNote blocks.
 * @returns An object containing the editor instance and content getter.
 */
export const useSolutionEditor = (initialBlocks?: PartialBlock[]): UseSolutionEditorResult => {
  // Create the editor instance, directly using initialBlocks if provided.
  const editor = useCreateBlockNote(
    { initialContent: initialBlocks },
    [initialBlocks], // Re-initialize if initialBlocks change reference
  )

  // useCallback ensures the function reference is stable unless the editor changes
  const getCurrentContent = useCallback(async (): Promise<string> => {
    return editor ? await convertBlocksToMarkdown(editor, editor.document) : '' // Return empty string if editor is not available
  }, [editor])

  // Return the editor instance and the content getter function
  // isReady is removed
  return { editor, getCurrentContent }
}
