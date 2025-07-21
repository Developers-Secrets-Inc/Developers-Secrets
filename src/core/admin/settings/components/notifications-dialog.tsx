'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { createNotification } from '@/core/notifications'
import { User } from '@/core/user/types'
import { getUser } from '@/core/user'
import { User as UserIcon, Loader2 } from 'lucide-react'

const importanceOptions = [
  { value: 'high', label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low', label: 'Low' },
]
const typeOptions = [
  { value: 'system', label: 'System' },
  { value: 'challenge', label: 'Challenge' },
  { value: 'achievement', label: 'Achievement' },
  { value: 'social', label: 'Social' },
]

export function NotificationsDialog({
  open,
  onOpenChange,
  refetch,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  refetch: () => void
}) {
  const [form, setForm] = useState({
    userId: '',
    content: '',
    importance: 'medium',
    type: 'system',
    actionUrl: '',
    expiresAt: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fetchingUser, setFetchingUser] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSelect = (name: string, value: string) => {
    setForm((f) => ({ ...f, [name]: value }))
  }

  const handleFillCurrentUser = async () => {
    setFetchingUser(true)
    try {
      const user = await getUser()
      if (user?.id) {
        setForm((f) => ({ ...f, userId: user.id }))
        setCurrentUserId(user.id)
      }
    } finally {
      setFetchingUser(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await createNotification({
        userId: form.userId,
        content: form.content,
        importance: form.importance as any,
        type: form.type as any,
        actionUrl: form.actionUrl || undefined,
        expiresAt: form.expiresAt || undefined,
      })
      refetch()
      onOpenChange(false)
      setForm({
        userId: '',
        content: '',
        importance: 'medium',
        type: 'system',
        actionUrl: '',
        expiresAt: '',
      })
      setCurrentUserId(null)
    } catch (err: any) {
      setError(err?.message || 'Error during creation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Notification</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center gap-2">
            <Input
              name="userId"
              placeholder="User ID"
              value={form.userId}
              onChange={handleChange}
              required
              className="flex-1"
            />
            <Button
              type="button"
              size="icon"
              variant="outline"
              onClick={handleFillCurrentUser}
              disabled={fetchingUser || (!!currentUserId && form.userId === currentUserId)}
              title="Use my user ID"
            >
              {fetchingUser ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <UserIcon className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Textarea
            name="content"
            placeholder="Notification Content"
            value={form.content}
            onChange={handleChange}
            required
          />
          <Select value={form.importance} onValueChange={(v) => handleSelect('importance', v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Importance" />
            </SelectTrigger>
            <SelectContent>
              {importanceOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={form.type} onValueChange={(v) => handleSelect('type', v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            name="actionUrl"
            placeholder="Action URL (optional)"
            value={form.actionUrl}
            onChange={handleChange}
          />
          <Input
            name="expiresAt"
            placeholder="Expiration (YYYY-MM-DD, optional)"
            value={form.expiresAt}
            onChange={handleChange}
            type="date"
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Notification'}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
