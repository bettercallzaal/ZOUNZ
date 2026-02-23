# ZOUNZ - Farcaster Music Mini App 🎵

AI-generated music discovery, creation, minting, and trading all in one Farcaster Mini App.

**Status**: 40% Complete | Ready to Build | Phase 1: Non-Farcaster SDK Development

---

## Quick Links

- **[Full Implementation Roadmap](ZOUNZ_IMPLEMENTATION_ROADMAP.md)** - Comprehensive 5-phase plan with technical details
- **Live Repository**: https://github.com/bettercallzaal/ZOUNZ
- **Features**: Discover 🎵 | Create 🎧 | Mint 💎 | Trade 📈

---

## What is ZOUNZ?

ZOUNZ is a Farcaster Mini App that brings music creation, discovery, and trading on-chain. Users can:

1. **Discover** - Browse trending Audius tracks and underground gems
2. **Create** - Generate AI music using natural language prompts
3. **Mint** - Turn tracks into NFTs on Base via Zora Protocol
4. **Trade** - Speculate on music trends via Solana Attention Markets

---

## 📊 Implementation Status (Feb 23, 2026)

### Overall: ~40% Complete ✅ READY TO BUILD

| Component | Status | Completion | Priority |
|-----------|--------|-----------|----------|
| **Discover.tsx** | ✅ Functional | 85% | Phase 1 |
| **Create.tsx** | ✅ Functional | 90% | Phase 2 |
| **Mint.tsx** | ⚠️ Skeleton | 60% | Phase 3 |
| **Trade.tsx** | ❌ Mock data | 20% | Phase 4 |
| **useAudius.ts** | ⚠️ Needs verification | 70% | Phase 1 |
| **useAudioPlayer.ts** | ✅ Functional | 95% | - |
| **WalletProvider** | ❌ Stubbed | 30% | Phase 1 |
| **FarcasterProvider** | ⏸️ Deferred | 40% | Phase 5 |
| **/api/discover** | ⚠️ Partial | 60% | Phase 1 |
| **/api/generate** | ❌ Missing | 40% | Phase 2 |
| **/api/mint** | ⚠️ Skeleton | 50% | Phase 3 |
| **/api/upload** | ⚠️ Partial | 60% | Phase 2 |
| **/api/frame** | ⏸️ Deferred | 20% | Phase 5 |

---

## 🎯 What's Working

✓ App structure & routing (4 tabs + mini player)  
✓ Context/state management (AppContext for mintQueue, player state)  
✓ Audio player HTML5 integration  
✓ Discover UI with feed switching (underground/trending/search)  
✓ Create UI with prompt input and generation display  
✓ Mint UI showing queued tracks  
✓ Trade UI layout (with mock data)  
✓ Server route handlers skeleton (Express + CORS)  
✓ TypeScript types defined  

---

## 🛠️ What Needs Work (Priority Order)

### Phase 1 - FOUNDATION (Week 1)
- [ ] Verify Audius API integration (/api/discover endpoints)
- [ ] Set up WalletProvider (wagmi + @rainbow-me/rainbowkit)
- [ ] Test audio playback with real tracks

### Phase 2 - AI GENERATION (Week 2)
- [ ] Get HuggingFace API key (`HF_TOKEN`)
- [ ] Implement /api/generate with HuggingFace MusicGen
- [ ] Set up Pinata IPFS for audio storage

### Phase 3 - NFT MINTING (Week 3)
- [ ] Get Pinata API key (`PINATA_JWT`)
- [ ] Implement /api/mint with Zora SDK
- [ ] Test on Base testnet

### Phase 4 - SOLANA TRADING (Week 4)
- [ ] Replace MOCK_MARKETS with live market data
- [ ] Integrate Solana wallet
- [ ] Implement buy/sell logic

### Phase 5 - FARCASTER (Week 5+)
- [ ] Farcaster SDK integration
- [ ] Frame generation for sharing
- [ ] Mini App deployment

---

## 🔑 Required API Keys & Setup

Before you start building, gather these:

### 1. HF_TOKEN (HuggingFace) - For AI Music Generation
```
Purpose: AI music generation using MusicGen model
Status: NOT SET
Get: https://huggingface.co/settings/tokens
Free tier: Yes, available
```

### 2. PINATA_JWT (Pinata) - For IPFS Storage
```
Purpose: Upload audio files + NFT metadata to IPFS
Status: NOT SET
Get: https://app.pinata.cloud/
Free tier: Yes, available
```

### 3. AUDIUS_API_KEY (Optional) - For Audius Discovery
```
Purpose: Audius API (if required by new SDK version)
Status: OPTIONAL
Get: https://audius.org/developers
```

---

## 📦 Installation & Setup

### Install Dependencies
```bash
npm install --legacy-peer-deps
npm install @zoralabs/protocol-sdk viem wagmi @rainbow-me/rainbowkit @zoralabs/coins-sdk pinata
```

### Set Environment Variables
```bash
cp .env.example .env

# Add these to .env:
HF_TOKEN=your_huggingface_token
PINATA_JWT=your_pinata_jwt
APP_URL=http://localhost:5173
```

### Run Locally
```bash
# Terminal 1: Frontend (Vite)
npm run dev

# Terminal 2: Backend (Express)
npm run server

# Open http://localhost:5173
```

---

## 📁 Project Structure

```
ZOUNZ/
├── src/
│   ├── views/
│   │   ├── Discover.tsx      (85% - Audius integration)
│   │   ├── Create.tsx        (90% - AI generation)
│   │   ├── Mint.tsx          (60% - Zora NFT minting)
│   │   └── Trade.tsx         (20% - Solana attention markets)
│   ├── hooks/
│   │   ├── useAudius.ts      (70% - needs verification)
│   │   └── useAudioPlayer.ts (95% - fully functional)
│   ├── providers/
│   │   ├── WalletProvider.tsx    (30% - needs wagmi setup)
│   │   └── FarcasterProvider.tsx (40% - deferred)
│   ├── components/
│   │   └── MiniPlayer.tsx
│   ├── lib/
│   │   └── store.ts          (AppContext, state management)
│   ├── App.tsx               (Main app with tab navigation)
│   └── main.tsx
├── server/
│   ├── index.ts              (Express setup)
│   └── routes/
│       ├── discover.ts       (60% - Audius API)
│       ├── generate.ts       (40% - HuggingFace)
│       ├── mint.ts          (50% - Zora SDK)
│       ├── upload.ts        (60% - File upload)
│       └── frame.ts         (20% - Farcaster frames - DEFERRED)
└── package.json
```

---

## 🏗️ Architecture Overview

### Frontend (React + Vite)
- **4 View Tabs**: Discover, Create, Mint, Trade
- **Global State**: AppContext manages mintQueue, player state
- **Audio Player**: HTML5 `<audio>` element with playback controls
- **Wallet Integration**: wagmi for Base + Solana

### Backend (Express)
- **Port**: 3001
- **Routes**:
  - `/api/discover/trending` - Get trending Audius tracks
  - `/api/discover/underground` - Get underground tracks
  - `/api/discover/search?q=...` - Search tracks
  - `/api/generate` - AI music generation (HuggingFace)
  - `/api/mint` - NFT minting (Zora SDK)
  - `/api/upload` - Audio file upload (IPFS)
  - `/api/frame` - Farcaster frame generation (DEFERRED)

### Blockchain Integration
- **Base Chain**: Zora Protocol for NFT minting
- **Solana**: Attention Markets for trading
- **IPFS**: Pinata for audio + metadata storage

---

## 🔍 Key Components Explained

### Discover View (85% Complete)
- Uses 3 custom hooks: `useAudiusTrending()`, `useAudiusUnderground()`, `useAudiusSearch()`
- Switches between trending/underground/search feeds
- Genre filtering for trending tracks
- Play/pause integration with mini player
- Queues tracks for minting

**Next Steps**: Verify Audius API endpoints return correct data

### Create View (90% Complete)
- Text prompt input for music generation
- Calls `POST /api/generate` with prompt + duration
- Displays generated audio result
- Queues result for minting
- Clean loading/error states

**Next Steps**: Implement `/api/generate` with HuggingFace MusicGen

### Mint View (60% Complete)
- Shows `mintQueue` from context
- Displays queued tracks ready for minting
- Calls `POST /api/mint` for NFT creation
- UI workflow for minting process

**Next Steps**: Implement Zora SDK integration, test on Base testnet

### Trade View (20% Complete)
- Uses mock market data (hardcoded)
- `TODO: Wire up to @zoralabs/coins-sdk`
- Need to replace with real Solana Attention Markets data

**Status**: DEFERRED - Build Discover/Create/Mint first

---

## 🎵 Audio Player Hook

`useAudioPlayer` manages the audio playback state:

```typescript
const player = useAudioPlayer()

// State
player.isPlaying      // boolean
player.currentTrack   // Track | null
player.progress       // seconds (0-100)
player.duration       // total seconds

// Methods
player.play(track)    // Start playing a track
player.pause()        // Pause playback
player.stop()         // Stop and reset
player.seek(time)     // Jump to time (seconds)
```

---

## 🎵 Audius Integration Hook

`useAudius` provides music discovery:

```typescript
// Get trending tracks by genre
const trending = useAudiusTrending('lo-fi', 'week')
trending.tracks   // AudiusTrack[]
trending.loading  // boolean
trending.error    // Error | null

// Get underground/rising tracks
const underground = useAudiusUnderground()

// Search tracks
const search = useAudiusSearch()
search.search('query')  // Trigger search
search.results          // Track[]
```

---

## 💾 Environment Variables

Required in `.env`:
```
HF_TOKEN=sk-...                  # HuggingFace API token
PINATA_JWT=eyJ...               # Pinata JWT for IPFS
APP_URL=http://localhost:5173   # Frontend URL
```

---

## 🚀 Next Immediate Steps

1. **Get API Keys**
   - Sign up for HuggingFace (free)
   - Sign up for Pinata (free tier available)
   - Add to `.env` file

2. **Phase 1: Verify Audius Integration**
   - Test `/api/discover` endpoints
   - Verify useAudius hooks work with real data
   - Test Discover view end-to-end

3. **Phase 2: Implement AI Generation**
   - Research MusicGen model
   - Call HuggingFace Inference API
   - Store audio on IPFS via Pinata
   - Return URL to frontend

4. **Phase 3: Implement NFT Minting**
   - Install @zoralabs/protocol-sdk
   - Implement Zora minting logic
   - Test on Base testnet

5. **Phase 4: Implement Trading**
   - Research Zora Coins/Attention Markets
   - Replace mock data with live feeds
   - Integrate Solana wallet

6. **Phase 5: Farcaster Integration**
   - Set up Farcaster SDK
   - Build frame generation
   - Deploy as Mini App

---

## 📚 Documentation

- **Implementation Roadmap**: [ZOUNZ_IMPLEMENTATION_ROADMAP.md](ZOUNZ_IMPLEMENTATION_ROADMAP.md) - Full 5-phase breakdown with technical decisions
- **Research Findings**: [RESEARCH_FINDINGS.md](RESEARCH_FINDINGS.md) - Original research on integrations

---

## 🎯 Success Criteria

### Phase 1 (Week 1) ✅
- [ ] Can browse Audius tracks (trending/underground/search)
- [ ] Genre filtering works
- [ ] Audio playback works with real tracks
- [ ] Wallet connection works

### Phase 2 (Week 2) ✅
- [ ] Can generate AI music from prompts
- [ ] Generated audio plays in UI
- [ ] Audio files stored on IPFS

### Phase 3 (Week 3) ✅
- [ ] Can mint NFTs on Base testnet
- [ ] NFT metadata visible on explorer
- [ ] Full workflow tested (Discover → Create → Mint)

### Phase 4 (Week 4) ✅
- [ ] Real market data displays
- [ ] Can buy/sell positions
- [ ] Solana wallet integration works

### Phase 5+ (Week 5+) ✅
- [ ] App works as Farcaster Mini App
- [ ] Frames generate correctly
- [ ] Can share tracks on Farcaster

---

## 🤝 Contributing

This is an active development project. To contribute:

1. Create a feature branch from `main`
2. Build incrementally (follow the 5-phase plan)
3. Test thoroughly (especially blockchain interactions)
4. Submit PR with detailed description

---

## 📝 License

MIT

---

## 🔗 Links

- **GitHub**: https://github.com/bettercallzaal/ZOUNZ
- **Farcaster**: https://warpcast.com/zaal
- **X/Twitter**: https://twitter.com/zaaltech
- **Website**: https://zaal.xyz

---

**Last Updated**: February 23, 2026  
**Current Phase**: Non-Farcaster SDK Development (Phase 1)  
**Status**: Ready to Build 🚀
