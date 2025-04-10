import { useId } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Tag } from '@/payload-types'
import { useState } from 'react'

interface TagsSelectionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tags: string[]
  selectedTags: string[]
  onConfirm: (selectedTags: string[]) => void
}

export function TagsSelectionDialog({
  open,
  onOpenChange,
  tags,
  selectedTags,
  onConfirm,
}: TagsSelectionDialogProps) {
  const id = useId()
  const [localSelectedTags, setLocalSelectedTags] = useState<string[]>(selectedTags)

  const handleConfirm = () => {
    onConfirm(localSelectedTags)
    onOpenChange(false)
  }

  const toggleTag = (tag: string) => {
    setLocalSelectedTags((current) =>
      current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag],
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Tags</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          {tags.map((tag) => (
            <div key={tag} className="flex items-center gap-2">
              <Checkbox
                id={`${id}-${tag}`}
                checked={localSelectedTags.includes(tag)}
                onCheckedChange={() => toggleTag(tag)}
              />
              <Label htmlFor={`${id}-${tag}`}>{tag}</Label>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
