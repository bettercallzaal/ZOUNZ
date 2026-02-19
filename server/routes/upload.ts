import { Router } from 'express'

const router = Router()

// Upload audio + metadata to IPFS via Pinata
router.post('/', async (req, res) => {
  try {
    const { title, artist, audioUrl, artworkUrl, genre } = req.body

    const pinataJwt = process.env.PINATA_JWT
    if (!pinataJwt) {
      // Demo mode — return mock IPFS hash
      res.json({
        metadataUri: `ipfs://QmDemo${Date.now()}`,
        audioHash: `QmAudio${Date.now()}`,
        mock: true,
      })
      return
    }

    // Build NFT metadata (OpenSea standard)
    const metadata = {
      name: title,
      description: `${artist} - ${title}`,
      image: artworkUrl || '',
      animation_url: audioUrl,
      attributes: [
        { trait_type: 'Artist', value: artist },
        ...(genre ? [{ trait_type: 'Genre', value: genre }] : []),
        { trait_type: 'Platform', value: 'ZAOUNZ' },
        { trait_type: 'Created', value: new Date().toISOString().split('T')[0] },
      ],
    }

    // Upload metadata JSON to Pinata
    const pinataRes = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${pinataJwt}`,
      },
      body: JSON.stringify({
        pinataContent: metadata,
        pinataMetadata: { name: `zaounz-${title}-metadata` },
      }),
    })

    if (!pinataRes.ok) {
      throw new Error(`Pinata upload failed: ${pinataRes.status}`)
    }

    const pinataData = await pinataRes.json() as { IpfsHash: string }

    res.json({
      metadataUri: `ipfs://${pinataData.IpfsHash}`,
      audioHash: '', // Would upload audio separately for production
    })
  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ error: 'Upload failed' })
  }
})

export default router
