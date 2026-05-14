import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { OAuth2Client } from 'google-auth-library'
import { User } from '../models/User.js'
import { signUserToken } from '../utils/jwt.js'
import { mapUser } from '../utils/mapUser.js'

const router = Router()

const DEMO_GOOGLE_SUB = 'synthetic:demo-google'

function tokenResponse(user) {
  return { token: signUserToken(user._id.toString()), user: mapUser(user) }
}

router.post('/register', async (req, res) => {
  try {
    const email = String(req.body?.email ?? '').trim().toLowerCase()
    const password = String(req.body?.password ?? '')
    if (!email.includes('@')) return res.status(400).json({ error: 'Valid email required' })
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' })
    const exists = await User.findOne({ email })
    if (exists) return res.status(409).json({ error: 'Email already registered' })
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({
      authMethod: 'email',
      email,
      passwordHash,
      displayName: '',
      photoDataUrl: '',
      profileConfigured: false,
      premiumUnlocked: false,
    })
    res.json(tokenResponse(user))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const email = String(req.body?.email ?? '').trim().toLowerCase()
    const password = String(req.body?.password ?? '')
    const user = await User.findOne({ email, authMethod: 'email' })
    if (!user?.passwordHash) return res.status(401).json({ error: 'Invalid email or password' })
    const ok = await bcrypt.compare(password, user.passwordHash)
    if (!ok) return res.status(401).json({ error: 'Invalid email or password' })
    res.json(tokenResponse(user))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/guest', async (_req, res) => {
  try {
    const user = await User.create({
      authMethod: 'guest',
      displayName: '',
      photoDataUrl: '',
      profileConfigured: false,
      premiumUnlocked: false,
    })
    res.json(tokenResponse(user))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

router.post('/google', async (req, res) => {
  try {
    const idToken = String(req.body?.idToken ?? '')
    const clientId = process.env.GOOGLE_CLIENT_ID
    if (!idToken) return res.status(400).json({ error: 'idToken required' })
    if (!clientId) return res.status(503).json({ error: 'Google auth not configured on server' })

    const client = new OAuth2Client(clientId)
    const ticket = await client.verifyIdToken({ idToken, audience: clientId })
    const payload = ticket.getPayload()
    if (!payload?.sub) return res.status(401).json({ error: 'Invalid Google token' })

    const sub = payload.sub
    const email = payload.email ? String(payload.email).toLowerCase() : undefined
    const displayName =
      (payload.name && String(payload.name)) ||
      (email ? email.split('@')[0] : 'Google user')
    const picture = payload.picture ? String(payload.picture) : ''

    let user = await User.findOne({ googleSub: sub })
    if (!user) {
      user = await User.create({
        authMethod: 'google',
        googleSub: sub,
        email,
        displayName,
        photoDataUrl: picture,
        profileConfigured: false,
        premiumUnlocked: false,
      })
    } else {
      user.authMethod = 'google'
      if (email) user.email = email
      user.displayName = displayName
      user.photoDataUrl = picture
      await user.save()
    }
    res.json(tokenResponse(user))
  } catch (e) {
    console.error(e)
    res.status(401).json({ error: 'Google verification failed' })
  }
})

router.post('/google-demo', async (_req, res) => {
  try {
    const allow = String(process.env.ALLOW_GOOGLE_DEMO ?? 'true') === 'true'
    if (!allow) return res.status(403).json({ error: 'Demo Google sign-in disabled' })

    let user = await User.findOne({ googleSub: DEMO_GOOGLE_SUB })
    if (!user) {
      user = await User.create({
        authMethod: 'google',
        googleSub: DEMO_GOOGLE_SUB,
        email: 'demo.user@gmail.com',
        displayName: 'Alex Demo',
        photoDataUrl: 'https://lh3.googleusercontent.com/a/default-user=s192-c',
        profileConfigured: false,
        premiumUnlocked: false,
      })
    } else {
      user.displayName = 'Alex Demo'
      user.photoDataUrl = 'https://lh3.googleusercontent.com/a/default-user=s192-c'
      user.profileConfigured = false
      await user.save()
    }
    res.json(tokenResponse(user))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
