'use client'

import { flexRender } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChallengeWithCompletionStatus } from '../types'
import { useChallengeTable } from '../hooks/use-challenge-table'
import { cn } from '@/lib/utils'

export const ChallengeSearchInput = () => {}
export const DifficultyFilterButton = () => {}
export const StatusFilterButton = () => {}

export const ChallengesTable = ({
  challenges: initialChallenges,
}: {
  challenges: ChallengeWithCompletionStatus[]
}) => {
  const table = useChallengeTable(initialChallenges)

  return (
    <div className="border rounded-lg border-border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-transparent">
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className={cn(
                    'relative h-10 select-none',
                    header.getSize() !== 150 ? `w-[${header.getSize()}px]` : '',
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="hover:bg-muted/50"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                Aucun challenge trouvé.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

/*

What do we need for this table ? 
- Get the title, difficulty and experience of a challenge 
- Get it's current completion status. Need to be on the client because it needs to be revalidated every time the page is focused to get fresh informations. 
  - Is it really necessary ? Because it could consume a lot of data for not a lot of things. A user know when he completed a challenge and could just refresh the page. We may use a staleTime with cache
- Search for a specific challenge, sort by difficulty or status. 

Filtering and sorting, thus state management will be handled by nuqs

Could be an improvement : Possibility to favorite a challenge, sort and display challenge concepts. Not for now


The challenge status component need to be a global component, same for the difficulty badge. 

type ChallengeWithCompletionStatus = Challenge & UserChallengeCompletionStatus['completionStatus']

*/
