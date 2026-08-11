import { User } from '@repo/models'
import { useQuery } from '@tanstack/react-query'
import { Datatable, DatatableParams } from '@repo/ui'
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

      const params = new URLSearchParams({
        pageSize: String(pageSize),
        page: String(currentPage),
      })

      if (search) {
        params.set('q', search)
      }

      const queryString = '?' + params.toString()

      try {
        const data = await fetch('/api/users' + queryString)
        const json = (await data.json()) as {
          users: User[]
          totalCount: number
        }
        return json
      } catch (err) {
        throw new Error(err as unknown as string)
        console.error(err)
        return { users: [], totalCount: 0 }
      }
    },
    // placeholderData: (prev) => prev,
  })

  console.log(error)

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
        totalCount={totalCount}
        params={datatableParams}
        setParams={setDatatableParams}
        loading={isFetching}
        error={error ? 'Something happened' : undefined}
      ></Datatable>
    </>
  )
}
