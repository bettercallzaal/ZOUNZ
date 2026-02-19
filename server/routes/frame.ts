import { Router } from 'express'

const router = Router()

const APP_URL = process.env.APP_URL || 'https://zaounz.xyz'

// Farcaster Frame embed endpoint
// When someone shares a ZAOUNZ link, Farcaster renders this as a rich embed
router.get('/mint/:contractAddress/:tokenId', (req, res) => {
  const { contractAddress, tokenId } = req.params
  const title = (req.query.title as string) || 'Music NFT on ZAOUNZ'

  res.send(`<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="Collect this track on Base via Zora" />
  <meta property="og:image" content="${APP_URL}/api/og?title=${encodeURIComponent(title)}" />
  <meta property="fc:frame" content="vNext" />
  <meta property="fc:frame:image" content="${APP_URL}/api/og?title=${encodeURIComponent(title)}" />
  <meta property="fc:frame:button:1" content="Collect" />
  <meta property="fc:frame:button:1:action" content="link" />
  <meta property="fc:frame:button:1:target" content="${APP_URL}/mint/${contractAddress}/${tokenId}" />
  <meta property="fc:frame:button:2" content="Open ZAOUNZ" />
  <meta property="fc:frame:button:2:action" content="link" />
  <meta property="fc:frame:button:2:target" content="${APP_URL}" />
</head>
<body>
  <script>window.location.href = "${APP_URL}/mint/${contractAddress}/${tokenId}";</script>
</body>
</html>`)
})

// Simple OG image generator (returns SVG)
router.get('/og', (req, res) => {
  const title = (req.query.title as string) || 'ZAOUNZ'

  res.setHeader('Content-Type', 'image/svg+xml')
  res.send(`<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0F0F1A" />
      <stop offset="100%" style="stop-color:#1A1A2E" />
    </linearGradient>
    <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#8B5CF6" />
      <stop offset="100%" style="stop-color:#EC4899" />
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)" />
  <rect x="50" y="500" width="200" height="6" rx="3" fill="url(#accent)" />
  <text x="50" y="250" fill="white" font-family="system-ui, sans-serif" font-size="64" font-weight="bold">
    ${title.length > 30 ? title.slice(0, 30) + '...' : title}
  </text>
  <text x="50" y="310" fill="rgba(255,255,255,0.5)" font-family="system-ui, sans-serif" font-size="28">
    Music NFT on Base via Zora
  </text>
  <text x="50" y="540" fill="url(#accent)" font-family="system-ui, sans-serif" font-size="36" font-weight="bold">
    ZAOUNZ
  </text>
  <text x="50" y="580" fill="rgba(255,255,255,0.3)" font-family="system-ui, sans-serif" font-size="20">
    Create. Discover. Own.
  </text>
</svg>`)
})

export default router
