import { type ReactNode, useMemo } from 'react'
import { WagmiProvider, createConfig, http } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import sdk from '@farcaster/frame-sdk'

function createWagmiConfig() {
  // Use Farcaster's embedded wallet provider if available
  const farcasterTransport = sdk.wallet?.ethProvider

  return createConfig({
    chains: [base, baseSepolia],
    transports: {
      [base.id]: http(),
      [baseSepolia.id]: http(),
    },
    connectors: farcasterTransport ? [] : undefined,
  })
}

export function WalletProvider({ children }: { children: ReactNode }) {
  const config = useMemo(() => createWagmiConfig(), [])

  return (
    <WagmiProvider config={config}>
      {children}
    </WagmiProvider>
  )
}
