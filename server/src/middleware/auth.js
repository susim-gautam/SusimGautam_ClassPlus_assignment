import { verifyUserToken } from '../utils/jwt.js'
import { User } from '../models/User.js'
import { mapUser } from '../utils/mapUser.js'

export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const m = /^Bearer\s+(.+)$/i.exec(header)
  if (!m) return res.status(401).json({ error: 'Missing token' })
  try {
    const userId = verifyUserToken(m[1])
    if (!userId) return res.status(401).json({ error: 'Invalid token' })
    const user = await User.findById(userId)
    if (!user) return res.status(401).json({ error: 'User not found' })
    req.user = user
    req.userPayload = mapUser(user)
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }
}
