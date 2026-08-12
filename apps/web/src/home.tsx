import { toast } from '@repo/ui'
import {
  Button,
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@repo/ui'
import { PaginatedResult, User } from '@repo/models'
import { useQuery } from '@tanstack/react-query'
import { Datatable, DatatableParams } from '@repo/ui'
import { useState } from 'react'
import { ArrowUpRightIcon, RefreshCcw, User as UserIcon } from 'lucide-react'
import { useDebouncedIsFetching } from './hooks/useDebouncedIsFetching'

export default function Home() {
  const [datatableParams, setDatatableParams] = useState<DatatableParams>({
    pageSize: 10,
    currentPage: 1,
    search: '',
  })

  const {
    data: usersResult,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users', JSON.stringify(datatableParams)],
    queryFn: async () => {
      const { pageSize, currentPage, search } = datatableParams

      const params = new URLSearchParams({
        pageSize: String(pageSize),
        page: String(currentPage),
      })

      if (search) {
        params.set('search', search)
      }

      const queryString = '?' + params.toString()

      const res = await fetch('/api/users' + queryString)
      if (!res.ok) {
        toast.add({
          type: 'error',
          title: 'Error',
          description: 'Failed to fetch users list',
        })
        throw new Error(`Server error: ${res.status}`)
      }

      const json = (await res.json()) as PaginatedResult<User>
      return json
    },
    placeholderData: (prev) => prev,
  })

  const { data: users = [], meta } = usersResult || {}

  const isFetchingWithDebounce = useDebouncedIsFetching({
    isFetching,
    delay: 200,
  })

  return (
    <>
      <Datatable<User>
        className="mt-8 ml-8 md:max-w-3xl mb-60"
        columns={[
          {
            headerName: 'ID',
            field: 'id',
            style: {
              width: '10%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
            cellRenderer: ({ id }) => <code className="text-xs">{id}</code>,
          },
          {
            headerName: 'First Name',
            field: 'firstName',
          },
          {
            headerName: 'Last Name',
            field: 'lastName',
          },
          {
            headerName: 'Created At',
            field: 'createdAt',
            cellRenderer: ({ createdAt }) =>
              new Date(createdAt).toLocaleDateString('en-us'),
          },
          {
            headerName: 'Email',
            field: 'email',
            style: {
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
            cellRenderer: ({ email }) => (
              <a
                className="text-indigo-500 dark:text-indigo-300 no-underline hover:underline"
                href={`mailto:${email}`}
              >
                {email}
              </a>
            ),
          },
        ]}
        data={users}
        totalCount={meta?.totalCount ?? 0}
        params={datatableParams}
        setParams={setDatatableParams}
        loading={isFetchingWithDebounce}
        error={
          error ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <UserIcon />
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
