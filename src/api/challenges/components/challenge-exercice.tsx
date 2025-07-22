import { CodeEditor } from '@/core/compiler/code-editor'

export const ChallengeExercice = () => {
  return (
    <CodeEditor.Container>
      <CodeEditor.Header.Container>
        <CodeEditor.Header.LeftPart>
            <CodeEditor.FileSystemButton />
        </CodeEditor.Header.LeftPart>
        <CodeEditor.Header.RightPart>
          <CodeEditor.RunButton />
        </CodeEditor.Header.RightPart>
      </CodeEditor.Header.Container>
    </CodeEditor.Container>
  )
}
