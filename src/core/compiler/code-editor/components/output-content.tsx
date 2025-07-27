'use client'

import { useFooterStore } from '../store/footer-store'

export const OutputContent = () => {
  const { executionOutput } = useFooterStore()

  if (!executionOutput) {
    return (
      <div className="flex items-center justify-center text-muted-foreground" style={{ height: 'calc(100% - 24px)' }}>
        No execution output available. Run your code to see the result here.
      </div>
    )
  }

  return (
    <div className="overflow-auto p-4" style={{ height: 'calc(100% - 24px)' }}>
      <pre className="whitespace-pre-wrap font-mono text-sm">
        {executionOutput}
      </pre>
    </div>
  )
}