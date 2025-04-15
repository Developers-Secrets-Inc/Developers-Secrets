import { CodeEditor, CodeEditorContent, CodeEditorHeader } from '@/core/compiler/components/code-editor'

export default function Page() {
  return (
    <div className="h-screen">
      <CodeEditor
        header={<CodeEditorHeader />}
        content={<CodeEditorContent />}
        language="javascript"
        theme="vs-dark"
        code='console.log("Hello, world!");'
        availableLanguages={[{
            value: 'javascript',
            label: 'JavaScript'
        }, {
            value: 'typescript',
            label: 'TypeScript'
        }, {
            value: 'python',
            label: 'Python'
        }]}
      />
    </div>
  )
}
