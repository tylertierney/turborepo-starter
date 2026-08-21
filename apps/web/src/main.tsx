import { SidebarProvider } from '@repo/ui'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Toaster,
  TooltipProvider,
} from '@repo/ui'
import { createRoot } from 'react-dom/client'
import './style.css'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'
import Home from './pages/home'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './context/ThemeProvider'
import { NavLayout } from './layout/NavLayout'
import { Admin } from './pages/admin/admin'
import { AdminPractices } from './pages/admin/practices/admin-practices'
import { Building } from 'lucide-react'
import { AdminPractice } from './pages/admin/practices/admin-practice'
import { createAuthClient } from 'better-auth/react'
import { SignUp, signUpLoader } from './pages/auth/signup/signup'
import { Login } from './pages/auth/login/login'

export const authClient = createAuthClient()

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
})

const App = () => (
  <>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <RouterProvider
            router={createBrowserRouter([
              {
                path: '/',
                element: <Navigate to="app" replace />,
              },
              {
                path: 'signup/:invitationId',
                element: <SignUp />,
                loader: signUpLoader,
              },
              {
                path: 'login',
                element: <Login />,
              },
              {
                path: 'app',
                element: (
                  <SidebarProvider>
                    <NavLayout />
                  </SidebarProvider>
                ),
                children: [
                  {
                    index: true,
                    element: <Home />,
                  },
                  {
                    path: 'admin',
                    element: <Admin />,
                    children: [
                      {
                        index: true,
                        element: <Navigate to="practices" replace />,
                      },
                      {
                        path: 'practices',
                        element: <AdminPractices />,
                        children: [
                          {
                            index: true,
                            element: (
                              <Empty className="place-self-center w-full">
                                <EmptyHeader>
                                  <EmptyMedia variant="icon">
                                    <Building />
                                  </EmptyMedia>
                                  <EmptyTitle>Select A Practice</EmptyTitle>
                                  <EmptyDescription>
                                    Select a practice to review activity, users,
                                    account status, etc.
                                  </EmptyDescription>
                                </EmptyHeader>
                              </Empty>
                            ),
                          },
                          {
                            path: ':practiceId',
                            element: <AdminPractice />,
                          },
                        ],
                      },
                    ],
                  },
                  {
                    path: '*',
                    element: <Navigate to="/" replace />,
                  },
                ],
              },
              {},
            ])}
          />
        </TooltipProvider>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  </>
)

createRoot(document.getElementById('app')!).render(<App />)
