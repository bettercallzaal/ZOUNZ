import { useState } from 'react'

interface TrendMarket {
  id: string
  name: string
  category: string
  price: number
  change24h: number
  volume: number
  holders: number
}

// Mock data — will be replaced with live Zora Attention Markets data
const MOCK_MARKETS: TrendMarket[] = [
  { id: '1', name: 'Lo-fi Revival', category: 'Genre', price: 0.42, change24h: 12.5, volume: 15200, holders: 89 },
  { id: '2', name: 'AI Music Wave', category: 'Trend', price: 1.24, change24h: -3.2, volume: 8900, holders: 156 },
  { id: '3', name: 'Onchain Beats', category: 'Movement', price: 0.18, change24h: 45.0, volume: 3200, holders: 42 },
  { id: '4', name: 'Farcaster Music', category: 'Community', price: 0.73, change24h: 8.1, volume: 6700, holders: 201 },
  { id: '5', name: 'Bass House', category: 'Genre', price: 0.09, change24h: -15.3, volume: 1100, holders: 23 },
  { id: '6', name: 'Web3 Hip-Hop', category: 'Genre', price: 0.55, change24h: 22.7, volume: 4500, holders: 67 },
]

export default function Trade() {
  const [selectedMarket, setSelectedMarket] = useState<TrendMarket | null>(null)
  const [tradeAmount, setTradeAmount] = useState('')
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')

  const handleTrade = async () => {
    if (!selectedMarket || !tradeAmount) return
    // TODO: Wire up to @zoralabs/coins-sdk for Solana attention markets
    // 1. Connect Solana wallet
    // 2. Execute buy/sell via Zora Coins SDK
    alert(`${tradeType === 'buy' ? 'Buying' : 'Selling'} ${tradeAmount} SOL of "${selectedMarket.name}"`)
  }

  if (selectedMarket) {
    return (
      <div className="p-4 flex flex-col gap-4">
        {/* Back + Market Name */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedMarket(null)}
            className="w-8 h-8 rounded-lg bg-[var(--zaounz-card)] flex items-center justify-center text-white/50"
          >
            ←
          </button>
          <div>
            <h2 className="text-lg font-bold">{selectedMarket.name}</h2>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">
              {selectedMarket.category}
            </span>
          </div>
        </div>

        {/* Price Card */}
        <div className="bg-[var(--zaounz-card)] border border-[var(--zaounz-border)] rounded-xl p-4">
          <p className="text-2xl font-bold">{selectedMarket.price.toFixed(2)} SOL</p>
          <p className={`text-sm font-medium ${selectedMarket.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {selectedMarket.change24h >= 0 ? '+' : ''}{selectedMarket.change24h.toFixed(1)}% (24h)
          </p>
          <div className="flex gap-4 mt-3 text-xs text-white/40">
            <span>Vol: {selectedMarket.volume.toLocaleString()} SOL</span>
            <span>Holders: {selectedMarket.holders}</span>
          </div>
        </div>

        {/* Trade Panel */}
        <div className="bg-[var(--zaounz-card)] border border-[var(--zaounz-border)] rounded-xl p-4 space-y-3">
          {/* Buy/Sell Toggle */}
          <div className="flex rounded-lg bg-[var(--zaounz-dark)] p-0.5">
            <button
              onClick={() => setTradeType('buy')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                tradeType === 'buy' ? 'bg-green-500 text-white' : 'text-white/40'
              }`}
            >
              Buy
            </button>
            <button
              onClick={() => setTradeType('sell')}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                tradeType === 'sell' ? 'bg-red-500 text-white' : 'text-white/40'
              }`}
            >
              Sell
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs text-white/50 mb-1 block">Amount (SOL)</label>
            <input
              value={tradeAmount}
              onChange={(e) => setTradeAmount(e.target.value)}
              type="number"
              step="0.1"
              min="0"
              placeholder="0.00"
              className="w-full bg-[var(--zaounz-dark)] border border-[var(--zaounz-border)] rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Execute */}
          <button
            onClick={handleTrade}
            disabled={!tradeAmount}
            className={`w-full py-3 rounded-xl font-semibold text-sm text-white disabled:opacity-40 ${
              tradeType === 'buy'
                ? 'bg-green-500'
                : 'bg-red-500'
            }`}
          >
            {tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedMarket.name}
          </button>
        </div>

        <p className="text-[10px] text-white/20 text-center">
          Powered by Zora Attention Markets on Solana
        </p>
      </div>
    )
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold">Trade</h2>
        <p className="text-sm text-white/50 mt-1">
          Zora Attention Markets on Solana
        </p>
      </div>

      {/* Create Market CTA */}
      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold">
        + Create Market (1 SOL)
      </button>

      {/* Markets List */}
      <div className="space-y-2">
        {MOCK_MARKETS.map((market) => (
          <button
            key={market.id}
            onClick={() => setSelectedMarket(market)}
            className="w-full bg-[var(--zaounz-card)] border border-[var(--zaounz-border)] rounded-xl p-3 text-left hover:border-purple-500/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{market.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-400">
                    {market.category}
                  </span>
                  <span className="text-[10px] text-white/30">
                    {market.holders} holders
                  </span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{market.price.toFixed(2)} SOL</p>
                <p className={`text-xs font-medium ${market.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {market.change24h >= 0 ? '+' : ''}{market.change24h.toFixed(1)}%
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <p className="text-[10px] text-white/20 text-center">
        Trade tokens tied to music trends, genres, and movements
      </p>
    </div>
  )
}
