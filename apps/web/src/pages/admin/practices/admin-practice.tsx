import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { Clinic, PaginatedResult, Practice, User } from '@repo/models'
import {
  Button,
  convertDatatableParamsToQueryString,
  DatatableParams,
  Empty,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
  UserPseudoTable,
} from '@repo/ui'
import { ArrowUpRightIcon, BuildingIcon, MapPinIcon } from 'lucide-react'
import { useState } from 'react'
import { useDebouncedIsFetching } from '../../../hooks/useDebouncedIsFetching'

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
    pageSize: 10,
    currentPage: 1,
    sort: [
      {
        by: 'createdAt',
        order: 'desc',
      },
    ],
    search: '',
  })
  const {
    data: usersResponse,
    isFetching: isFetchingUsers,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery({
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
    placeholderData: (prev) => prev,
  })

  const isFetchingUsersWithDebounce = useDebouncedIsFetching({
    isFetching: isFetchingUsers,
    delay: 200,
  })

  const { data: clinicsResponse } = useQuery({
    queryKey: [`admin-practices-id-clinics=${selectedPracticeId}`],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/practices/${selectedPracticeId}/clinics`)

        if (!res.ok) {
          toast.add({
            type: 'error',
            title: 'Error',
            description: `Failed to fetch clinics`,
          })
          throw new Error(`Server error: ${res.status}`)
        }

        const json = (await res.json()) as PaginatedResult<Clinic>
        return json
      } catch (err) {
        return {
          data: [],
          meta: {
            totalCount: 0,
            totalPages: 0,
            currentPage: 1,
            itemCount: 0,
            pageSize: 10,
          },
        }
      }
    },
    placeholderData: (prev) => prev,
  })

  const { data: clinics = [] } = clinicsResponse || {}

  if (!data) return <Empty>No practice details found</Empty>

  const { name, image, url } = data
  const { data: users = [], meta } = usersResponse || {}

  return (
    <div className="flex flex-col gap-10 pt-0 p-8 px-4 @lg:px-8 @4xl:pt-8 @7xl:min-w-5xl @7xl:self-center">
      <div className="flex items-end gap-6">
        <img
          className="shrink-0 rounded"
          src={image}
          height="120"
          width="120"
        />
        <div className="flex flex-col gap-2">
          <h1
            className="text-2xl @lg:text-3xl"
            // style={{ fontFamily: 'Montserrat' }}
          >
            {name}
          </h1>
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
          <div className="flex flex-col items-stretch gap-16 pt-8 md:max-w-6xl">
            <section>
              <h3 className="text-xl mb-4">
                <b>Clinics ({clinics.length})</b>
              </h3>
              <div className="flex justify-between flex-wrap">
                {clinics.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col rounded overflow-hidden grow w-full @lg:w-[48%] @lg:max-w-[48%] p-0 border shadow mb-8"
                  >
                    <img
                      // width="100%"
                      height="4rem"
                      width="auto"
                      src={c.image}
                      className="max-h-40 sm:max-h-48"
                      style={{
                        objectFit: 'cover',
                      }}
                    />
                    <div className="flex flex-col p-4 gap-1">
                      <span>{c.name}</span>
                      <span className="flex gap-1 items-center text-xs text-muted-foreground">
                        <BuildingIcon size="12" />
                        <span>
                          {c.address?.street1}
                          {c.address?.street2 && `, ${c.address.street2}`}
                        </span>
                      </span>
                      <span className="flex gap-1 items-center text-xs text-muted-foreground">
                        <MapPinIcon size="12" />
                        <span>
                          {c.address?.city}, {c.address?.state}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
            <UserPseudoTable
              params={usersDatatableParams}
              setParams={setUsersDatatableParams}
              data={users}
              totalCount={meta?.totalCount ?? 0}
              loading={isFetchingUsersWithDebounce}
              error={Boolean(usersError)}
              onRefresh={refetchUsers}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
