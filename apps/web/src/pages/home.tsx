import { toast, UserPseudoTable } from '@repo/ui'
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
import { PaginatedResult, User } from '@repo/models'
import { useQuery } from '@tanstack/react-query'
import { PaginatedTable, DatatableParams } from '@repo/ui'
import { useState } from 'react'
import { ArrowUpRightIcon, RefreshCcw, User as UserIcon } from 'lucide-react'
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
    // <div className="@container flex flex-col pt-8 sm:px-8 sm:items-center md:max-w-6xl w-full">
    //   <PaginatedTable<User>
    //     className="mb-60 md:w-full"
    //     tableClassName="@xl:table-layout-fixed"
    //     columns={[
    //       {
    //         headerName: 'ID',
    //         field: 'id',
    //         cellRenderer: ({ id }) => <code className="text-xs">{id}</code>,
    //         style: {
    //           width: '80px',
    //           overflow: 'hidden',
    //           textOverflow: 'ellipsis',
    //           minWidth: '80px',
    //           maxWidth: '80px',
    //           paddingRight: '20px',
    //         },
    //       },
    //       {
    //         headerName: 'First Name',
    //         field: 'firstName',
    //         sortable: true,
    //       },
    //       {
    //         headerName: 'Last Name',
    //         field: 'lastName',
    //         sortable: true,
    //       },
    //       {
    //         headerName: 'Email',
    //         field: 'email',
    //         sortable: true,
    //         cellRenderer: ({ email }) => (
    //           <a className="text-link" href={`mailto:${email}`}>
    //             {email}
    //           </a>
    //         ),
    //       },
    //       {
    //         headerName: 'Created At',
    //         field: 'createdAt',
    //         sortable: true,
    //         cellRenderer: ({ createdAt }) =>
    //           new Date(createdAt).toLocaleDateString('en-us'),
    //       },
    //     ]}
    //     data={users}
    //     totalCount={meta?.totalCount ?? 0}
    //     params={datatableParams}
    //     setParams={setDatatableParams}
    //     loading={isFetchingWithDebounce}
    //     // tableStyle={{ tableLayout: '' }}
    //     defaultColDef={{
    //       style: {
    //         overflow: 'hidden',
    //         textOverflow: 'ellipsis',
    //       },
    //     }}
    //     error={
    //       error ? (
    //         <Empty>
    //           <EmptyHeader>
    //             <EmptyMedia variant="icon">
    //               <UserIcon />
    //             </EmptyMedia>
    //             <EmptyTitle>No Users Found</EmptyTitle>
    //             <EmptyDescription>
    //               No users were found - or there was a network error. Try again
    //               momentarily.
    //             </EmptyDescription>
    //           </EmptyHeader>
    //           <EmptyContent className="flex-row justify-center gap-2">
    //             <Button onClick={() => refetch()} variant="outline">
    //               <RefreshCcw />
    //               Refresh
    //             </Button>
    //           </EmptyContent>
    //           <Button
    //             variant="link"
    //             className="text-muted-foreground"
    //             size="sm"
    //             nativeButton={false}
    //             render={
    //               <a>
    //                 Or contact support <ArrowUpRightIcon />
    //               </a>
    //             }
    //           />
    //         </Empty>
    //       ) : undefined
    //     }
    //   ></PaginatedTable>
    // </div>
    <div className="flex flex-col w-full p-8 md:max-w-6xl">
      {/* <img src="eye-side.svg" className="grayscale-25" /> */}
      {/* <img src="eye-top.svg" className="grayscale-75" /> */}
      <EyeTopSvg
        preserveAspectRatio="true"
        className="w-full grayscale-50 aspect-auto"
        // className="w-full aspect-auto"
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
