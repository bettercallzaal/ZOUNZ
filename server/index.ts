import express from 'express'
import cors from 'cors'
import generateRouter from './routes/generate.js'
import discoverRouter from './routes/discover.js'
import uploadRouter from './routes/upload.js'
import mintRouter from './routes/mint.js'
import frameRouter from './routes/frame.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '50mb' }))

// Routes
app.use('/api/generate', generateRouter)
app.use('/api/discover', discoverRouter)
app.use('/api/upload', uploadRouter)
app.use('/api/mint', mintRouter)
app.use('/api/frame', frameRouter)
app.use('/api/og', frameRouter)

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'zaounz-api' })
})

app.listen(PORT, () => {
  console.log(`ZAOUNZ API running on port ${PORT}`)
})
