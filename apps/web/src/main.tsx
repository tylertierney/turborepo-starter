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
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import Home from './pages/home'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './context/ThemeProvider'
import { NavLayout } from './layout/NavLayout'
import { Admin } from './pages/admin/admin'
import { AdminPractices } from './pages/admin/practices/admin-practices'
import { Building } from 'lucide-react'
import { AdminPractice } from './pages/admin/practices/admin-practice'

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
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="home" replace />} />
              <Route
                element={
                  <SidebarProvider>
                    <NavLayout />
                  </SidebarProvider>
                }
              >
                <Route index path="home" element={<Home />} />
                <Route path="admin" element={<Admin />}>
                  <Route index element={<Navigate to="practices" replace />} />
                  <Route path="practices" element={<AdminPractices />}>
                    <Route
                      path=""
                      index
                      element={
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
                      }
                    />
                    <Route path=":practiceId" element={<AdminPractice />} />
                  </Route>
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  </>
)

createRoot(document.getElementById('app')!).render(<App />)
