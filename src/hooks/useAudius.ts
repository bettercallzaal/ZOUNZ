import { useState, useEffect, useCallback } from 'react'

const AUDIUS_API = 'https://discoveryprovider.audius.co/v1'
const APP_NAME = 'ZAOUNZ'

export interface AudiusTrack {
  id: string
  title: string
  user: {
    name: string
    handle: string
    profile_picture?: { '150x150'?: string; '480x480'?: string }
  }
  artwork?: { '150x150'?: string; '480x480'?: string }
  play_count: number
  favorite_count: number
  repost_count: number
  duration: number
  genre: string
  mood: string | null
  tags: string | null
  release_date: string | null
  permalink: string
}

async function audiusFetch(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${AUDIUS_API}${path}`)
  url.searchParams.set('app_name', APP_NAME)
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v)
  }
  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Audius API error: ${res.status}`)
  const json = await res.json()
  return json.data
}

export function useAudiusTrending(genre?: string, time: string = 'week') {
  const [tracks, setTracks] = useState<AudiusTrack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    const params: Record<string, string> = { time }
    if (genre && genre !== 'All') params.genre = genre

    audiusFetch('/tracks/trending', params)
      .then((data) => {
        setTracks(data ?? [])
        setError(null)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [genre, time])

  return { tracks, loading, error }
}

export function useAudiusUnderground() {
  const [tracks, setTracks] = useState<AudiusTrack[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    audiusFetch('/tracks/trending/underground')
      .then((data) => {
        setTracks(data ?? [])
        setError(null)
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { tracks, loading, error }
}

export function useAudiusSearch() {
  const [results, setResults] = useState<AudiusTrack[]>([])
  const [loading, setLoading] = useState(false)

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const data = await audiusFetch('/tracks/search', { query })
      setResults(data ?? [])
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  return { results, loading, search }
}

export function getStreamUrl(trackId: string) {
  return `${AUDIUS_API}/tracks/${trackId}/stream?app_name=${APP_NAME}`
}

export function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
