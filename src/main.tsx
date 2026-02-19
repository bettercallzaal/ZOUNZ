import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { FarcasterProvider } from './providers/FarcasterProvider.tsx'
import { WalletProvider } from './providers/WalletProvider.tsx'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <FarcasterProvider>
          <WalletProvider>
            <App />
          </WalletProvider>
        </FarcasterProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
