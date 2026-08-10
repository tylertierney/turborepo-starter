import { User } from '@repo/models'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@repo/ui'

export default function Home() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const data = await fetch('http://localhost:8080/api/users')
      const json = (await data.json()) as { users: User[]; totalCount: number }
      return json
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {(error as Error).message}</div>
  }

  const { users = [], totalCount = 0 } = data || {}

  return (
    <>
      <Button
        variant={'outline'}
        size={'lg'}
        onClick={() => console.log('clicked')}
      >
        hello
      </Button>
      <h2>Found {totalCount} users </h2>
      <table className="w-full">
        <thead>
          <tr>
            {['First Name', 'Last Name', 'Email'].map((header) => (
              <th key={header} className="text-left bg-pink-400">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
