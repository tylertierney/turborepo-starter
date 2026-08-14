import { Card } from '@repo/ui'
import UsersTable from './users-table'

export const Admin = () => {
  return (
    <div className="flex">
      <Card>
        <UsersTable />
      </Card>
    </div>
  )
}
