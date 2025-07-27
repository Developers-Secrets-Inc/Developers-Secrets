export const CodeEditorContainer = ({ children }: { children: React.ReactNode }) => {
  return <div className="h-full flex flex-col overflow-hidden rounded-md">{children}</div>
}
export const CodeEditorHeaderContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border-b h-12 flex items-center justify-between bg-muted/20 pr-2">{children}</div>
  )
}
export const CodeEditorHeaderLeftPart = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center">{children}</div>
}
export const CodeEditorHeaderRightPart = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex items-center gap-2">{children}</div>
}
