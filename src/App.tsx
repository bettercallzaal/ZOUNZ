import { useState, useRef, useCallback } from 'react'
import { useFarcasterContext } from './providers/FarcasterProvider'
import { AppContext, type MintableTrack, type PlayerState } from './lib/store'
import MiniPlayer from './components/MiniPlayer'
import Create from './views/Create'
import Discover from './views/Discover'
import Mint from './views/Mint'
import Trade from './views/Trade'

type Tab = 'create' | 'discover' | 'mint' | 'trade'

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'create', label: 'Create', icon: '🎵' },
  { id: 'discover', label: 'Discover', icon: '🔍' },
  { id: 'mint', label: 'Mint', icon: '💎' },
  { id: 'trade', label: 'Trade', icon: '📈' },
]

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('create')
  const { user, isReady } = useFarcasterContext()

  // Global state
  const [mintQueue, setMintQueue] = useState<MintableTrack | null>(null)
  const [player, setPlayer] = useState<PlayerState>({
    track: null,
    isPlaying: false,
    progress: 0,
    duration: 0,
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playerPlay = useCallback((track: MintableTrack) => {
    // If same track, just resume
    if (audioRef.current && player.track?.id === track.id) {
      audioRef.current.play()
      setPlayer((p) => ({ ...p, isPlaying: true }))
      return
    }

    // New track
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    const audio = new Audio(track.audioUrl)
    audioRef.current = audio

    audio.addEventListener('timeupdate', () => {
      setPlayer((p) => ({
        ...p,
        progress: audio.currentTime,
        duration: audio.duration || 0,
      }))
    })
    audio.addEventListener('ended', () => {
      setPlayer((p) => ({ ...p, isPlaying: false }))
    })
    audio.addEventListener('error', () => {
      setPlayer((p) => ({ ...p, isPlaying: false }))
    })

    audio.play()
    setPlayer({ track, isPlaying: true, progress: 0, duration: 0 })
  }, [player.track?.id])

  const playerPause = useCallback(() => {
    audioRef.current?.pause()
    setPlayer((p) => ({ ...p, isPlaying: false }))
  }, [])

  const playerStop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setPlayer({ track: null, isPlaying: false, progress: 0, duration: 0 })
  }, [])

  const queueForMint = useCallback((track: MintableTrack) => {
    setMintQueue(track)
    setActiveTab('mint')
  }, [])

  const clearMintQueue = useCallback(() => {
    setMintQueue(null)
  }, [])

  const setTab = useCallback((tab: string) => {
    setActiveTab(tab as Tab)
  }, [])

  if (!isReady) {
    return (
      <div className="flex-1 flex items-center justify-center h-dvh">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-2xl font-bold">Z</span>
          </div>
          <p className="text-white/60 text-sm">Loading ZAOUNZ...</p>
          <div className="mt-3 w-32 h-1 bg-white/10 rounded-full mx-auto overflow-hidden">
            <div className="h-full w-1/2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-[slide_1s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <AppContext.Provider value={{
      mintQueue,
      player,
      setTab,
      queueForMint,
      clearMintQueue,
      playerPlay,
      playerPause,
      playerStop,
    }}>
      <div className="flex flex-col h-dvh">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--zaounz-border)] bg-[var(--zaounz-dark)]/80 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-xs font-bold">Z</span>
            </div>
            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ZAOUNZ
            </h1>
          </div>
          {user ? (
            <div className="flex items-center gap-2">
              {user.pfpUrl && (
                <img
                  src={user.pfpUrl}
                  alt={user.username}
                  className="w-7 h-7 rounded-full border border-white/10"
                />
              )}
              <span className="text-xs text-white/50">@{user.username}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-white/40">dev mode</span>
            </div>
          )}
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'create' && <Create />}
          {activeTab === 'discover' && <Discover />}
          {activeTab === 'mint' && <Mint />}
          {activeTab === 'trade' && <Trade />}
        </main>

        {/* Mini Player */}
        <MiniPlayer />

        {/* Bottom Tab Navigation */}
        <nav className="flex border-t border-[var(--zaounz-border)] bg-[var(--zaounz-dark)] safe-bottom">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            const hasBadge = tab.id === 'mint' && mintQueue !== null
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-all relative ${
                  isActive
                    ? 'text-purple-400'
                    : 'text-white/35 active:text-white/60'
                }`}
              >
                {isActive && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-purple-400 rounded-full" />
                )}
                <span className="text-lg leading-none">{tab.icon}</span>
                <span className="text-[10px] font-medium">{tab.label}</span>
                {hasBadge && (
                  <div className="absolute top-1.5 right-1/2 translate-x-4 w-2 h-2 bg-pink-500 rounded-full" />
                )}
              </button>
            )
          })}
        </nav>
      </div>
    </AppContext.Provider>
  )
}

export default App
