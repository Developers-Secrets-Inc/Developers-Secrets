'use client'

import { useState } from 'react'
import type { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { ChevronDownIcon, ChevronUpIcon, CircleDotIcon, CheckCircle2Icon } from 'lucide-react'
import * as Tooltip from '@radix-ui/react-tooltip'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Link from 'next/link'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { Skeleton } from '@/components/ui/skeleton'
import { useChallenges } from '@/core/challenges/hooks/use-challenges'
import { ChallengeStatusProvider } from '@/core/challenges/components/challenge-status-provider'
import { useChallengeStatus } from '@/core/challenges/hooks/use-challenge-status'
import { CompletionStatus } from '@/core/challenges/user-progression/types'

type ChallengeWithProgress = {
  id: number
  title: string
  difficulty: 'easy' | 'medium' | 'hard' | 'horrible'
  baseExperience: number
  slug: string
  status: 'not_started' | 'in_progress' | 'completed'
}

const ChallengeStatusCell = () => {
  const { visualStatus } = useChallengeStatus()
  if (visualStatus === 'not_started') return null

  return (
    <div className="w-8">
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <div className="flex items-center justify-center">
              {visualStatus === 'in_progress' ? (
                <CircleDotIcon className="h-4 w-4 text-amber-500" />
              ) : (
                <CheckCircle2Icon className="h-4 w-4 text-emerald-500" />
              )}
            </div>
          </Tooltip.Trigger>
          <TooltipContentCustom sideOffset={2} align="center">
            {visualStatus === 'in_progress' ? 'In Progress' : 'Completed'}
          </TooltipContentCustom>
        </Tooltip.Root>
      </Tooltip.Provider>
    </div>
  )
}

type ChallengesTableProps = {
  userId: string
}

export const ChallengesTable = ({ userId }: ChallengesTableProps) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'baseExperience',
      desc: true,
    },
  ])

  const { challenges, isLoading } = useChallenges()

  const columns = [
    {
      header: '',
      accessorKey: 'status',
      cell: ({ row }: { row: any }) => (
        <ChallengeStatusProvider
          challengeId={row.original.id}
          userId={userId}
          initialStatus={row.original.status as CompletionStatus}
        >
          <ChallengeStatusCell />
        </ChallengeStatusProvider>
      ),
    },
    {
      header: 'Title',
      accessorKey: 'title',
      cell: ({ row }) => (
        <Link
          href={`/challenges/${row.original.slug}/description`}
          className="font-medium hover:underline"
        >
          {row.getValue('title')}
        </Link>
      ),
    },
    {
      header: 'Difficulty',
      accessorKey: 'difficulty',
      cell: ({ row }) => {
        const difficulty = row.getValue('difficulty') as string
        const styles = {
          easy: 'bg-emerald-500/10 text-emerald-500',
          medium: 'bg-amber-500/10 text-amber-500',
          hard: 'bg-red-500/10 text-red-500',
          horrible: 'bg-purple-500/10 text-purple-500',
        }[difficulty]

        return (
          <Badge className={cn(styles)} variant="secondary">
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </Badge>
        )
      },
    },
    {
      header: 'Experience',
      accessorKey: 'baseExperience',
      cell: ({ row }) => {
        const xp = row.getValue('baseExperience') as number
        return <span className="font-medium">{xp} XP</span>
      },
    },
  ] as ColumnDef<ChallengeWithProgress>[]

  const table = useReactTable({
    data: challenges || [],
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    enableSortingRemoval: false,
  })

  if (isLoading) {
    return <TableSkeleton />
  }

  return (
    <div className="space-y-6 border rounded-lg">
      <Tooltip.Provider delayDuration={0}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="relative h-10 select-none"
                      aria-sort={
                        header.column.getIsSorted() === 'asc'
                          ? 'ascending'
                          : header.column.getIsSorted() === 'desc'
                            ? 'descending'
                            : 'none'
                      }
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              'flex h-full cursor-pointer items-center justify-between gap-2 select-none',
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          onKeyDown={(e) => {
                            if (
                              header.column.getCanSort() &&
                              (e.key === 'Enter' || e.key === ' ')
                            ) {
                              e.preventDefault()
                              header.column.getToggleSortingHandler()?.(e)
                            }
                          }}
                          tabIndex={header.column.getCanSort() ? 0 : undefined}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {{
                            asc: (
                              <ChevronUpIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                            desc: (
                              <ChevronDownIcon
                                className="shrink-0 opacity-60"
                                size={16}
                                aria-hidden="true"
                              />
                            ),
                          }[header.column.getIsSorted() as string] ?? (
                            <span className="size-4" aria-hidden="true" />
                          )}
                        </div>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No challenges found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Tooltip.Provider>
    </div>
  )
}

const TableSkeleton = () => {
  return (
    <div className="space-y-6 border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="w-8">
              <Skeleton className="h-4 w-4" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-32" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-24" />
            </TableHead>
            <TableHead>
              <Skeleton className="h-4 w-20" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="h-4 w-4" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-48" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-12" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
