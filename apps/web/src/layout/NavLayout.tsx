import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@repo/ui'
import { Outlet } from 'react-router'
import { useTheme } from '../context/ThemeProvider'
import { ChevronDown, MenuIcon } from 'lucide-react'

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

  return (
    <>
      <SidebarProvider>
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
        </Sidebar>
        <div className="flex flex-col grow max-w-full sm:items-center">
          <nav className="sticky top-0 left-0 w-full z-10 flex items-center justify-end py-4 px-8 border-b bg-background/30 backdrop-blur-xl ">
            <SidebarTrigger className="mr-auto sm:hidden" variant="outline">
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
          <div className="flex flex-col pt-8 sm:px-8 sm:items-center md:max-w-6xl">
            <Outlet />
          </div>
        </div>
      </SidebarProvider>
    </>
  )
}
