export const CodeEditorContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="h-full flex flex-col overflow-hidden">{children}</div>
}

export const CodeEditorHeaderContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border-b h-12.5 flex items-center justify-between px-3 py-2 bg-muted/20">
      {children}
    </div>
  )
}

export const CodeEditorHeaderLeftPart = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center">{children}</div>
}

export const CodeEditorHeaderRightPart = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center gap-2">{children}</div>
}


/*

<CodeEditor.Footer.Container>
    <CodeEditor.Footer.Tabs>
    <CodeEditor.Footer.TabsContent>
<CodeEditor.Footer.Container />

*/