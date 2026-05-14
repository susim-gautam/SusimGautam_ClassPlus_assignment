import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import { imageSrcToDataUrl } from '../utils/imageSrcToDataUrl'
import { ApiError } from '../api/client'
import './ProfilePage.css'

export function ProfilePage() {
  const { session, isProfileComplete, saveProfile, logout } = useApp()
  const navigate = useNavigate()
  const [name, setName] = useState(session?.displayName ?? '')
  const [photo, setPhoto] = useState(session?.photoDataUrl ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!session) {
      navigate('/login', { replace: true })
      return
    }
    if (isProfileComplete) {
      navigate('/home', { replace: true })
    }
  }, [session, isProfileComplete, navigate])

  useEffect(() => {
    if (!session) return
    setName(session.displayName ?? '')
    setPhoto(session.photoDataUrl ?? '')
  }, [session])

  if (!session) return null

  const onFile = (f: File | null) => {
    setError(null)
    if (!f) return
    if (!f.type.startsWith('image/')) {
      setError('Please choose an image file.')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') setPhoto(reader.result)
    }
    reader.readAsDataURL(f)
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    const trimmed = name.trim()
    if (!trimmed) {
      setError('Please enter your name.')
      return
    }
    if (!photo) {
      setError('Please add a profile photo.')
      return
    }
    setBusy(true)
    try {
      const dataUrl = photo.startsWith('data:') ? photo : await imageSrcToDataUrl(photo)
      try {
        await saveProfile(trimmed, dataUrl)
        navigate('/home', { replace: true })
      } catch (err) {
        setError(err instanceof ApiError ? err.message : 'Could not save profile')
      }
    } catch {
      setError(
        'Could not load that photo for export (CORS). Please upload an image from your device.'
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="page page--profile">
      <div className="card">
        <h1 className="page__title">Your profile</h1>
        <p className="page__lead">
          This name and photo appear on every template preview and on the shared
          image.
        </p>

        {session.authMethod === 'email' && session.accountEmail && (
          <p className="profile-email">Signed in as {session.accountEmail}</p>
        )}
        {session.authMethod === 'guest' && (
          <p className="profile-email">Guest account (saved on the server)</p>
        )}

        <form className="profile-form" onSubmit={(e) => void onSubmit(e)}>
          <label className="field">
            <span className="field__label">Display name</span>
            <input
              className="field__input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
            />
          </label>

          <div className="field">
            <span className="field__label">Profile photo</span>
            <div className="profile-photo-row">
              <div className="profile-photo-preview">
                {photo ? (
                  <img src={photo} alt="Profile preview" />
                ) : (
                  <span>No photo yet</span>
                )}
              </div>
              <label className="btn btn--secondary">
                Upload photo
                <input
                  type="file"
                  accept="image/*"
                  className="visually-hidden"
                  onChange={(e) => onFile(e.target.files?.[0] ?? null)}
                />
              </label>
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="btn btn--primary btn--block" disabled={busy}>
            {busy ? 'Saving…' : 'Save and continue'}
          </button>
        </form>

        <button type="button" className="link-btn" onClick={() => logout()}>
          Sign out
        </button>
      </div>
    </div>
  )
}
