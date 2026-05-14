import jwt from 'jsonwebtoken'

const secret = () => {
  const s = process.env.JWT_SECRET
  if (!s) throw new Error('JWT_SECRET is required')
  return s
}

export function signUserToken(userId) {
  return jwt.sign({ sub: userId }, secret(), { expiresIn: '30d' })
}

export function verifyUserToken(token) {
  const payload = jwt.verify(token, secret())
  if (!payload || typeof payload !== 'object' || !payload.sub) return null
  return String(payload.sub)
}
