import { Navigate, Outlet, useLocation } from 'react-router'
import { useSession } from '../hooks/useSession2'

export const ProtectedRoute = () => {
  const { data: session, isPending } = useSession()
  const location = useLocation()

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading session...</p>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}
