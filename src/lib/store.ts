import { createContext, useContext } from 'react'

export interface MintableTrack {
  id: string
  title: string
  artist: string
  audioUrl: string
  artworkUrl?: string
  source: 'ai_generated' | 'audius' | 'upload'
  genre?: string
  duration?: number
  audiusTrackId?: string
}

export interface PlayerState {
  track: MintableTrack | null
  isPlaying: boolean
  progress: number
  duration: number
}

export interface AppState {
  // Track queued for minting (set from Create or Discover, consumed by Mint)
  mintQueue: MintableTrack | null
  // Global player state
  player: PlayerState
  // Navigation callback
  setTab: (tab: string) => void
}

export interface AppActions {
  queueForMint: (track: MintableTrack) => void
  clearMintQueue: () => void
  playerPlay: (track: MintableTrack) => void
  playerPause: () => void
  playerStop: () => void
  setTab: (tab: string) => void
}

export const AppContext = createContext<AppState & AppActions>({
  mintQueue: null,
  player: { track: null, isPlaying: false, progress: 0, duration: 0 },
  setTab: () => {},
  queueForMint: () => {},
  clearMintQueue: () => {},
  playerPlay: () => {},
  playerPause: () => {},
  playerStop: () => {},
})

export function useAppStore() {
  return useContext(AppContext)
}
