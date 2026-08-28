import { randWord } from '@ngneat/falso'
import {
  Button,
  ChipList,
  toast,
  TruncatedChips,
  UserPseudoTable,
  Badge,
} from '@repo/ui'
import { convertDatatableParamsToQueryString } from '@repo/ui'
import { PaginatedResult, User } from '@repo/models'
import { useQuery } from '@tanstack/react-query'
import { DatatableParams } from '@repo/ui'
import { useState } from 'react'
import { useDebouncedIsFetching } from '../hooks/useDebouncedIsFetching'
import { EyeTopSvg } from '../svg/EyeTopSvg/EyeTopSvg'

const strings = ['abc', 'defg', 'h', 'ij', 'kl', 'mno', 'pqrs', 'tu', 'v']

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

  const [items, setItems] = useState(strings)

  return (
    <div className="flex flex-col w-full p-4 sm:p-8 md:max-w-6xl">
      {/* <TruncatedChips
        style={{
          minWidth: '180px',
          maxWidth: '180px',
          maxHeight: '120px',
          border: 'solid red 1px',
        }}
        items={items}
      /> */}

      <ChipList
        items={items}
        renderChip={(str) => <Badge variant="secondary">{str}</Badge>}
        renderOverflow={(count) => <Badge variant="secondary">+{count}</Badge>}
        style={{
          maxWidth: '200px',
          maxHeight: '60px',
          border: 'solid red 1px',
        }}
      />

      <Button
        variant="default"
        onClick={() => {
          setItems((prev) => [...prev, randWord()])
        }}
      >
        Add
      </Button>
      <Button
        variant="destructive"
        onClick={() => {
          setItems((prev) => [...prev].slice(0, prev.length - 1))
        }}
      >
        Remove
      </Button>
      <br />
      <br />
      <br />
      <br />
      <br />
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
