'use client'

import { Button } from '@/components/ui/button'
import { Save } from 'lucide-react'

interface EditorToolbarProps {
  onSave?: () => void
  isSaving?: boolean
}

export default function EditorToolbar({ onSave, isSaving }: EditorToolbarProps) {
  return (
    <div className="flex items-center justify-between p-2 border-b bg-muted/50">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onSave} disabled={isSaving}>
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {/* Additional toolbar items can be added here */}
      </div>
    </div>
  )
}
