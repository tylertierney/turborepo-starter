import { toast } from '@repo/ui'
import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  convertDatatableParamsToQueryString,
} from '@repo/ui'
import { PaginatedResult, Practice } from '@repo/models'
import { useQuery } from '@tanstack/react-query'
import { Datatable, DatatableParams } from '@repo/ui'
import { useState } from 'react'
import { ArrowUpRightIcon, RefreshCcw, Building } from 'lucide-react'
import { useDebouncedIsFetching } from '../../hooks/useDebouncedIsFetching'

export default function PracticesTable() {
  const [datatableParams, setDatatableParams] = useState<
    DatatableParams<Practice>
  >({
    pageSize: 10,
    currentPage: 1,
    search: '',
    sort: [],
  })

  const {
    data: practicesResult,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['practices', JSON.stringify(datatableParams)],
    queryFn: async () => {
      const queryString = convertDatatableParamsToQueryString(datatableParams)

      const res = await fetch('/api/practices' + queryString)
      if (!res.ok) {
        toast.add({
          type: 'error',
          title: 'Error',
          description: 'Failed to fetch practices list',
        })
        throw new Error(`Server error: ${res.status}`)
      }

      const json = (await res.json()) as PaginatedResult<Practice>
      return json
    },
    placeholderData: (prev) => prev,
  })

  const { data: practices = [], meta } = practicesResult || {}

  const isFetchingWithDebounce = useDebouncedIsFetching({
    isFetching,
    delay: 200,
  })

  return (
    <>
      <Datatable<Practice>
        // className="md:max-w-3xl"
        className="mb-60 md:w-full"
        columns={[
          {
            headerName: 'Name',
            field: 'name',
            sortable: true,
          },
          {
            headerName: 'Created At',
            field: 'createdAt',
            sortable: true,
            cellRenderer: ({ createdAt }) =>
              new Date(createdAt).toLocaleDateString('en-us'),
          },
        ]}
        data={practices}
        totalCount={meta?.totalCount ?? 0}
        params={datatableParams}
        setParams={setDatatableParams}
        loading={isFetchingWithDebounce}
        tableClassName="sm:table-layout-fixed"
        defaultColDef={{
          style: {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
        }}
        error={
          error ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Building />
                </EmptyMedia>
                <EmptyTitle>No Users Found</EmptyTitle>
                <EmptyDescription>
                  No users were found - or there was a network error. Try again
                  momentarily.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="flex-row justify-center gap-2">
                <Button onClick={() => refetch()} variant="outline">
                  <RefreshCcw />
                  Refresh
                </Button>
              </EmptyContent>
              <Button
                variant="link"
                className="text-muted-foreground"
                size="sm"
                nativeButton={false}
                render={
                  <a>
                    Or contact support <ArrowUpRightIcon />
                  </a>
                }
              />
            </Empty>
          ) : undefined
        }
      ></Datatable>
    </>
  )
}
