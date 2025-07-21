'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useState, useMemo } from 'react'
import { useConceptsProgression } from '@/api/skills/hooks/use-concepts-progression'
import { Concept } from '@/payload-types'

function flattenConcepts(
  concepts: (Concept & { progression: number })[],
): (Concept & { progression: number })[] {
  const result: (Concept & { progression: number })[] = []
  function recurse(list: (Concept & { progression: number })[]) {
    for (const c of list) {
      result.push(c)
      if (Array.isArray(c.subConcepts) && c.subConcepts.length > 0) {
        recurse(c.subConcepts as (Concept & { progression: number })[])
      }
    }
  }
  recurse(concepts)
  return result
}

interface ConceptProgressionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  skillSlug: string
  userId: string
}

export function ConceptProgressionDialog({
  open,
  onOpenChange,
  skillSlug,
  userId,
}: ConceptProgressionDialogProps) {
  const {
    data: conceptsData,
    updateConceptProgression,
    updateConceptProgressionStatus,
  } = useConceptsProgression(skillSlug, userId)
  const allConcepts = useMemo(
    () => (conceptsData ? flattenConcepts(conceptsData) : []),
    [conceptsData],
  )

  const [selectedConceptId, setSelectedConceptId] = useState<string | undefined>(undefined)
  const selectedConcept = allConcepts.find((c) => String(c.id) === selectedConceptId)
  const [progression, setProgression] = useState<number | ''>('')

  // Prefill progression when concept changes
  useMemo(() => {
    if (selectedConcept) {
      setProgression(selectedConcept.progression ?? '')
    } else {
      setProgression('')
    }
  }, [selectedConcept])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedConceptId || progression === '') return
    await updateConceptProgression({
      conceptId: Number(selectedConceptId),
      newProgression: Number(progression),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit concept progression</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block mb-1 text-sm font-medium">Concept</label>
            <Select value={selectedConceptId} onValueChange={setSelectedConceptId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a concept" />
              </SelectTrigger>
              <SelectContent>
                {allConcepts.map((concept) => (
                  <SelectItem key={concept.id} value={String(concept.id)}>
                    <span className="flex items-center gap-2">
                      {concept.name}
                      <Badge variant="outline" className="ml-2 text-xs">
                        {concept.type}
                      </Badge>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium">New progression (%)</label>
            <Input
              type="number"
              min={0}
              max={100}
              placeholder="0-100"
              value={progression}
              onChange={(e) => setProgression(e.target.value === '' ? '' : Number(e.target.value))}
              disabled={!selectedConceptId}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={
              !selectedConceptId ||
              progression === '' ||
              updateConceptProgressionStatus === 'pending'
            }
          >
            {updateConceptProgressionStatus === 'pending' ? 'Updating...' : 'Submit'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
