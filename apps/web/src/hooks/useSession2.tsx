import { authClient } from '../auth-client'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api'
import { User } from '@repo/models'

type UseSessionRes = ReturnType<typeof authClient.useSession>

export const useSession = (): UseSessionRes & { user?: Partial<User> } => {
  const session = authClient.useSession()

  const id = session.data?.user.id

  const { data: userData } = useQuery({
    queryKey: [`session-for-user`, id],
    queryFn: async () => {
      const { data } = await api.get<User>(`/api/users/${id}`)

      return data
    },
    enabled: Boolean(id),
  })

  if (!session || !session.data || !session.data.user) return session

  return {
    ...session,
    user: userData,
  }
}
