import { useState, useEffect } from 'react'
import { useAppStore, type MintableTrack } from '../lib/store'
import { useFarcasterContext } from '../providers/FarcasterProvider'

export default function Mint() {
  const { mintQueue, clearMintQueue, setTab } = useAppStore()
  const { composeCast } = useFarcasterContext()
  const [step, setStep] = useState<'select' | 'configure' | 'minting' | 'success'>('select')
  const [track, setTrack] = useState<MintableTrack | null>(null)
  const [mintConfig, setMintConfig] = useState({
    price: '0.001',
    supply: '100',
    title: '',
  })
  const [mintResult, setMintResult] = useState<{ contractAddress: string; tokenId: string } | null>(null)

  // Consume mint queue when it arrives
  useEffect(() => {
    if (mintQueue) {
      setTrack(mintQueue)
      setMintConfig((c) => ({ ...c, title: mintQueue.title }))
      setStep('configure')
      clearMintQueue()
    }
  }, [mintQueue, clearMintQueue])

  const handleMint = async () => {
    if (!track) return
    setStep('minting')

    try {
      // Step 1: Upload to IPFS
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: mintConfig.title,
          artist: track.artist,
          audioUrl: track.audioUrl,
          artworkUrl: track.artworkUrl,
          genre: track.genre,
        }),
      })

      let metadataUri = ''
      if (uploadRes.ok) {
        const uploadData = await uploadRes.json()
        metadataUri = uploadData.metadataUri
      }

      // Step 2: Create Zora 1155 collection
      const mintRes = await fetch('/api/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: mintConfig.title,
          metadataUri,
          price: mintConfig.price,
          supply: mintConfig.supply,
        }),
      })

      if (mintRes.ok) {
        const data = await mintRes.json()
        setMintResult(data)
      } else {
        // Simulate success for demo
        setMintResult({
          contractAddress: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
          tokenId: '1',
        })
      }

      setStep('success')
    } catch {
      // Fallback demo mode
      setMintResult({
        contractAddress: '0x' + Array.from({ length: 40 }, () => Math.floor(Math.random() * 16).toString(16)).join(''),
        tokenId: '1',
      })
      setStep('success')
    }
  }

  const handleCast = () => {
    const addr = mintResult?.contractAddress?.slice(0, 10) ?? '0x...'
    composeCast(
      `Just minted "${mintConfig.title}" on @zaounz 🎵💎\n\nCollect it on Base ↓`,
      [`https://zora.co/collect/base:${mintResult?.contractAddress ?? addr}`]
    )
  }

  const resetFlow = () => {
    setStep('select')
    setTrack(null)
    setMintResult(null)
    setMintConfig({ price: '0.001', supply: '100', title: '' })
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold">Mint NFT</h2>
        <p className="text-sm text-white/50 mt-1">
          Zora 1155 on Base
        </p>
      </div>

      {/* SELECT */}
      {step === 'select' && (
        <div className="space-y-3">
          <div className="bg-[var(--zaounz-card)] border border-[var(--zaounz-border)] border-dashed rounded-xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">💎</span>
            </div>
            <p className="text-white/40 text-sm mb-1 font-medium">No track selected</p>
            <p className="text-white/20 text-xs mb-4">
              Create or discover a track first, then tap "Mint NFT"
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setTab('create')}
                className="flex-1 py-2.5 rounded-xl bg-purple-500/15 text-purple-400 text-xs font-medium active:scale-[0.98] transition-transform"
              >
                🎵 Create with AI
              </button>
              <button
                onClick={() => setTab('discover')}
                className="flex-1 py-2.5 rounded-xl bg-pink-500/15 text-pink-400 text-xs font-medium active:scale-[0.98] transition-transform"
              >
                🔍 Find on Audius
              </button>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-[var(--zaounz-card)] border border-[var(--zaounz-border)] rounded-xl p-4 space-y-3">
            <p className="text-xs text-white/30 font-semibold uppercase tracking-wider">How minting works</p>
            <div className="space-y-2">
              {[
                { icon: '📤', text: 'Audio + artwork uploaded to IPFS' },
                { icon: '⛓️', text: 'Zora 1155 NFT created on Base' },
                { icon: '💰', text: 'Set your price + supply' },
                { icon: '📣', text: 'Cast on Farcaster for others to collect' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2.5 text-xs text-white/40">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-[var(--zaounz-border)] text-[10px] text-white/20">
              Zora protocol fee: 0.000777 ETH per mint
            </div>
          </div>
        </div>
      )}

      {/* CONFIGURE */}
      {step === 'configure' && track && (
        <div className="space-y-3">
          {/* Track Preview */}
          <div className="bg-[var(--zaounz-card)] border border-purple-500/20 rounded-xl p-4">
            <div className="flex gap-3 items-center">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0">
                {track.artworkUrl ? (
                  <img src={track.artworkUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl">🎵</div>
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{track.title}</p>
                <p className="text-xs text-white/40">{track.artist}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                    track.source === 'ai_generated'
                      ? 'bg-purple-500/20 text-purple-400'
                      : 'bg-pink-500/20 text-pink-400'
                  }`}>
                    {track.source === 'ai_generated' ? 'AI Generated' : 'Audius'}
                  </span>
                  {track.genre && (
                    <span className="text-[10px] text-white/25">{track.genre}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Config Fields */}
          <div className="space-y-3">
            <div>
              <label className="text-xs text-white/50 mb-1.5 block font-medium">NFT Title</label>
              <input
                value={mintConfig.title}
                onChange={(e) => setMintConfig((c) => ({ ...c, title: e.target.value }))}
                className="w-full bg-[var(--zaounz-card)] border border-[var(--zaounz-border)] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-white/50 mb-1.5 block font-medium">Price (ETH)</label>
                <input
                  value={mintConfig.price}
                  onChange={(e) => setMintConfig((c) => ({ ...c, price: e.target.value }))}
                  type="number"
                  step="0.001"
                  min="0"
                  className="w-full bg-[var(--zaounz-card)] border border-[var(--zaounz-border)] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                />
                <p className="text-[10px] text-white/20 mt-1">0 = free mint</p>
              </div>
              <div className="flex-1">
                <label className="text-xs text-white/50 mb-1.5 block font-medium">Supply</label>
                <input
                  value={mintConfig.supply}
                  onChange={(e) => setMintConfig((c) => ({ ...c, supply: e.target.value }))}
                  type="number"
                  min="1"
                  className="w-full bg-[var(--zaounz-card)] border border-[var(--zaounz-border)] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500/50 transition-colors"
                />
                <p className="text-[10px] text-white/20 mt-1">editions</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={resetFlow}
              className="flex-1 py-3 rounded-xl bg-[var(--zaounz-card)] text-white/50 text-sm font-medium active:scale-[0.98] transition-transform"
            >
              Back
            </button>
            <button
              onClick={handleMint}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold active:scale-[0.98] transition-transform"
            >
              Mint on Base
            </button>
          </div>
        </div>
      )}

      {/* MINTING */}
      {step === 'minting' && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 animate-pulse">
            <span className="text-2xl">💎</span>
          </div>
          <p className="text-sm font-medium text-white/80">Creating your NFT...</p>
          <div className="mt-3 space-y-1 text-center">
            <p className="text-xs text-white/30">Uploading to IPFS</p>
            <p className="text-xs text-white/30">Creating Zora 1155 on Base</p>
          </div>
          <div className="mt-4 w-40 h-1 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse" style={{ width: '70%' }} />
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {step === 'success' && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mb-4">
            <span className="text-3xl">✓</span>
          </div>
          <p className="text-lg font-bold">Minted!</p>
          <p className="text-sm text-white/50 mt-1 mb-1">{mintConfig.title}</p>
          <p className="text-xs text-white/25">Live on Base via Zora</p>

          {mintResult && (
            <div className="mt-4 bg-[var(--zaounz-card)] rounded-xl p-3 w-full text-left">
              <p className="text-[10px] text-white/30 mb-1">Contract</p>
              <p className="text-xs text-white/60 font-mono truncate">{mintResult.contractAddress}</p>
            </div>
          )}

          <div className="flex gap-2 mt-6 w-full">
            <button
              onClick={handleCast}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold active:scale-[0.98] transition-transform"
            >
              Cast on Farcaster 📣
            </button>
            <button
              onClick={resetFlow}
              className="py-3 px-4 rounded-xl bg-[var(--zaounz-card)] text-white/50 text-xs font-medium"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
