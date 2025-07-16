"use client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia, arbitrum } from 'wagmi/chains';

const config = createConfig({
    chains: [mainnet, sepolia, arbitrum],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [arbitrum.id]: http(),
    },
});

const queryClient = new QueryClient();

export function Providers({ children }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    );
}
