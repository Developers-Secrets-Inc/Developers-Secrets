'use client'

import { useMemo } from 'react'
import { ChallengeWithCompletionStatus } from '../types'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { CompletionStatusIcon } from '../progression/components/completion-status-icon'
import { Challenge, UserChallengeCompletionStatus } from '@/payload-types'
import { ChallengeDifficultyBadge } from '../components/difficulty-badge'
import Link from 'next/link'

export const useChallengeTableColumns = () => {
  return useMemo<ColumnDef<ChallengeWithCompletionStatus>[]>(
    () => [
      {
        header: '',
        accessorKey: 'completionStatus',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ row }) => {
          const status = row.getValue(
            'completionStatus',
          ) as UserChallengeCompletionStatus['completionStatus']
          return <CompletionStatusIcon completionStatus={status} />
        },
        size: 120,
      },
      {
        header: 'Title',
        accessorKey: 'title',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ row }) => (
          <Link className="font-medium hover:underline" href={`/challenges/${row.original.slug}/description`}>
            {row.getValue('title')}
          </Link>
        ),
      },
      {
        header: 'Difficulty',
        accessorKey: 'difficulty',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ row }) => {
          const difficulty = row.getValue('difficulty') as Challenge['difficulty']
          return <ChallengeDifficultyBadge difficulty={difficulty} />
        },
        size: 100,
      },
      {
        header: () => <div className="text-right">Experience</div>,
        accessorKey: 'baseExperience',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ row }) => {
          const experience = row.getValue('baseExperience') as number
          return <div className="text-right font-medium">{experience} XP</div>
        },
        size: 120,
      },
    ],
    [],
  )
}

export const useChallengeTable = (initialChallenges: ChallengeWithCompletionStatus[]) => {
  const columns = useChallengeTableColumns()

  return useReactTable({
    data: initialChallenges,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })
}
