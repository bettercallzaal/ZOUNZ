import { useState, useRef, useCallback } from 'react'

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  const play = useCallback((url: string, trackId: string) => {
    if (audioRef.current) {
      audioRef.current.pause()
    }

    const audio = new Audio(url)
    audioRef.current = audio

    audio.addEventListener('timeupdate', () => {
      setProgress(audio.currentTime)
      setDuration(audio.duration || 0)
    })
    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      setCurrentTrackId(null)
    })

    audio.play()
    setIsPlaying(true)
    setCurrentTrackId(trackId)
  }, [])

  const pause = useCallback(() => {
    audioRef.current?.pause()
    setIsPlaying(false)
  }, [])

  const toggle = useCallback((url: string, trackId: string) => {
    if (currentTrackId === trackId && isPlaying) {
      pause()
    } else {
      play(url, trackId)
    }
  }, [currentTrackId, isPlaying, pause, play])

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
    setIsPlaying(false)
    setCurrentTrackId(null)
    setProgress(0)
  }, [])

  return { isPlaying, currentTrackId, progress, duration, play, pause, toggle, stop }
}
