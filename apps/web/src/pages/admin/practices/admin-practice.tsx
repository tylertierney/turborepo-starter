import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { PaginatedResult, Practice, User } from '@repo/models'
import {
  Button,
  convertDatatableParamsToQueryString,
  PaginatedTable,
  DatatableParams,
  Empty,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
} from '@repo/ui'
import { ArrowUpRightIcon } from 'lucide-react'
import { useState } from 'react'

export const AdminPractice = () => {
  const { practiceId: selectedPracticeId } = useParams()

  const { data } = useQuery({
    queryKey: [`admin-practices-id=${selectedPracticeId}`],
    queryFn: async () => {
      const res = await fetch(`/api/practices/${selectedPracticeId}`)
      if (!res.ok) {
        toast.add({
          type: 'error',
          title: 'Error',
          description: 'Failed to fetch practice details',
        })
        throw new Error(`Server error: ${res.status}`)
      }

      const json = (await res.json()) as Practice
      return json
    },
  })

  const [usersDatatableParams, setUsersDatatableParams] = useState<
    DatatableParams<User>
  >({
    pageSize: 20,
    currentPage: 1,
    sort: [
      {
        by: 'createdAt',
        order: 'desc',
      },
    ],
    search: '',
  })
  const { data: usersResponse } = useQuery({
    queryKey: [
      `admin-practices-id-users=${selectedPracticeId}`,
      JSON.stringify(usersDatatableParams),
    ],
    queryFn: async () => {
      const queryString =
        convertDatatableParamsToQueryString(usersDatatableParams)
      const res = await fetch(
        `/api/practices/${selectedPracticeId}/users` + queryString,
      )
      if (!res.ok) {
        toast.add({
          type: 'error',
          title: 'Error',
          description: `Failed to fetch users`,
        })
        throw new Error(`Server error: ${res.status}`)
      }

      const json = (await res.json()) as PaginatedResult<User>
      return json
    },
  })

  if (!data) return <Empty>No practice details found</Empty>

  const { name, image, url } = data
  const { data: users = [], meta } = usersResponse || {}

  return (
    <div className="flex flex-col gap-10 pt-0 p-8 md:pt-8">
      <div className="flex items-end gap-6">
        <img
          className="shrink-0 rounded"
          src={image}
          height="120"
          width="120"
        />
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl">{name}</h1>
          <Button
            variant="link"
            className="text-link justify-start p-0"
            nativeButton={false}
            render={
              <a href={url} target="_blank">
                {url} <ArrowUpRightIcon />
              </a>
            }
          />
        </div>
      </div>

      <Tabs className="mb-60">
        <TabsList variant="line" className="mb-10">
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>
        <TabsContent value="about">
          <div className="flex flex-col pt-8 sm:items-center md:max-w-6xl">
            <PaginatedTable<User>
              className="md:w-full"
              params={usersDatatableParams}
              setParams={setUsersDatatableParams}
              data={users}
              totalCount={meta?.totalCount ?? 0}
              tableClassName="table-layout-fixed"
              header={
                <h3 className="text-xl">
                  <b>Users</b>
                </h3>
              }
              defaultColDef={{
                style: {
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                },
              }}
              columns={[
                {
                  headerName: 'ID',
                  field: 'id',
                  cellRenderer: ({ id }) => (
                    <code className="text-xs">{id}</code>
                  ),
                  style: {
                    width: '80px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    minWidth: '80px',
                    maxWidth: '80px',
                    paddingRight: '20px',
                  },
                },
                {
                  headerName: 'First Name',
                  field: 'firstName',
                  sortable: true,
                },
                {
                  headerName: 'Last Name',
                  field: 'lastName',
                  sortable: true,
                },
                {
                  headerName: 'Email',
                  field: 'email',
                  sortable: true,
                  cellRenderer: ({ email }) => (
                    <a className="text-link" href={`mailto:${email}`}>
                      {email}
                    </a>
                  ),
                },
                {
                  headerName: 'Created At',
                  field: 'createdAt',
                  sortable: true,
                  cellRenderer: ({ createdAt }) =>
                    new Date(createdAt).toLocaleDateString('en-us'),
                },
              ]}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
