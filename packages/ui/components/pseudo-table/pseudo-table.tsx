import { ComponentProps, Dispatch, ReactNode, SetStateAction } from 'react'
import {
  DatatableParams,
  PaginationParams,
  TablePagination,
} from '../ui/paginated-table/paginated-table'
import { SearchInput } from '../ui/input-group'
import { Spinner } from '../ui/spinner'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from '../ui/select'

export type PseudoTableProps<T> = {
  rowContent: (data: T) => ReactNode
  data: T[]
  totalCount: number
  params: DatatableParams<T>
  setParams: Dispatch<SetStateAction<DatatableParams<T>>>
  loading?: boolean
  error?: ReactNode
  header?: ReactNode
  sortableColumns?: Array<{
    key: keyof T
    label: string
  }>
}

export const PseudoTable = <T,>({
  rowContent,
  data,
  totalCount = 0,
  params,
  setParams,
  loading = false,
  error,
  header,
  className = '',
  sortableColumns = [],
  ...rest
}: PseudoTableProps<T> & ComponentProps<'div'>) => {
  return (
    <div className={`flex flex-col items-stretch gap-4 ${className}`} {...rest}>
      <div className="flex">
        <div className="flex items-center grow">{header}</div>
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
      <div className="flex flex-col items-stretch rounded-lg border overflow-hidden">
        <div className="flex justify-end min-h-16 p-4 items-center border-b bg-accent-foreground/5">
          {!!sortableColumns.length && (
            <Select<keyof T | undefined>
              value={params.sort?.[0]?.by ?? undefined}
              onValueChange={(val) => {
                setParams((prev) => ({
                  ...prev,
                  sort: val
                    ? [
                        {
                          by: val,
                          order: 'asc',
                        },
                      ]
                    : [],
                }))
              }}
            >
              <SelectTrigger className="border-0">Sort</SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Sort by</SelectLabel>
                  {sortableColumns.map(({ key, label }, idx) => (
                    <SelectItem aria-checked="false" key={idx} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>

        <div className={`relative min-h-180`}>
          {data.map((row, idx) => {
            return (
              <div
                key={idx}
                className="flex min-h-16 p-4 items-center border-b last-of-type:border-0"
              >
                {rowContent(row)}
              </div>
            )
          })}
          {loading && (
            <div className="absolute top-0 w-full h-full flex flex-col items-center justify-center bg-accent/30">
              <Spinner className="size-6" />
            </div>
          )}
          {Boolean(error) && (
            <div className="absolute top-0 w-full h-full flex flex-col items-center justify-center bg-accent/30">
              {error}
            </div>
          )}
        </div>
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
