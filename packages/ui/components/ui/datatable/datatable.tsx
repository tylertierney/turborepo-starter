import { mergeColDefs } from './datatable.utils'
import { Spinner } from '../spinner'
import { SearchInput } from '../input-group'
import {
  ComponentProps,
  CSSProperties,
  Dispatch,
  HTMLAttributes,
  ReactNode,
  SetStateAction,
  useState,
} from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../table'
import { ArrowDown, ArrowUp } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../select'
import styles from './datatable.module.scss'
import { Button } from '../button'

const range = (start: number, end: number) => {
  return Array(end - start)
    .fill(null)
    .map((_, idx) => start + idx)
}

type IPaginationItem = 'ellipsis-prev' | 'ellipsis-next' | number

const getPaginationItems = ({
  currentPage,
  totalPages,
  buffer = 3,
}: {
  currentPage: number
  totalPages: number
  buffer?: PaginationProps['buffer']
}): IPaginationItem[] => {
  const halfBuffer = ~~(buffer / 2)

  if (totalPages <= buffer) {
    return Array(totalPages)
      .fill(null)
      .map((_, idx) => idx + 1)
  }

  if (currentPage - halfBuffer <= 1) {
    return [...range(1, buffer + 1), 'ellipsis-next', totalPages]
  } else if (currentPage + halfBuffer >= totalPages) {
    return [
      1,
      'ellipsis-prev',
      ...range(totalPages + 1 - buffer, totalPages + 1),
    ]
  }

  return [
    1,
    'ellipsis-prev',
    ...range(currentPage - halfBuffer, currentPage + 1 + halfBuffer),
    'ellipsis-next',
    totalPages,
  ]
}

export type PaginationParams = {
  pageSize: number
  currentPage: number
}

type PaginationProps = {
  totalCount: number
  paginationParams: PaginationParams
  setPaginationParams: Dispatch<SetStateAction<PaginationParams>>
  buffer?: 1 | 3 | 5 | 7 | 9
}
const TablePagination = ({
  totalCount,
  paginationParams = { pageSize: 10, currentPage: 1 },
  setPaginationParams,
  buffer = 5,
  className,
}: PaginationProps & HTMLAttributes<HTMLDivElement>) => {
  const { pageSize, currentPage } = paginationParams

  const totalPages = Math.max(Math.ceil(totalCount / pageSize), 1)

  const paginationItems = getPaginationItems({ currentPage, totalPages })

  const startRowIdx = Math.min((currentPage - 1) * pageSize + 1, totalCount)
  const endRowIdx = Math.min(
    (currentPage - 1) * pageSize + pageSize,
    totalCount,
  )

  return (
    <Pagination className={className}>
      <PaginationContent className="gap-3 sm:gap-8">
        <span className="text-sm text-muted-foreground">
          <span className="hidden sm:inline">
            {startRowIdx} - {endRowIdx} of {totalCount}
          </span>
          <span className="sm:hidden">
            {currentPage} / {totalPages}
          </span>
        </span>
        <div className="flex items-center gap-1">
          <PaginationItem>
            <PaginationPrevious
              onClick={() => {
                if (currentPage <= 1) {
                  return
                }

                setPaginationParams((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage - 1,
                }))
              }}
              text=""
            />
          </PaginationItem>
          <div className="hidden sm:flex items-center gap-1">
            {paginationItems.map((n) => (
              <PaginationItem key={n}>
                {typeof n === 'string' ? (
                  <PaginationEllipsis
                    onClick={() =>
                      setPaginationParams((prev) => {
                        console.log(prev)
                        return {
                          ...prev,
                          currentPage:
                            n === 'ellipsis-next'
                              ? Math.min(totalPages, prev.currentPage + buffer)
                              : Math.max(1, prev.currentPage - buffer),
                        }
                      })
                    }
                  />
                ) : (
                  <PaginationLink
                    isActive={n === currentPage}
                    onClick={() =>
                      setPaginationParams((prev) => ({
                        ...prev,
                        currentPage: n,
                      }))
                    }
                  >
                    {n}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
          </div>
          <div className="sm:hidden items-center gap-1">
            <PaginationItem>
              <PaginationLink isActive={true}>{currentPage}</PaginationLink>
            </PaginationItem>
          </div>
          <PaginationItem>
            <PaginationNext
              onClick={() => {
                if (currentPage >= totalPages) {
                  return
                }

                setPaginationParams((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage + 1,
                }))
              }}
              text=""
            />
          </PaginationItem>
        </div>
        <label className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            <span className="hidden sm:inline">Items per page</span>
            <span className="sm:hidden">Show</span>
          </span>
          <Select<number>
            value={pageSize}
            onValueChange={(n) => {
              const num = n as number
              const newTotalPages = Math.max(Math.ceil(totalCount / num), 1)

              setPaginationParams((prev) => ({
                ...prev,
                pageSize: num,
                // currentPage: Math.max(Math.ceil(totalCount / num), 1),
                currentPage:
                  prev.currentPage > newTotalPages
                    ? newTotalPages
                    : prev.currentPage,
              }))
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Page Size</SelectLabel>
                {[10, 20, 30, 40, 50].map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </label>
      </PaginationContent>
    </Pagination>
  )
}

export type Column<T> = {
  field: keyof T
  headerName: string
  style?: CSSProperties
  cellRenderer?: (data: T) => ReactNode
  hidden?: boolean
  headerCellStyle?: CSSProperties
  sortable?: boolean
}

export type ColumnWithId<T> = Column<T> & { id: number }

export type DatatableParams<T> = {
  search?: string
  sort: Array<{
    by: keyof T
    order: 'desc' | 'asc'
  }>
} & PaginationParams

type DatatableProps<T> = {
  columns: Column<T>[]
  data: T[]
  totalCount: number
  params: DatatableParams<T>
  setParams: Dispatch<SetStateAction<DatatableParams<T>>>
  loading?: boolean
  error?: ReactNode
  tableStyle?: CSSProperties
  tableClassName?: string
  defaultColDef?: Partial<Column<T>>
  header?: ReactNode
}
export const Datatable = <T,>({
  columns = [],
  data = [],
  totalCount = 0,
  params,
  setParams,
  loading = false,
  error,
  className = '',
  tableStyle = {},
  tableClassName = '',
  defaultColDef = {},
  ...rest
}: DatatableProps<T> & ComponentProps<'div'>) => {
  const [cols] = useState<ColumnWithId<T>[]>(
    columns.map((c, idx) => ({ ...c, id: idx })),
  )
  const visibleCols = cols.filter((c) => !c.hidden)

  return (
    <div className={`flex flex-col gap-4 ${className}`} {...rest}>
      <div className="flex px-2 justify-end">
        <SearchInput
          value={params.search ?? ''}
          onChange={(e) => {
            setParams((prev) => ({
              ...prev,
              search: e.target.value,
              currentPage: 1,
            }))
          }}
        />
      </div>
      <div
        className="relative flex flex-col"
        style={{
          minHeight: `calc(var(--spacing) * 10 * ${params.pageSize + 1})`,
          overflowX: 'auto',
          maxWidth: '100%',
          width: '100%',
        }}
      >
        <Table style={tableStyle} className={tableClassName}>
          <TableHeader>
            <TableRow className="h-10">
              {visibleCols.map((colDef, idx) => {
                const {
                  headerName,
                  field,
                  style = {},
                  headerCellStyle = {},
                  sortable,
                } = mergeColDefs(defaultColDef, colDef)

                const sortDir = params.sort?.filter(
                  ({ by }) => by === field,
                )?.[0]?.order

                const isSorted = Boolean(sortDir)

                return (
                  <TableHead
                    key={idx + headerName}
                    className={`hover:bg-accent-foreground/5 ${styles.th}`}
                    style={{
                      ...style,
                      ...headerCellStyle,
                    }}
                  >
                    <div className="flex items-center justify-between ">
                      <b>{headerName}</b>

                      {sortable && (
                        <>
                          {/* {sortDir &&
                            (sortDir === 'asc' ? <ArrowUp /> : <ArrowDown />)} */}
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`text-muted-foreground hover:text-muted-foreground transition-none ${styles.sortBtn} ${isSorted ? styles.isSorted : ''}`}
                            onClick={() =>
                              setParams((prev) => {
                                const filteredSort = prev.sort.filter(
                                  ({ by }) => by !== field,
                                )
                                if (sortDir === 'desc')
                                  return { ...prev, sort: filteredSort }

                                return {
                                  ...prev,
                                  sort: [
                                    ...filteredSort,
                                    {
                                      by: field,
                                      order: sortDir === 'asc' ? 'desc' : 'asc',
                                    },
                                  ],
                                }
                              })
                            }
                          >
                            {sortDir === 'asc' ? (
                              <ArrowUp
                                className={`${isSorted ? 'text-primary' : ''}`}
                              />
                            ) : (
                              <ArrowDown
                                className={`${isSorted ? 'text-primary' : ''}`}
                              />
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, idx) => {
              return (
                <TableRow key={idx} className="h-10">
                  {visibleCols.map(
                    ({ field, style = {}, cellRenderer }, idx) => {
                      return (
                        <TableCell
                          key={idx}
                          style={{ ...defaultColDef.style, ...style }}
                        >
                          {cellRenderer?.(row) ??
                            defaultColDef.cellRenderer?.(row) ??
                            (row[field] as string)}
                        </TableCell>
                      )
                    },
                  )}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        {loading && (
          <div className="absolute w-full h-full top-0 left-0 flex flex-col items-center justify-center bg-accent/30">
            <Spinner className="size-6" />
          </div>
        )}
        {Boolean(error) && (
          <div className="absolute w-full h-full top-0 left-0 flex flex-col items-center justify-center bg-accent/30 pt-6">
            {error}
          </div>
        )}
      </div>
      <TablePagination
        className="px-3"
        totalCount={totalCount}
        paginationParams={{
          currentPage: params.currentPage,
          pageSize: params.pageSize,
        }}
        setPaginationParams={(cb) => {
          if (typeof cb === 'function') {
            const callback = cb as (prev: PaginationParams) => PaginationParams
            setParams((prev) => ({
              ...prev,
              ...callback(prev),
            }))
          } else {
            setParams((prev) => ({ ...prev, ...cb }))
          }
        }}
      />
    </div>
  )
}
