import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes.js'
import meRoutes from './routes/meRoutes.js'
import templateRoutes from './routes/templateRoutes.js'

const PORT = Number(process.env.PORT) || 5000
const MONGO_URI = process.env.MONGO_URI

if (!MONGO_URI) {
  console.error('Missing MONGO_URI in environment')
  process.exit(1)
}

const app = express()
app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '4mb' }))

app.get('/api/health', (_req, res) => {
  res.json({ ok: true })
})

app.use('/api/auth', authRoutes)
app.use('/api/me', meRoutes)
app.use('/api/templates', templateRoutes)

async function main() {
  await mongoose.connect(MONGO_URI)
  app.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT}`)
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
