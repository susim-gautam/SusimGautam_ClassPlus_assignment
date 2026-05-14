import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { mapUser } from '../utils/mapUser.js'

const router = Router()

const MAX_PHOTO_CHARS = 2_500_000

router.get('/', requireAuth, (req, res) => {
  res.json({ user: req.userPayload })
})

router.patch('/profile', requireAuth, async (req, res) => {
  try {
    const displayName = String(req.body?.displayName ?? '').trim()
    const photoDataUrl = String(req.body?.photoDataUrl ?? '')
    if (!displayName) return res.status(400).json({ error: 'displayName required' })
    if (!photoDataUrl) return res.status(400).json({ error: 'photoDataUrl required' })
    if (photoDataUrl.length > MAX_PHOTO_CHARS) {
      return res.status(400).json({ error: 'Photo is too large' })
    }

    req.user.displayName = displayName
    req.user.photoDataUrl = photoDataUrl
    req.user.profileConfigured = true
    await req.user.save()
    res.json({ user: mapUser(req.user) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

router.patch('/premium', requireAuth, async (req, res) => {
  try {
    const premiumUnlocked = Boolean(req.body?.premiumUnlocked)
    req.user.premiumUnlocked = premiumUnlocked
    await req.user.save()
    res.json({ user: mapUser(req.user) })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

export default router
