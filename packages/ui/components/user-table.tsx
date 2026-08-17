import { Badge } from './ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import type { User } from '@repo/models'
import { PseudoTable, PseudoTableProps } from './pseudo-table'
import { ComponentProps } from 'react'

const RoleBadge = ({ role }: { role: User['role'] }) => {
  if (role === 'staff') {
    return (
      <Badge className="bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
        Staff
      </Badge>
    )
  }

  if (role === 'provider') {
    return (
      <Badge className="bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
        Provider
      </Badge>
    )
  }

  if (role === 'admin') {
    return (
      <Badge className="bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
        Admin
      </Badge>
    )
  }

  if (role === 'owner') {
    return (
      <Badge className="bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300">
        Owner
      </Badge>
    )
  }

  return <Badge variant="secondary">Staff</Badge>
}

export const UserPseudoTable = (
  props: Omit<PseudoTableProps<User>, 'rowContent'> & ComponentProps<'div'>,
) => {
  return (
    <PseudoTable<User>
      className="@container"
      rowContent={(user) => {
        const { firstName, lastName, email, phone, role } = user
        const fullName = firstName + ' ' + lastName
        const initials = `${firstName?.length ? firstName.slice(0, 1) : ''}${lastName?.length ? lastName.slice(0, 1) : ''}`

        return (
          <div className="flex grow items-stretch">
            <div className="flex items-center">
              <Avatar size="lg" className="mr-4">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt={`profile-picture ${fullName}`}
                />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col grow">
              <b className="text-lg">{fullName}</b>
              <div className="flex flex-col gap-1 @md:flex-row @md:gap-2 text-muted-foreground">
                <a
                  href={`mailto:${email}`}
                  className="hover:text-link cursor-pointer"
                >
                  {email}
                </a>

                {email && phone && <span className="hidden @md:inline">•</span>}
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="hover:text-link cursor-pointer"
                  >
                    {phone}
                  </a>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <RoleBadge role={role} />
            </div>
          </div>
        )
      }}
      {...props}
    />
  )
}
