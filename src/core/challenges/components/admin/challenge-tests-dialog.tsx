'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Challenge } from '@/payload-types'

interface ChallengeTestsDialogProps {
  challenge: Challenge
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const ChallengeTestsDialog = ({
  challenge,
  open,
  onOpenChange,
}: ChallengeTestsDialogProps) => {
  const [currentVersionIndex, setCurrentVersionIndex] = useState(0)

  const codeVersions = challenge.codeVersions || []
  const currentCodeVersion = codeVersions[currentVersionIndex]

  useEffect(() => {
    if (open) {
      setCurrentVersionIndex(0) // Reset to first version when dialog opens
    }
  }, [open])

  const handleNextVersion = () => {
    setCurrentVersionIndex((prevIndex) => Math.min(prevIndex + 1, codeVersions.length - 1))
  }

  const handlePreviousVersion = () => {
    setCurrentVersionIndex((prevIndex) => Math.max(prevIndex - 1, 0))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Edit Challenge Code & Tests</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {codeVersions.length > 0 ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="language" className="text-right">
                  Language
                </Label>
                <Input
                  id="language"
                  value={currentCodeVersion?.language || ''}
                  readOnly
                  className="col-span-3"
                />
              </div>
              <div>
                <Label htmlFor="initialCode" className="text-right">
                  Initial Code
                </Label>
                <Textarea
                  id="initialCode"
                  value={currentCodeVersion?.initialCode || ''}
                  readOnly
                  className="col-span-3 h-48 font-mono"
                />
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Test Cases:</h4>
                {currentCodeVersion?.testCases && currentCodeVersion.testCases.length > 0 ? (
                  currentCodeVersion.testCases.map((testCase, index) => (
                    <div key={index} className="border p-2 rounded-md">
                      <p className="text-sm font-medium">Test Case {index + 1}</p>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor={`input-${index}`} className="text-right">Input</Label>
                        <Textarea
                          id={`input-${index}`}
                          value={testCase.input}
                          readOnly
                          className="col-span-3 font-mono"
                        />
                        <Label htmlFor={`expectedOutput-${index}`} className="text-right">Expected Output</Label>
                        <Textarea
                          id={`expectedOutput-${index}`}
                          value={testCase.expectedOutput}
                          readOnly
                          className="col-span-3 font-mono"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No test cases defined for this language version.</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">No code versions available for this challenge.</p>
          )}
        </div>
        <DialogFooter>
          <Button onClick={handlePreviousVersion} disabled={currentVersionIndex === 0}>
            Previous
          </Button>
          <Button onClick={handleNextVersion} disabled={currentVersionIndex === codeVersions.length - 1}>
            Next
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}