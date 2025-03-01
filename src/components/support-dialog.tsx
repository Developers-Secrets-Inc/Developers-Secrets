'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { sendSupportEmail } from '@/actions/support'
import { AlertCircle, CheckCircle, HelpCircle, Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface SupportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supportStatus: {
    status: 'online' | 'maintenance' | 'offline'
    message: string
  }
}

export function SupportDialog({ open, onOpenChange, supportStatus }: SupportDialogProps) {
  const params = useParams<{ tutorial_slug?: string; article_slug?: string }>()
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  // Réinitialiser le résultat lorsque le dialog est fermé
  useEffect(() => {
    if (!open) {
      // Réinitialiser le résultat après un court délai pour éviter un flash visuel
      const timer = setTimeout(() => {
        setResult(null)
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) {
      setResult({
        success: false,
        message: 'Please enter a message',
      })
      return
    }

    setIsSubmitting(true)
    setResult(null)

    const formData = new FormData()
    formData.append('message', message)

    if (params.tutorial_slug) {
      formData.append('tutorialSlug', params.tutorial_slug as string)
    }

    if (params.article_slug) {
      formData.append('articleSlug', params.article_slug as string)
    }

    try {
      const response = await sendSupportEmail(formData)
      setResult(response)

      if (response.success) {
        setMessage('')
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'An unexpected error occurred. Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Fonction pour gérer la fermeture du dialog
  const handleOpenChange = (newOpen: boolean) => {
    // Si on ferme le dialog, on réinitialise le résultat
    if (!newOpen) {
      // Le résultat sera réinitialisé par l'effet ci-dessus
    }
    onOpenChange(newOpen)
  }

  // Determine the status indicator color
  const getStatusColor = () => {
    switch (supportStatus.status) {
      case 'online':
        return 'bg-emerald-500'
      case 'maintenance':
        return 'bg-amber-500'
      case 'offline':
        return 'bg-red-500'
      default:
        return 'bg-emerald-500'
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Support
            <span className={`ml-2 h-2.5 w-2.5 rounded-full ${getStatusColor()}`} />
          </DialogTitle>
          <DialogDescription>
            Send us a message and we&apos;ll get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>

        {supportStatus.status !== 'online' && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>
              Support is {supportStatus.status === 'maintenance' ? 'under maintenance' : 'offline'}
            </AlertTitle>
            <AlertDescription>{supportStatus.message}</AlertDescription>
          </Alert>
        )}

        {result && (
          <Alert variant={result.success ? 'default' : 'destructive'} className="mt-4">
            {result.success ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle>{result.success ? 'Success' : 'Error'}</AlertTitle>
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder="How can we help you?"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px]"
            disabled={isSubmitting || supportStatus.status !== 'online'}
          />

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting || supportStatus.status !== 'online'}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send message
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
