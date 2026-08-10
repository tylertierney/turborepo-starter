import { User } from '@repo/models'
import { useQuery } from '@tanstack/react-query'

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
      <h2>Found {totalCount} users </h2>
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
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
