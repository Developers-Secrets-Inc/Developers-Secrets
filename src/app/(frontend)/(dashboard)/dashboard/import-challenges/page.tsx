'use client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { importChallengesAction } from '@/core/challenges/actions'
import { getSessionUser } from '@/core/user'
import { isError } from '@/core/user/result'
import { notFound, useRouter } from 'next/navigation'
import { useState, useEffect, useTransition } from 'react'

export default function ImportChallengesPage() {
  const [jsonContent, setJsonContent] = useState('')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null,
  )
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  useEffect(() => {
    const checkAdmin = async () => {
      const sessionUserResult = await getSessionUser()
      if (isError(sessionUserResult) || sessionUserResult.value.informations.role !== 'admin') {
        setIsAdmin(false)
        notFound()
      } else {
        setIsAdmin(true)
      }
    }
    checkAdmin()
  }, [])

  const handleImport = () => {
    if (!jsonContent.trim()) return
    setFeedback(null)

    startTransition(async () => {
      const result = await importChallengesAction(jsonContent)

      if (isError(result)) {
        setFeedback({ type: 'error', message: result.error.message })
      } else {
        setFeedback({
          type: 'success',
          message: `Successfully imported ${result.value.count} challenges!`,
        })
        setJsonContent('')
      }
    })
  }

  if (isAdmin === null) {
    return <div className="container mx-auto py-8 text-center">Checking permissions...</div>
  }

  if (isAdmin === false) {
    return null
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Import Challenges via JSON</CardTitle>
          <CardDescription>
            Paste the JSON content representing an array of challenges below. Ensure it matches the
            required format (check `CreateChallengeData` type for guidance).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Paste your JSON here..."
            rows={15}
            value={jsonContent}
            onChange={(e) => setJsonContent(e.target.value)}
            className="font-mono text-sm"
            disabled={isPending}
          />
          {feedback && (
            <div
              className={`rounded-md border p-3 text-sm ${
                feedback.type === 'error'
                  ? 'border-destructive bg-destructive/10 text-destructive'
                  : 'border-green-500 bg-green-500/10 text-green-700'
              }`}
            >
              {feedback.message}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <div className="flex-grow" />
          <Button onClick={handleImport} disabled={!jsonContent.trim() || isPending}>
            {isPending ? 'Importing...' : 'Import JSON'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
