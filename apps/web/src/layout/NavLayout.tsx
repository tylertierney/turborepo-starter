import {
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  toast,
  useSidebar,
} from '@repo/ui'
import {
  ArrowRightSquare,
  Calendar,
  ChevronDown,
  ChevronsUpDown,
  House,
  LogOutIcon,
  LucideProps,
  MenuIcon,
  ShieldCog,
  User,
  User2,
} from 'lucide-react'
import { Link, Outlet, useNavigate } from 'react-router'
import { useTheme } from '../context/ThemeProvider'
import { authClient } from '../auth-client'
import { useSession } from '../hooks/useSession2'
import { Avatar, AvatarFallback } from '@repo/ui'

const themeSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
    <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
    <path d="M12 3l0 18"></path>
    <path d="M12 9l4.65 -4.65"></path>
    <path d="M12 14.3l7.37 -7.37"></path>
    <path d="M12 19.6l8.85 -8.85"></path>
  </svg>
)

export const NavLayout = () => {
  const { user } = useSession()

  const firstName = user?.firstName || ''
  const lastName = user?.lastName || ''
  const email = user?.email || ''

  const initials = (firstName.slice(0, 1) || '') + (lastName.slice(0, 1) || '')
  const fullName = firstName + ' ' + lastName

  const { theme, setTheme } = useTheme()
  const { setOpen, openMobile, setOpenMobile } = useSidebar()

  const navigate = useNavigate()

  const items = [
    {
      name: 'Home',
      url: '',
      icon: (props: LucideProps) => <House {...props} />,
    },
    {
      name: 'Schedule',
      url: 'schedule',
      icon: (props: LucideProps) => <Calendar {...props} />,
    },
    {
      name: 'Admin',
      url: 'admin',
      icon: (props: LucideProps) => <ShieldCog {...props} />,
    },
  ]

  return (
    <>
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarContent>
          <SidebarMenu className="mt-6 justify-center">
            {items.map((p) => (
              <SidebarMenuItem
                key={p.name}
                className="flex items-center justify-center px-2"
              >
                <SidebarMenuButton
                  tooltip={p.name}

                  size="xl"
                  onClick={() => {
                    if (openMobile) {
                      setOpen(false)
                      setOpenMobile(false)
                    }
                  }}
                  render={<Link to={p.url} />}
                >
                  <p.icon />
                  <span className="mt-0.5 ml-1">{p.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger render={<SidebarMenuButton size="xl" />}>
                  <Avatar size="default">
                    <AvatarImage
                      src={user?.image as string}
                      alt={`profile-picture ${fullName}`}
                    />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col grow overflow-hidden">
                    {Boolean(fullName) && (
                      <b className="text-xs block text-ellipsis overflow-hidden text-nowrap">
                        {fullName}
                      </b>
                    )}
                    {Boolean(email) && (
                      <span className="text-xs block text-ellipsis overflow-hidden text-nowrap">
                        {email}
                      </span>
                    )}
                  </div>
                  <ChevronsUpDown className="size-5! stroke-accent-foreground/70" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuItem render={<Link to="profile" />}>
                      <User />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={async () => {
                        const res = await authClient.signOut()
                        if (res) {
                          navigate('/login')
                        } else {
                          toast.add({
                            type: 'error',
                            title: 'Error',
                            description:
                              'Error occurred while attempting logout.',
                          })
                        }
                      }}
                      variant="destructive"
                    >
                      <LogOutIcon />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-col grow max-w-full sm:items-center">
        <nav className="h-16 px-4 sticky top-0 left-0 w-full z-10 flex items-center justify-end border-b bg-background/30 backdrop-blur-xl ">
          <SidebarTrigger size="icon-lg" className="mr-auto" variant="outline">
            <MenuIcon />
          </SidebarTrigger>
          <Button
            onClick={() =>
              theme === 'light' ? setTheme('dark') : setTheme('light')
            }
            variant="outline"
            size="icon-lg"
          >
            {themeSvg}
          </Button>
        </nav>

        <Outlet />
      </div>
    </>
  )
}
