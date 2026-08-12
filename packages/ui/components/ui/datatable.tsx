import { Spinner } from './spinner'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from './input-group'
import {
  CSSProperties,
  Dispatch,
  HTMLAttributes,
  ReactNode,
  SetStateAction,
} from 'react'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table'
import { Search, XIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from './select'

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

  // return Array(totalPages)
  //   .fill(null)
  //   .map((_, idx) => idx + 1)

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
          {startRowIdx} - {endRowIdx} of {totalCount}
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
                    setPaginationParams((prev) => ({ ...prev, currentPage: n }))
                  }
                >
                  {n}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
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
          <span className="text-sm text-muted-foreground">Items per page</span>
          <Select<number>
            value={pageSize}
            onValueChange={(n) => {
              const num = n as number
              setPaginationParams((prev) => ({
                ...prev,
                pageSize: num,
                currentPage: Math.max(Math.ceil(totalCount / num), 1),
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
}

export type DatatableParams = { search?: string } & PaginationParams

type DatatableProps<T> = {
  columns: Column<T>[]
  data: T[]
  totalCount: number
  params: DatatableParams
  setParams: Dispatch<SetStateAction<DatatableParams>>
  loading?: boolean
  error?: ReactNode
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
  ...rest
}: DatatableProps<T> & HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={`flex flex-col gap-4 ${className}`} {...rest}>
      <div className="flex px-2 justify-end">
        <InputGroup className="max-w-50">
          <InputGroupInput
            type="search"
            value={params.search ?? ''}
            onChange={(e) => {
              setParams((prev) => ({
                ...prev,
                search: e.target.value,
                currentPage: 1,
              }))
            }}
            placeholder="Search"
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              aria-label="reset-search"
              title="reset-search"
              size="icon-xs"
              onClick={() => {
                setParams((prev) => ({ ...prev, search: '', currentPage: 1 }))
              }}
            >
              <XIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div
        className="relative flex flex-col"
        style={{
          minHeight: `calc(var(--spacing) * 10 * ${params.pageSize + 1})`,
        }}
      >
        <Table style={{ tableLayout: 'fixed' }}>
          <TableHeader>
            <TableRow className="h-10">
              {columns.map(({ headerName, style = {} }, idx) => (
                <TableHead key={idx + headerName} style={style}>
                  <b>{headerName}</b>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, idx) => {
              return (
                <TableRow key={idx} className="h-10">
                  {columns.map(({ field, style = {}, cellRenderer }, idx) => {
                    return (
                      <TableCell key={idx} style={style}>
                        {cellRenderer
                          ? cellRenderer(row)
                          : (row[field] as string)}
                      </TableCell>
                    )
                  })}
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
