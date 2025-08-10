'use client'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import * as Tooltip from '@radix-ui/react-tooltip'
import type { ColumnDef, ColumnFiltersState, SortingState } from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  CheckCircle2Icon,
  ChevronDownIcon,
  ChevronUpIcon,
  CircleDotIcon,
  CircleXIcon,
  FilterIcon,
  ListFilterIcon,
  LockIcon,
} from 'lucide-react'
import { useMemo, useState } from 'react'

import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ChallengeWithProgress } from '@/core/challenges'
import { ChallengeStatusProvider } from '@/core/challenges/components/challenge-status-provider'
import { useChallengeStatus } from '@/core/challenges/hooks/use-challenge-status'
import { useChallenges } from '@/core/challenges/hooks/use-challenges'
import { CompletionStatus } from '@/core/challenges/user-progression/types'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useQueryState } from 'nuqs'
import { useUser } from '@/core/users/contexts/user-context'

const ChallengeStatusCell = ({ challenge, isPro }: { challenge: ChallengeWithProgress, isPro: boolean }) => {
  const { visualStatus } = useChallengeStatus()
  
  // If challenge is PRO and user is not PRO, show lock icon
  if (challenge.isPro && !isPro) {
    return (
      <div className="w-8">
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <div className="flex items-center justify-center">
                <LockIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            </Tooltip.Trigger>
            <TooltipContentCustom sideOffset={2} align="center">
              PRO subscription required
            </TooltipContentCustom>
          </Tooltip.Root>
        </Tooltip.Provider>
      </div>
    )
  }
  
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
  isPro: boolean
}

const difficulties = [
  { value: 'very_easy', label: 'Very Easy' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'horrible', label: 'Horrible' },
]

const statuses = [
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
]

export const ChallengesTable = ({ userId, isPro }: ChallengesTableProps) => {
  const [titleQuery, setTitleQuery] = useQueryState('title', { defaultValue: '' })
  const [difficultyQuery, setDifficultyQuery] = useQueryState('difficulty', {
    defaultValue: [],
    parse: (value) => value.split(',').filter(Boolean),
    serialize: (value) => value.join(','),
  })
  const [statusQuery, setStatusQuery] = useQueryState('status', {
    defaultValue: [],
    parse: (value) => value.split(',').filter(Boolean),
    serialize: (value) => value.join(','),
  })
  const [sortBy, setSortBy] = useQueryState('sortBy', { defaultValue: 'difficulty' })
  const [sortOrder, setSortOrder] = useQueryState('sortOrder', { defaultValue: 'asc' })

  const columnFilters = useMemo(() => {
    const filters: ColumnFiltersState = []
    if (titleQuery) {
      filters.push({ id: 'title', value: titleQuery })
    }
    if (difficultyQuery.length > 0) {
      filters.push({ id: 'difficulty', value: difficultyQuery })
    }
    if (statusQuery.length > 0) {
      filters.push({ id: 'status', value: statusQuery })
    }
    return filters
  }, [titleQuery, difficultyQuery, statusQuery])

  const sorting = useMemo(() => {
    if (!sortBy) return []
    return [
      {
        id: sortBy,
        desc: sortOrder === 'desc',
      },
    ]
  }, [sortBy, sortOrder])

  const { challenges, isLoading } = useChallenges()
  const { user } = useUser()

  const filteredChallenges = useMemo(() => {
    if (user?.informations?.role === 'admin') return challenges || []
    return (challenges || []).filter((challenge) => !challenge.draft)
  }, [challenges, user])

  const columns = useMemo<ColumnDef<ChallengeWithProgress>[]>(
    () => [
      {
        header: '',
        accessorKey: 'status',
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => (
          <ChallengeStatusProvider
            challengeId={row.original.id}
            userId={userId}
            initialStatus={row.original.status as CompletionStatus}
          >
            <ChallengeStatusCell challenge={row.original} isPro={isPro} />
          </ChallengeStatusProvider>
        ),
        size: 40,
      },
      {
        header: 'Title',
        accessorKey: 'title',
        enableSorting: true,
        enableColumnFilter: true,
        cell: ({ row }) => {
          const challenge = row.original;
          const isProChallenge = challenge.isPro;
          
          if (isProChallenge && !isPro) {
            return (
              <span className="font-medium text-muted-foreground">
                {row.getValue('title')}
              </span>
            );
          }
          
          return (
            <Link
              href={`/challenges/${row.original.slug}/description`}
              className="font-medium hover:underline"
            >
              {row.getValue('title')}
            </Link>
          );
        },
      },
      {
        header: 'Difficulty',
        accessorKey: 'difficulty',
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: 'arrIncludesSome',
        sortingFn: (rowA, rowB, columnId) => {
          const order = ['very_easy', 'easy', 'medium', 'hard', 'horrible']
          const diffA = rowA.original.difficulty
          const diffB = rowB.original.difficulty
          return order.indexOf(diffA) - order.indexOf(diffB)
        },
        cell: ({ row }) => {
          const difficulty = row.getValue('difficulty') as string
          const styles = {
            very_easy: 'bg-cyan-500/10 text-cyan-500',
            easy: 'bg-emerald-500/10 text-emerald-500',
            medium: 'bg-amber-500/10 text-amber-500',
            hard: 'bg-red-500/10 text-red-500',
            horrible: 'bg-purple-500/10 text-purple-500',
          }[difficulty]
          return (
            <Badge className={cn(styles)} variant="secondary">
              {difficulty.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
            </Badge>
          )
        },
      },
      {
        header: 'Experience',
        accessorKey: 'baseExperience',
        enableSorting: true,
        enableColumnFilter: false,
        cell: ({ row }) => {
          const xp = row.getValue('baseExperience') as number
          return <span className="font-medium">{xp} XP</span>
        },
      },
    ],
    [userId],
  )

  const table = useReactTable({
    data: filteredChallenges ?? [],
    columns,
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: (updater) => {
      const newSorting = typeof updater === 'function' ? updater(sorting) : updater
      if (newSorting.length > 0) {
        setSortBy(newSorting[0].id)
        setSortOrder(newSorting[0].desc ? 'desc' : 'asc')
      } else {
        setSortBy(null)
        setSortOrder(null)
      }
    },
    onColumnFiltersChange: (updater) => {
      const newFilters = typeof updater === 'function' ? updater(columnFilters) : updater
      const newTitle = newFilters.find((f) => f.id === 'title')?.value || ''
      const newDifficulty = newFilters.find((f) => f.id === 'difficulty')?.value || []
      const newStatus = newFilters.find((f) => f.id === 'status')?.value || []
      setTitleQuery(newTitle as string)
      setDifficultyQuery(newDifficulty as string[])
      setStatusQuery(newStatus as string[])
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (isLoading) {
    return <TableSkeleton />
  }

  const selectedDifficulties = new Set(difficultyQuery)
  const selectedStatuses = new Set(statusQuery)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Input
            className={cn('peer h-10 ps-9 w-72', Boolean(titleQuery) && 'pe-9')}
            value={titleQuery}
            onChange={(e) => setTitleQuery(e.target.value)}
            placeholder="Filter challenges by title..."
            type="text"
            aria-label="Filter challenges by title"
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <ListFilterIcon size={16} aria-hidden="true" />
          </div>
          {Boolean(titleQuery) && (
            <button
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Clear title filter"
              onClick={() => setTitleQuery('')}
            >
              <CircleXIcon size={16} aria-hidden="true" />
            </button>
          )}
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 border-dashed">
              <FilterIcon className="mr-2 h-4 w-4" />
              Difficulty
              {selectedDifficulties.size > 0 && (
                <>
                  <span className="mx-2" />
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                    {selectedDifficulties.size}
                  </Badge>
                  <div className="hidden space-x-1 lg:flex">
                    {selectedDifficulties.size > 2 ? (
                      <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                        {selectedDifficulties.size} selected
                      </Badge>
                    ) : (
                      difficulties
                        .filter((option) => selectedDifficulties.has(option.value))
                        .map((option) => (
                          <Badge
                            variant="secondary"
                            key={option.value}
                            className="rounded-sm px-1 font-normal"
                          >
                            {option.label}
                          </Badge>
                        ))
                    )}
                  </div>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {difficulties.map((option) => {
                    const isSelected = selectedDifficulties.has(option.value)
                    return (
                      <CommandItem
                        key={option.value}
                        onSelect={() => {
                          const newSelected = new Set(selectedDifficulties)
                          if (isSelected) {
                            newSelected.delete(option.value)
                          } else {
                            newSelected.add(option.value)
                          }
                          setDifficultyQuery(Array.from(newSelected))
                        }}
                      >
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50 [&_svg]:invisible',
                          )}
                        >
                          <CheckCircle2Icon className={cn('h-4 w-4')} />
                        </div>
                        <span>{option.label}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
                {selectedDifficulties.size > 0 && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => setDifficultyQuery([])}
                        className="justify-center text-center"
                      >
                        Clear filters
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-10 border-dashed">
              <FilterIcon className="mr-2 h-4 w-4" />
              Status
              {selectedStatuses.size > 0 && (
                <>
                  <span className="mx-2" />
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                    {selectedStatuses.size}
                  </Badge>
                  <div className="hidden space-x-1 lg:flex">
                    {selectedStatuses.size > 2 ? (
                      <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                        {selectedStatuses.size} selected
                      </Badge>
                    ) : (
                      statuses
                        .filter((option) => selectedStatuses.has(option.value))
                        .map((option) => (
                          <Badge
                            variant="secondary"
                            key={option.value}
                            className="rounded-sm px-1 font-normal"
                          >
                            {option.label}
                          </Badge>
                        ))
                    )}
                  </div>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                  {statuses.map((option) => {
                    const isSelected = selectedStatuses.has(option.value)
                    return (
                      <CommandItem
                        key={option.value}
                        onSelect={() => {
                          const newSelected = new Set(selectedStatuses)
                          if (isSelected) {
                            newSelected.delete(option.value)
                          } else {
                            newSelected.add(option.value)
                          }
                          setStatusQuery(Array.from(newSelected))
                        }}
                      >
                        <div
                          className={cn(
                            'mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'opacity-50 [&_svg]:invisible',
                          )}
                        >
                          <CheckCircle2Icon className={cn('h-4 w-4')} />
                        </div>
                        <span>{option.label}</span>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
                {selectedStatuses.size > 0 && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => setStatusQuery([])}
                        className="justify-center text-center"
                      >
                        Clear filters
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="border rounded-lg">
        <Tooltip.Provider delayDuration={0}>
          <Table>
            <TableHeader className="rounded-t-lg">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted/50 hover:bg-muted/50">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="relative h-10 select-none"
                      style={{
                        width: header.getSize() !== 150 ? `${header.getSize()}px` : undefined,
                      }}
                      aria-sort={
                        header.column.getIsSorted() === 'asc'
                          ? 'ascending'
                          : header.column.getIsSorted() === 'desc'
                            ? 'descending'
                            : 'none'
                      }
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            header.column.getCanSort() &&
                              'flex h-full cursor-pointer items-center justify-between gap-2 select-none',
                            !header.column.getCanSort() && 'flex h-full items-center',
                          )}
                          onClick={header.column.getToggleSortingHandler()}
                          role="button"
                          tabIndex={header.column.getCanSort() ? 0 : -1}
                          aria-label={header.column.getCanSort() ? 'Toggle sorting' : undefined}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() &&
                            ({
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
                              <span
                                className="size-4 shrink-0 opacity-0 group-hover:opacity-60 transition-opacity"
                                aria-hidden="true"
                              />
                            ))}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
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
                    No challenges found matching your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Tooltip.Provider>
      </div>
    </div>
  )
}

export const TableSkeleton = () => {
  return (
    <div className="space-y-6 border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50">
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
