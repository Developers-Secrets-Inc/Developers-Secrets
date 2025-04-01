'use client'

import { CodeEditor } from '@/core/compiler/components/editor'
import { handleSubmission } from '@/core/challenges/submissions/actions'

type ChallengeEditorProps = {
  initialCode: string
  language: string
  availableLanguages: {
    value: string
    label: string
  }[]
  codeVersions: Record<string, string>
  tests: Record<string, { input: string; expectedOutput: string }[]>
  challengeId: number
  userId: string
}

export function ChallengeEditor({
  initialCode,
  language,
  availableLanguages,
  codeVersions,
  tests,
  challengeId,
  userId,
}: ChallengeEditorProps) {
  const handleSubmit = async (
    code: {
      content: string
      language: string
    },
    tests: {
      input: string
      expectedOutput: string
    }[],
  ) => {
    await handleSubmission(code, tests, challengeId, userId)
  }

  return (
    <CodeEditor
      initialCode={initialCode}
      language={language}
      showLanguageSelector={true}
      availableLanguages={availableLanguages}
      codeVersions={codeVersions}
      tests={tests}
      onSubmit={handleSubmit}
    />
  )
}
