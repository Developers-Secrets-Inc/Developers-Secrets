import { LanguageSelector } from './languages-selector'
import { RunButton } from './run-button'

export const IDEHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border-b flex items-center justify-between px-3 py-2 bg-muted/20 h-12 flex-shrink-0">
      {/* Render children directly for flexible layout by parent */}
      {children}
    </div>
  )
}

export { LanguageSelector, RunButton }