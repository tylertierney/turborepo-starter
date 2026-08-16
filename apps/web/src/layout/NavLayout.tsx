import {
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  // SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@repo/ui'
import { Link, Outlet } from 'react-router'
import { useTheme } from '../context/ThemeProvider'
import {
  ChevronDown,
  House,
  MenuIcon,
  Plus,
  Shield,
  ShieldCog,
} from 'lucide-react'

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
  const { theme, setTheme } = useTheme()
  const { setOpen, isMobile, openMobile, setOpenMobile } = useSidebar()

  return (
    <>
      <Sidebar variant="sidebar">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger render={<SidebarMenuButton />}>
                  Select Workspace
                  <ChevronDown className="ml-auto" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <span>Acme Inc</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          {/* <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupAction>
              <Plus /> <span className="sr-only">Add Project</span>
            </SidebarGroupAction>
            <SidebarGroupContent></SidebarGroupContent>
          </SidebarGroup> */}
          {/* <Collapsible defaultOpen className="group/collapsible">
            <SidebarGroup>
              <SidebarGroupLabel render={<CollapsibleTrigger />}>
                Help
                <ChevronDown className="ml-auto transition-transform group-data-open/collapsible:rotate-180" />
              </SidebarGroupLabel>
              <CollapsibleContent>
                <SidebarGroupContent />
              </CollapsibleContent>
            </SidebarGroup>
          </Collapsible> */}
          <SidebarMenu>
            {[
              {
                name: 'Home',
                url: 'home',
                icon: () => <House />,
              },
            ].map((p) => (
              <SidebarMenuItem key={p.name}>
                <SidebarMenuButton
                  tooltip={p.name}
                  render={<Link className="flex items-center" to={p.url} />}
                  onClick={() => {
                    if (isMobile && openMobile) {
                      setOpen(false)
                      setOpenMobile(false)
                    }
                  }}
                >
                  <p.icon />
                  <span>{p.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>

          <SidebarMenuItem className="mt-auto" key={'asdfasdfas'}>
            <SidebarMenuButton
              tooltip="Admin"
              className="text-xl"
              size="lg"
              render={<Link to="admin" className="flex items-center" />}
            >
              <ShieldCog style={{ width: '20px', height: '20px' }} size={72} />
              <span className="">Admin</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarContent>
      </Sidebar>
      <div className="flex flex-col grow max-w-full sm:items-center">
        <nav className="h-16 px-4 sticky top-0 left-0 w-full z-10 flex items-center justify-end border-b bg-background/30 backdrop-blur-xl ">
          <SidebarTrigger className="mr-auto" variant="outline">
            <MenuIcon />
          </SidebarTrigger>
          <Button
            onClick={() =>
              theme === 'light' ? setTheme('dark') : setTheme('light')
            }
            variant="outline"
            size="icon"
          >
            {themeSvg}
          </Button>
        </nav>

        <Outlet />
      </div>
      {/* </SidebarProvider> */}
    </>
  )
}
