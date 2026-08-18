import {
  convertDatatableParamsToQueryString,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  toast,
} from '@repo/ui'
import { useQuery } from '@tanstack/react-query'
import { PaginatedResult, Practice } from '@repo/models'
import { Link, Outlet, useNavigate, useParams } from 'react-router'
import { SearchInput } from '../../../../../../packages/ui/components/ui/input-group'
import { useState } from 'react'
import { Select } from '@repo/ui'

export const AdminPractices = () => {
  const { practiceId: selectedPracticeId } = useParams()

  const [search, setSearch] = useState('')

  const navigate = useNavigate()

  const {
    data: practicesResult,
    // isFetching,
    // error,
    // refetch,
  } = useQuery({
    queryKey: ['admin-all-practices', `search=${search}`],
    queryFn: async () => {
      const queryString = convertDatatableParamsToQueryString<Practice>({
        currentPage: 1,
        pageSize: 100,
        sort: [{ by: 'createdAt', order: 'desc' }],
        search,
      })

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
  const { totalCount = 0 } = meta || {}

  const selectedPractice = practices.find((p) => p.id === selectedPracticeId)

  return (
    <div className="flex grow @container">
      <div className="flex-col hidden max-w-2xs min-w-2xs border-r h-[calc(100vh-4rem)] sticky top-16 @4xl:flex @5xl:min-w-xs @5xl:max-w-xs">
        <div className="flex justify-between p-4 border-b items-center flex-wrap gap-2">
          <h3>
            <b>{totalCount} Practices</b>
          </h3>

          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex flex-col overflow-y-auto">
          {practices.map(({ name, id, image }, idx) => {
            const active = selectedPracticeId === id

            return (
              <Link
                key={idx}
                to={id}

                className={`p-4 border-b flex gap-4 items-center justify-between ${!active ? 'hover:bg-accent-foreground/5' : ''} ${active ? 'bg-accent-foreground/15' : ''}`}
              >
                <img src={image} height="60" width="60" className="rounded" />
                <div className="flex flex-col grow">
                  <span>{name}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
      <div className="flex flex-col grow overflow-y-auto">
        <div className="@4xl:hidden flex items-center justify-end p-8">
          <Select<Practice | undefined>
            value={selectedPractice}
            onValueChange={(p) => {
              if (p) {
                navigate(`./${p?.id}`)
              }
            }}
          >
            <SelectTrigger>
              <SelectValue>
                {selectedPractice?.name || 'Choose a practice'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="max-h-106 overflow-y-auto">
              <SelectGroup>
                <SelectLabel>Practices</SelectLabel>
                {practices.map((p) => (
                  <SelectItem key={p.id} value={p}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
