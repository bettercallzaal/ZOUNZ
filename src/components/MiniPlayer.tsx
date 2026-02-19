import { useAppStore } from '../lib/store'

export default function MiniPlayer() {
  const { player, playerPause, playerPlay, playerStop } = useAppStore()

  if (!player.track) return null

  const progressPercent = player.duration > 0
    ? (player.progress / player.duration) * 100
    : 0

  return (
    <div className="bg-[var(--zaounz-card)] border-t border-[var(--zaounz-border)] px-3 py-2">
      {/* Progress bar */}
      <div className="w-full h-0.5 bg-white/10 rounded-full mb-2">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Artwork */}
        <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
          {player.track.artworkUrl ? (
            <img src={player.track.artworkUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm">
              {player.track.source === 'ai_generated' ? 'AI' : '~'}
            </div>
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium truncate">{player.track.title}</p>
          <p className="text-[10px] text-white/40 truncate">{player.track.artist}</p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              if (player.isPlaying) {
                playerPause()
              } else if (player.track) {
                playerPlay(player.track)
              }
            }}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm hover:bg-white/20 transition-colors"
          >
            {player.isPlaying ? '⏸' : '▶'}
          </button>
          <button
            onClick={playerStop}
            className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] text-white/40 hover:bg-white/10 transition-colors"
          >
            x
          </button>
        </div>
      </div>
    </div>
  )
}
