import { Outlet } from 'react-router'

export const Admin = () => {
  return (
    <div className="flex w-full h-[calc(100vh-4rem)]">
      <Outlet />
    </div>
  )
}
