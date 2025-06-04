'use client'

import { useState, useMemo } from 'react'
import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  PaginationState,
} from '@tanstack/react-table'
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CircleDotIcon,
  CheckCircle2Icon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ListFilterIcon,
  CircleXIcon,
  FilterIcon,
} from 'lucide-react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { TooltipContentCustom } from '@/components/tooltip-without-decoration'
import { Skeleton } from '@/components/ui/skeleton'
import { useChallenges } from '@/core/challenges/hooks/use-challenges'
import { ChallengeStatusProvider } from '@/core/challenges/components/challenge-status-provider'
import { useChallengeStatus } from '@/core/challenges/hooks/use-challenge-status'
import { CompletionStatus } from '@/core/challenges/user-progression/types'
import { ChallengeWithProgress } from '@/core/challenges'
import { useSessionUser } from '@/core/user/hooks/use-user'

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

const difficulties = [
  { value: 'very_easy', label: 'Very Easy' },
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
  { value: 'horrible', label: 'Horrible' },
]

export const ChallengesTable = ({ userId }: ChallengesTableProps) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: 'baseExperience',
      desc: true,
    },
  ])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 25,
  })

  const { challenges, isLoading } = useChallenges()
  const { user } = useSessionUser()

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
            <ChallengeStatusCell />
          </ChallengeStatusProvider>
        ),
        size: 40,
      },
      {
        header: 'Title',
        accessorKey: 'title',
        enableSorting: true,
        enableColumnFilter: true,
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
        enableSorting: true,
        enableColumnFilter: true,
        filterFn: 'arrIncludesSome',
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
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedUniqueValues: (table, columnId) => () => {
      const uniqueValues = new Map<any, number>()
      table.getCoreRowModel().rows.forEach((row) => {
        const value = row.getValue(columnId)
        const count = uniqueValues.get(value) ?? 0
        uniqueValues.set(value, count + 1)
      })
      return uniqueValues
    },
    enableSortingRemoval: false,
  })

  if (isLoading) {
    return <TableSkeleton />
  }

  const titleFilter = columnFilters.find((f) => f.id === 'title')?.value || ''

  const selectedDifficulties = new Set(
    (columnFilters.find((f) => f.id === 'difficulty')?.value as string[]) ?? [],
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative">
          <Input
            className={cn('peer h-10 ps-9 w-72', Boolean(titleFilter) && 'pe-9')}
            value={titleFilter as string}
            onChange={(e) => table.getColumn('title')?.setFilterValue(e.target.value)}
            placeholder="Filter challenges by title..."
            type="text"
            aria-label="Filter challenges by title"
          />
          <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
            <ListFilterIcon size={16} aria-hidden="true" />
          </div>
          {Boolean(titleFilter) && (
            <button
              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Clear title filter"
              onClick={() => table.getColumn('title')?.setFilterValue('')}
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
                          const filterValue =
                            newSelected.size > 0 ? Array.from(newSelected) : undefined
                          table.getColumn('difficulty')?.setFilterValue(filterValue)
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
                        onSelect={() => table.getColumn('difficulty')?.setFilterValue(undefined)}
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

      <div className="flex items-center justify-between gap-8">
        <div className="text-muted-foreground flex grow justify-end text-sm whitespace-nowrap">
          <p className="text-muted-foreground text-sm whitespace-nowrap" aria-live="polite">
            <span className="text-foreground">
              {table.getRowModel().rows.length === 0
                ? 0
                : table.getState().pagination.pageIndex * table.getState().pagination.pageSize +
                  1}{' '}
              -
              {Math.min(
                (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length,
              )}
            </span>{' '}
            of <span className="text-foreground">{table.getFilteredRowModel().rows.length}</span>
            {columnFilters.length > 0 && ` (filtered from ${table.getCoreRowModel().rows.length})`}
          </p>
        </div>
        <div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => table.firstPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to first page"
                >
                  <ChevronFirstIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  aria-label="Go to previous page"
                >
                  <ChevronLeftIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to next page"
                >
                  <ChevronRightIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
              <PaginationItem>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => table.lastPage()}
                  disabled={!table.getCanNextPage()}
                  aria-label="Go to last page"
                >
                  <ChevronLastIcon size={16} aria-hidden="true" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
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
