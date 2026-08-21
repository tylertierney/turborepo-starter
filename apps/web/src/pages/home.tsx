import { toast, UserPseudoTable } from '@repo/ui'
import { convertDatatableParamsToQueryString } from '@repo/ui'
import { PaginatedResult, User } from '@repo/models'
import { useQuery } from '@tanstack/react-query'
import { DatatableParams } from '@repo/ui'
import { useState } from 'react'
import { useDebouncedIsFetching } from '../hooks/useDebouncedIsFetching'
import { EyeTopSvg } from '../svg/EyeTopSvg/EyeTopSvg'

export default function Home() {
  const [datatableParams, setDatatableParams] = useState<DatatableParams<User>>(
    {
      pageSize: 10,
      currentPage: 1,
      search: '',
      sort: [],
    },
  )

  const {
    data: usersResult,
    isFetching,
    error,
    refetch,
  } = useQuery({
    queryKey: ['users', JSON.stringify(datatableParams)],
    queryFn: async () => {
      const queryString = convertDatatableParamsToQueryString(datatableParams)

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
    <div className="flex flex-col w-full p-4 sm:p-8 md:max-w-6xl">
      <EyeTopSvg
        preserveAspectRatio="true"
        className="w-full grayscale-50 aspect-auto"
      />
      <UserPseudoTable
        params={datatableParams}
        setParams={setDatatableParams}
        data={users}
        totalCount={meta?.totalCount ?? 0}
        loading={isFetchingWithDebounce}
        error={Boolean(error)}
        onRefresh={refetch}
      />
    </div>
  )
}
