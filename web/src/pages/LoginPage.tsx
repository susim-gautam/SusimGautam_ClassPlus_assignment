import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { useApp } from '../context/AppProvider'
import { guest, google, googleDemo, login, register } from '../api/auth'
import { ApiError } from '../api/client'
import './LoginPage.css'

const hasGoogleClientId = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID)

export function LoginPage() {
  const { session, refreshSession } = useApp()
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!session) return
    navigate(session.profileConfigured ? '/home' : '/profile', { replace: true })
  }, [session, navigate])

  const onGoogleSuccess = async (cred: CredentialResponse) => {
    const idToken = cred.credential
    if (!idToken) return
    setError(null)
    setBusy(true)
    try {
      const user = await google(idToken)
      await refreshSession()
      navigate(user.profileConfigured ? '/home' : '/profile', { replace: true })
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Google sign-in failed')
    } finally {
      setBusy(false)
    }
  }

  const onGoogleDemo = async () => {
    setError(null)
    setBusy(true)
    try {
      const user = await googleDemo()
      await refreshSession()
      navigate(user.profileConfigured ? '/home' : '/profile', { replace: true })
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Demo sign-in failed')
    } finally {
      setBusy(false)
    }
  }

  const onRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get('reg_email') ?? '').trim()
    const password = String(fd.get('reg_password') ?? '')
    const confirm = String(fd.get('reg_confirm') ?? '')
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setError(null)
    setBusy(true)
    try {
      const user = await register(email, password)
      await refreshSession()
      navigate(user.profileConfigured ? '/home' : '/profile', { replace: true })
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not create account')
    } finally {
      setBusy(false)
    }
  }

  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const email = String(fd.get('email') ?? '').trim()
    const password = String(fd.get('password') ?? '')
    setError(null)
    setBusy(true)
    try {
      const user = await login(email, password)
      await refreshSession()
      navigate(user.profileConfigured ? '/home' : '/profile', { replace: true })
    } catch {
      setError('Invalid email or password')
    } finally {
      setBusy(false)
    }
  }

  const onGuest = async () => {
    setError(null)
    setBusy(true)
    try {
      const user = await guest()
      await refreshSession()
      navigate(user.profileConfigured ? '/home' : '/profile', { replace: true })
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Guest sign-in failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page page--login">
      <div className="card card--login">
        <h1 className="page__title">Custom Greetings</h1>
        <p className="page__lead">
          MERN stack: sign in with Google, email (register or sign in), or guest. Your profile is
          stored in MongoDB via the API.
        </p>

        {error && <p className="form-error login-error">{error}</p>}

        <div className="login-actions">
          {hasGoogleClientId ? (
            <div className="login-google">
              <GoogleLogin
                onSuccess={(c) => void onGoogleSuccess(c)}
                onError={() => setError('Google sign-in failed. Try guest or email.')}
                useOneTap={false}
                theme="filled_blue"
                size="large"
                text="signin_with"
                shape="rectangular"
                width={320}
              />
            </div>
          ) : (
            <button
              type="button"
              className="btn btn--google"
              onClick={() => void onGoogleDemo()}
              disabled={busy}
            >
              Continue with Google (demo)
            </button>
          )}

          <form className="login-email" onSubmit={(e) => void onLogin(e)}>
            <p className="login-section-title">Sign in with email</p>
            <label className="field">
              <span className="field__label">Email</span>
              <input
                className="field__input"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </label>
            <label className="field">
              <span className="field__label">Password</span>
              <input
                className="field__input"
                name="password"
                type="password"
                autoComplete="current-password"
                minLength={6}
                required
              />
            </label>
            <button type="submit" className="btn btn--primary btn--block" disabled={busy}>
              Sign in
            </button>
          </form>

          <form className="login-email" onSubmit={(e) => void onRegister(e)}>
            <p className="login-section-title">Create account</p>
            <label className="field">
              <span className="field__label">Email</span>
              <input
                className="field__input"
                name="reg_email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
              />
            </label>
            <label className="field">
              <span className="field__label">Password</span>
              <input
                className="field__input"
                name="reg_password"
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </label>
            <label className="field">
              <span className="field__label">Confirm password</span>
              <input
                className="field__input"
                name="reg_confirm"
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
              />
            </label>
            <button type="submit" className="btn btn--secondary btn--block" disabled={busy}>
              Register
            </button>
          </form>

          <button
            type="button"
            className="btn btn--ghost btn--block"
            onClick={() => void onGuest()}
            disabled={busy}
          >
            Continue as guest
          </button>
        </div>
      </div>
    </div>
  )
}
