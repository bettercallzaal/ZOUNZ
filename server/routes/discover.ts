import { Router } from 'express'

const router = Router()

const AUDIUS_API = 'https://discoveryprovider.audius.co/v1'
const APP_NAME = 'ZAOUNZ'

async function audiusFetch(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${AUDIUS_API}${path}`)
  url.searchParams.set('app_name', APP_NAME)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v)
  }
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Audius API error: ${res.status}`)
  return res.json()
}

// GET /api/discover/trending
router.get('/trending', async (req, res) => {
  try {
    const { genre, time = 'week' } = req.query as Record<string, string>
    const params: Record<string, string> = { time }
    if (genre && genre !== 'All') params.genre = genre

    const data = await audiusFetch('/tracks/trending', params)
    res.json(data)
  } catch (error) {
    console.error('Trending fetch error:', error)
    res.status(502).json({ error: 'Failed to fetch trending tracks' })
  }
})

// GET /api/discover/underground
router.get('/underground', async (_req, res) => {
  try {
    const data = await audiusFetch('/tracks/trending/underground')
    res.json(data)
  } catch (error) {
    console.error('Underground fetch error:', error)
    res.status(502).json({ error: 'Failed to fetch underground tracks' })
  }
})

// GET /api/discover/search?q=...
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query as Record<string, string>
    if (!q) {
      res.status(400).json({ error: 'Query parameter q is required' })
      return
    }

    const data = await audiusFetch('/tracks/search', { query: q })
    res.json(data)
  } catch (error) {
    console.error('Search error:', error)
    res.status(502).json({ error: 'Search failed' })
  }
})

export default router
