import { Toaster } from '@repo/ui'
import { createRoot } from 'react-dom/client'
import './style.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import Home from './home'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './context/ThemeProvider'

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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="home" replace />} />
            <Route index path="home" element={<Home />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  </>
)

createRoot(document.getElementById('app')!).render(<App />)
