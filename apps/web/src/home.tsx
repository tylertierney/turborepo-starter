import { User } from '@repo/models'
import { useQuery } from '@tanstack/react-query'
import { Button, Datatable, DatatableParams } from '@repo/ui'
import { useState } from 'react'

export default function Home() {
  const [datatableParams, setDatatableParams] = useState<DatatableParams>({
    pageSize: 10,
    currentPage: 1,
    search: '',
  })

  const { data, isFetching, error } = useQuery({
    queryKey: ['users', JSON.stringify(datatableParams)],
    queryFn: async () => {
      const { pageSize, currentPage, search } = datatableParams
      const url = new URL('http://localhost:8080/api/users')
      url.searchParams.set('pageSize', String(pageSize))
      url.searchParams.set('page', String(currentPage - 1))
      if (search) {
        url.searchParams.set('q', search)
      }

      try {
        const data = await fetch(url)
        const json = (await data.json()) as {
          users: User[]
          totalCount: number
        }
        return json
      } catch {
        return { users: [], totalCount: 0 }
      }
    },
    placeholderData: (prev) => prev,
  })

  const { users = [], totalCount = 0 } = data || {}

  return (
    <>
      <pre>{String(isFetching)}</pre>
      <Datatable<User>
        className="md:max-w-3xl mb-60"
        columns={[
          {
            headerName: 'ID',
            field: 'id',
            style: {
              width: '10%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            },
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
            headerName: 'Email',
            field: 'email',
            cellRenderer: ({ email }) => (
              <a
                className="text-indigo-500 no-underline hover:underline"
                href={`mailto:${email}`}
              >
                {email}
              </a>
            ),
          },
        ]}
        data={users}
        totalCount={totalCount}
        params={datatableParams}
        setParams={setDatatableParams}
        loading={isFetching}
        error={error ? 'Something happened' : undefined}
      ></Datatable>
    </>
  )
}
