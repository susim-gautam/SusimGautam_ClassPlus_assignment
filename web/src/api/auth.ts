import { api, setToken } from './client'
import type { AppSession } from '../types'

export async function register(email: string, password: string) {
  const out = await api<{ token: string; user: AppSession }>('/api/auth/register', {
    method: 'POST',
    json: { email, password },
  })
  setToken(out.token)
  return out.user
}

export async function login(email: string, password: string) {
  const out = await api<{ token: string; user: AppSession }>('/api/auth/login', {
    method: 'POST',
    json: { email, password },
  })
  setToken(out.token)
  return out.user
}

export async function guest() {
  const out = await api<{ token: string; user: AppSession }>('/api/auth/guest', {
    method: 'POST',
  })
  setToken(out.token)
  return out.user
}

export async function google(idToken: string) {
  const out = await api<{ token: string; user: AppSession }>('/api/auth/google', {
    method: 'POST',
    json: { idToken },
  })
  setToken(out.token)
  return out.user
}

export async function googleDemo() {
  const out = await api<{ token: string; user: AppSession }>('/api/auth/google-demo', {
    method: 'POST',
  })
  setToken(out.token)
  return out.user
}
