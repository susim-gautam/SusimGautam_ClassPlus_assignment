import { api } from './client'
import type { AppSession } from '../types'

export async function fetchMe(): Promise<AppSession> {
  const out = await api<{ user: AppSession }>('/api/me', { method: 'GET' })
  return out.user
}

export async function updateProfile(displayName: string, photoDataUrl: string) {
  const out = await api<{ user: AppSession }>('/api/me/profile', {
    method: 'PATCH',
    json: { displayName, photoDataUrl },
  })
  return out.user
}

export async function updatePremium(premiumUnlocked: boolean) {
  const out = await api<{ user: AppSession }>('/api/me/premium', {
    method: 'PATCH',
    json: { premiumUnlocked },
  })
  return out.user
}
