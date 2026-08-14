import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { Practice } from '../../../../../../packages/models/dist/src/practice'
import {
  Empty,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  toast,
} from '@repo/ui'

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

  if (!data) return <Empty>No practice details found</Empty>

  const { name, image, url } = data

  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-end gap-6">
        <img className="rounded" src={image} height="120" width="120" />
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl">{name}</h1>
          <a
            // className="text-indigo-500 dark:text-indigo-300 no-underline hover:underline"
            className="text-link"
            href={url}
            target="_blank"
          >
            {url}
          </a>
        </div>
      </div>

      <Tabs>
        <TabsList variant="line" className="mb-10">
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="users">
          Make changes to your account here.
        </TabsContent>
        <TabsContent value="password">Change your password here.</TabsContent>
      </Tabs>
    </div>
  )
}
