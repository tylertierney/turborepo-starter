import { Badge } from '../ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { userRoles, type User, type UserRole } from '@repo/models'
import { PseudoTable, PseudoTableProps } from './pseudo-table'
import { ComponentProps } from 'react'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../ui/empty'
import { Button } from '../ui/button'
import { UserIcon, RefreshCcw, ArrowUpRightIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from '../ui/select'

const RoleBadge = ({ role }: { role: UserRole }) => {
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

export const UserPseudoTable = ({
  onRefresh,
  error = false,
  params,
  setParams,
  ...rest
}: Omit<PseudoTableProps<User>, 'rowContent'> & {
  onRefresh?: () => void
  error?: boolean
} & ComponentProps<'div'>) => {
  // const [roleFilter, setRoleFilter] = useState<UserRole | null>(null)

  return (
    <PseudoTable<User>
      params={params}
      setParams={setParams}
      className="@container"
      header={
        <h3 className="text-xl">
          <b>Users ({(rest.totalCount ?? 0).toLocaleString()})</b>
        </h3>
      }
      sortableColumns={[
        {
          key: 'createdAt',
          label: 'Created At',
        },
        {
          key: 'firstName',
          label: 'First Name',
        },
        {
          key: 'lastName',
          label: 'Last Name',
        },
        {
          key: 'email',
          label: 'Email',
        },
        {
          key: 'role',
          label: 'Role',
        },
      ]}
      rowContent={(user) => {
        const { firstName, lastName, email, phone, role, image } = user
        const fullName = firstName + ' ' + lastName
        const initials = `${firstName?.length ? firstName.slice(0, 1) : ''}${lastName?.length ? lastName.slice(0, 1) : ''}`

        const overflowClasses =
          ' text-ellipsis overflow-hidden max-w-46 @lg:max-w-min'

        return (
          <div className="flex grow items-stretch">
            <div className="flex items-center">
              <Avatar size="lg" className="mr-4">
                <AvatarImage src={image} alt={`profile-picture ${fullName}`} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col grow">
              <b className="@md:text-lg">{fullName}</b>
              <div className="text-sm/tight flex flex-col gap-1 @xl:flex-row @xl:gap-2 text-muted-foreground">
                <a
                  href={`mailto:${email}`}
                  className={`${overflowClasses} text-nowrap hover:text-link cursor-pointer`}
                >
                  {email}
                </a>

                {email && phone && <span className="hidden @xl:inline">•</span>}
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
      error={
        error ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <UserIcon />
              </EmptyMedia>
              <EmptyTitle>No Users Found</EmptyTitle>
              <EmptyDescription>
                No users were found - or there was a network error. Try again
                momentarily.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex-row justify-center gap-2">
              <Button onClick={() => onRefresh?.()} variant="outline">
                <RefreshCcw />
                Refresh
              </Button>
            </EmptyContent>
            <Button
              variant="link"
              className="text-muted-foreground"
              size="sm"
              nativeButton={false}
              render={
                <a>
                  Or contact support <ArrowUpRightIcon />
                </a>
              }
            />
          </Empty>
        ) : undefined
      }
      filtersArea={
        <Select<UserRole | null>
          value={(params.filter?.role ?? null) as UserRole | null}
          onValueChange={(val) => {
            if (!val) {
              setParams((prev) => ({
                ...prev,
                filter: Object.fromEntries(
                  Object.entries(prev.filter ?? {}).filter(
                    ([f]) => f !== 'role',
                  ),
                ) as Record<keyof User, string>,
              }))
              return
            }

            setParams((prev) => ({
              ...prev,
              filter: { ...prev.filter, role: val },
            }))
          }}
        >
          <SelectTrigger className="border-0">Role</SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Filter by role</SelectLabel>
              <SelectItem value={null}>All</SelectItem>
              {userRoles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role[0].toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      }
      {...rest}
    />
  )
}
