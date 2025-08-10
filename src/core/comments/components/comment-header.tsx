import { CustomTooltip } from '@/app/(frontend)/(dashboard)/challenges/[challenge_slug]/components/custom-tooltip'
import { Button } from '@/components/ui/button'
import { Flag } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { User } from '@/core/users/types'
import { formatDistanceToNow } from 'date-fns'
import { Edit2, MoreVertical, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useComment } from '../hooks/use-comment'

const AuthorName = ({ author }: { author: User }) => {
  return <span className="text-sm font-medium">{author.informations.name}</span>
}

const CommentDate = ({ date }: { date: Date }) => {
  return (
    <span className="text-xs text-muted-foreground">
      {formatDistanceToNow(date, { addSuffix: true })}
    </span>
  )
}

export const ReportButton = ({ onReportClick }: { onReportClick: () => void }) => {
  return (
    <CustomTooltip content="Report this comment">
      <Button
        variant="ghost"
        size="sm"
        className={`h-6 w-6 p-0 text-muted-foreground transition-opacity duration-150 opacity-0 group-hover:opacity-100`}
        onClick={onReportClick}
        tabIndex={0}
        aria-hidden={true}
      >
        <Flag className="h-3.5 w-3.5" />
      </Button>
    </CustomTooltip>
  )
}

export const CommentHeader = ({
  onReportClick,
  onDelete,
  onEdit,
  canDelete,
  canEdit,
}: {
  onReportClick: () => void
  onDelete: () => Promise<void>
  onEdit: () => void
  canDelete: boolean
  canEdit: boolean
}) => {
  const { comment, author } = useComment()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const handleDelete = async () => {
    setDeleteDialogOpen(false)
    await onDelete()
  }

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <AuthorName author={author} />
        <div className="flex items-center gap-2">
          <ReportButton onReportClick={onReportClick} />
          {(canDelete || canEdit) && (
            <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-6 w-6 p-0 text-muted-foreground transition-opacity duration-150 ${menuOpen ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                >
                  <MoreVertical className="h-3.5 w-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[140px]">
                {canEdit && (
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => {
                      setMenuOpen(false)
                      onEdit()
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                )}
                {canDelete && (
                  <DropdownMenuItem
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                    <span className="text-red-500">Delete</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <CommentDate date={new Date(comment.createdAt)} />
        </div>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <span className="text-white">Delete</span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
