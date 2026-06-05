'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '../config'

// QueryClient menangani proses caching dan loading data dari blockchain
const queryClient = new QueryClient()

export function Providers({ children }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}