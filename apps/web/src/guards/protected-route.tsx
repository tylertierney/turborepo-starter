import { Navigate, Outlet, useLocation } from 'react-router'
import { useSession } from '../hooks/useSession2'

export const ProtectedRoute = () => {
  const { data, isPending } = useSession()
  const location = useLocation()

  const { user, session } = data || {}

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading session...</p>
      </div>
    )
  }

  if (!session || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
