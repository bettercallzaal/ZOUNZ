import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import sdk from '@farcaster/frame-sdk'

interface FarcasterUser {
  fid: number
  username: string
  displayName: string
  pfpUrl: string
}

interface FarcasterContextType {
  user: FarcasterUser | null
  isReady: boolean
  isInMiniApp: boolean
  openUrl: (url: string) => void
  composeCast: (text: string, embeds?: string[]) => void
  close: () => void
}

const FarcasterContext = createContext<FarcasterContextType>({
  user: null,
  isReady: false,
  isInMiniApp: false,
  openUrl: () => {},
  composeCast: () => {},
  close: () => {},
})

export function useFarcasterContext() {
  return useContext(FarcasterContext)
}

export function FarcasterProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FarcasterUser | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isInMiniApp, setIsInMiniApp] = useState(false)

  useEffect(() => {
    async function init() {
      try {
        const context = await sdk.context
        if (context?.user) {
          setUser({
            fid: context.user.fid,
            username: context.user.username ?? '',
            displayName: context.user.displayName ?? '',
            pfpUrl: context.user.pfpUrl ?? '',
          })
          setIsInMiniApp(true)
        }
      } catch {
        console.log('Not in Farcaster Mini App, running in dev mode')
      }

      sdk.actions.ready()
      setIsReady(true)
    }

    init()
  }, [])

  const openUrl = useCallback((url: string) => {
    if (isInMiniApp) {
      sdk.actions.openUrl(url)
    } else {
      window.open(url, '_blank')
    }
  }, [isInMiniApp])

  const composeCast = useCallback((text: string, embeds?: string[]) => {
    if (isInMiniApp) {
      sdk.actions.openUrl(
        `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}${
          embeds?.length ? `&embeds[]=${embeds.map(encodeURIComponent).join('&embeds[]=')}` : ''
        }`
      )
    } else {
      console.log('Cast compose (dev mode):', text, embeds)
      window.open(
        `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}${
          embeds?.length ? `&embeds[]=${embeds.map(encodeURIComponent).join('&embeds[]=')}` : ''
        }`,
        '_blank'
      )
    }
  }, [isInMiniApp])

  const close = useCallback(() => {
    if (isInMiniApp) {
      sdk.actions.close()
    }
  }, [isInMiniApp])

  return (
    <FarcasterContext.Provider value={{ user, isReady, isInMiniApp, openUrl, composeCast, close }}>
      {children}
    </FarcasterContext.Provider>
  )
}
