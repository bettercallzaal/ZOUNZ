import { Router } from 'express'

const router = Router()

// ACE-Step via HuggingFace Inference API
const HF_API_URL = 'https://api-inference.huggingface.co/models/ACE-Step/ACE-Step-v1-3.5B'

router.post('/', async (req, res) => {
  try {
    const { prompt, duration = 30 } = req.body

    if (!prompt) {
      res.status(400).json({ error: 'Prompt is required' })
      return
    }

    const hfToken = process.env.HF_TOKEN
    if (!hfToken) {
      // Return a mock response for development
      res.json({
        audioUrl: null,
        message: 'Set HF_TOKEN env var to enable AI music generation',
        mock: true,
      })
      return
    }

    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hfToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: duration * 50, // rough approximation
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('HuggingFace API error:', errorText)

      // Fallback: try Replicate with MusicGen
      res.status(502).json({
        error: 'AI generation service unavailable',
        details: errorText,
      })
      return
    }

    // HuggingFace returns raw audio bytes
    const audioBuffer = await response.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')
    const audioUrl = `data:audio/wav;base64,${base64Audio}`

    res.json({ audioUrl })
  } catch (error) {
    console.error('Generate error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
