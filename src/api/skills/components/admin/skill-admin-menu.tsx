import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { useState } from 'react'
import { ConceptProgressionDialog } from './concept-progression-dialog'

export function SkillAdminMenu({ skillSlug, userId }: { skillSlug: string; userId: string }) {
  const [openDialog, setOpenDialog] = useState(false)

  return (
    <>
      <ConceptProgressionDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        skillSlug={skillSlug}
        userId={userId}
      />
      <DropdownMenuContent align="end" sideOffset={10} className="w-56">
        <DropdownMenuItem onSelect={() => setOpenDialog(true)}>
          Edit concept progression
        </DropdownMenuItem>
        {/* More items coming soon */}
      </DropdownMenuContent>
    </>
  )
}
