import { createRoot } from 'react-dom/client'
import './style.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import Home from './home'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

const App = () => (
  <>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="home" replace />} />
          <Route index path="home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  </>
)

createRoot(document.getElementById('app')!).render(<App />)
