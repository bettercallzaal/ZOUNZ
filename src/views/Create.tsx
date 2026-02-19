import { useState } from 'react'
import { useAppStore } from '../lib/store'

const GENRES = [
  'Any', 'Electronic', 'Hip-Hop', 'Lo-fi', 'Pop', 'Rock',
  'R&B', 'Jazz', 'Ambient', 'House', 'Drum & Bass', 'Trap',
]

export default function Create() {
  const [prompt, setPrompt] = useState('')
  const [genre, setGenre] = useState('Any')
  const [loading, setLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { queueForMint, playerPlay } = useAppStore()

  const trackTitle = prompt.slice(0, 50) || 'AI Track'

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setError(null)
    setAudioUrl(null)

    try {
      const fullPrompt = genre !== 'Any'
        ? `${genre} style: ${prompt}`
        : prompt

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt, duration: 30 }),
      })

      if (!res.ok) throw new Error('Generation failed')
      const data = await res.json()
      if (data.mock) {
        setError('Set HF_TOKEN to enable AI generation. Running in demo mode.')
        return
      }
      setAudioUrl(data.audioUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const handleMintClick = () => {
    if (!audioUrl) return
    queueForMint({
      id: `ai-${Date.now()}`,
      title: trackTitle,
      artist: 'You',
      audioUrl,
      source: 'ai_generated',
      genre: genre !== 'Any' ? genre : undefined,
    })
  }

  const handlePlay = () => {
    if (!audioUrl) return
    playerPlay({
      id: `ai-${Date.now()}`,
      title: trackTitle,
      artist: 'You',
      audioUrl,
      source: 'ai_generated',
      genre: genre !== 'Any' ? genre : undefined,
    })
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold">Create Music</h2>
        <p className="text-sm text-white/50 mt-1">
          Describe a song and AI will generate it
        </p>
      </div>

      {/* Prompt Input */}
      <div className="relative">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="A dreamy lo-fi beat with soft piano and rain sounds..."
          className="w-full h-28 bg-[var(--zaounz-card)] border border-[var(--zaounz-border)] rounded-xl p-3 text-sm text-white placeholder:text-white/30 resize-none focus:outline-none focus:border-purple-500/50 transition-colors"
          maxLength={500}
        />
        <span className="absolute bottom-2 right-3 text-[10px] text-white/20">
          {prompt.length}/500
        </span>
      </div>

      {/* Genre Chips */}
      <div className="flex flex-wrap gap-1.5">
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => setGenre(g)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              genre === g
                ? 'bg-purple-500 text-white scale-105'
                : 'bg-[var(--zaounz-card)] text-white/40 border border-[var(--zaounz-border)] hover:text-white/60 hover:border-white/20'
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        className="w-full py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-500 to-pink-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Generating...
          </span>
        ) : (
          'Create Music'
        )}
      </button>

      {/* Error */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3">
          <p className="text-sm text-red-400">{error}</p>
          <p className="text-xs text-white/30 mt-1">
            Make sure the backend server is running on port 3001
          </p>
        </div>
      )}

      {/* Generated Track Result */}
      {audioUrl && (
        <div className="bg-[var(--zaounz-card)] border border-purple-500/20 rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handlePlay}
              className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xl flex-shrink-0 active:scale-95 transition-transform"
            >
              ▶
            </button>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{trackTitle}</p>
              <p className="text-xs text-white/40">AI Generated / {genre}</p>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-[10px] text-green-400">Ready</span>
              </div>
            </div>
          </div>

          <audio controls src={audioUrl} className="w-full h-8 opacity-60" />

          <div className="flex gap-2">
            <a
              href={audioUrl}
              download={`zaounz-${Date.now()}.wav`}
              className="flex-1 py-2.5 rounded-xl bg-white/5 text-center text-xs font-medium text-white/60 hover:bg-white/10 transition-colors active:scale-[0.98]"
            >
              Download
            </a>
            <button
              onClick={handleMintClick}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-xs font-semibold hover:from-purple-500/30 hover:to-pink-500/30 transition-all active:scale-[0.98]"
            >
              Mint as NFT →
            </button>
          </div>
        </div>
      )}

      {/* How it works */}
      {!audioUrl && !loading && (
        <div className="mt-4 bg-[var(--zaounz-card)] border border-[var(--zaounz-border)] rounded-xl p-4">
          <p className="text-xs text-white/30 font-semibold uppercase tracking-wider mb-3">How it works</p>
          <div className="space-y-3">
            {[
              { step: '1', title: 'Describe', desc: 'Type what kind of music you want' },
              { step: '2', title: 'Generate', desc: 'AI creates a unique track using ACE-Step' },
              { step: '3', title: 'Own it', desc: 'Mint as an NFT on Base via Zora' },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold text-purple-400">{item.step}</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-white/70">{item.title}</p>
                  <p className="text-[10px] text-white/30">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
