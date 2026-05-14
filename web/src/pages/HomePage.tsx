import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppProvider'
import { fetchTemplates } from '../api/templates'
import { OverlayPreview } from '../components/OverlayPreview'
import { PremiumModal } from '../components/PremiumModal'
import { shareMergedImage } from '../utils/shareMergedImage'
import type { GreetingTemplate, TemplateCategory } from '../types'
import './HomePage.css'

const CATEGORIES: TemplateCategory[] = ['Birthday', 'Anniversary', 'Festivals']

export function HomePage() {
  const { session, isProfileComplete, logout, setPremiumUnlocked } = useApp()
  const navigate = useNavigate()
  const [templates, setTemplates] = useState<GreetingTemplate[]>([])
  const [templatesError, setTemplatesError] = useState<string | null>(null)
  const [category, setCategory] = useState<TemplateCategory>('Birthday')
  const [selected, setSelected] = useState<GreetingTemplate | null>(null)
  const [premiumOpen, setPremiumOpen] = useState(false)
  const [pendingPremium, setPendingPremium] = useState<GreetingTemplate | null>(null)
  const [shareState, setShareState] = useState<'idle' | 'working' | 'error'>('idle')

  useEffect(() => {
    if (!session) {
      navigate('/login', { replace: true })
      return
    }
    if (!isProfileComplete) {
      navigate('/profile', { replace: true })
    }
  }, [session, isProfileComplete, navigate])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const list = await fetchTemplates()
        if (!cancelled) {
          setTemplates(list)
          setTemplatesError(null)
        }
      } catch {
        if (!cancelled) {
          setTemplates([])
          setTemplatesError('Could not load templates. Is the API running?')
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const list = useMemo(
    () => templates.filter((t) => t.category === category),
    [templates, category]
  )

  useEffect(() => {
    setSelected((prev) => {
      if (prev && list.some((t) => t.id === prev.id)) return prev
      const unlocked = session?.premiumUnlocked
      return (
        list.find((t) => !t.premium) ??
        (unlocked ? list[0] : null) ??
        list[0] ??
        null
      )
    })
  }, [list, session?.premiumUnlocked])

  if (!session || !isProfileComplete) return null

  const name = session.displayName
  const photo = session.photoDataUrl

  const onPick = (t: GreetingTemplate) => {
    if (t.premium && !session.premiumUnlocked) {
      setPendingPremium(t)
      setPremiumOpen(true)
      return
    }
    setSelected(t)
  }

  const onSubscribeDemo = async () => {
    await setPremiumUnlocked(true)
    setPremiumOpen(false)
    if (pendingPremium) {
      setSelected(pendingPremium)
      setPendingPremium(null)
    }
  }

  const onShare = async () => {
    if (!selected) return
    if (selected.premium && !session.premiumUnlocked) {
      setPendingPremium(selected)
      setPremiumOpen(true)
      return
    }
    setShareState('working')
    try {
      await shareMergedImage(selected.imageUrl, name, photo, `greeting-${selected.id}.png`)
      setShareState('idle')
    } catch (err: unknown) {
      const aborted =
        err &&
        typeof err === 'object' &&
        'name' in err &&
        (err as { name?: string }).name === 'AbortError'
      if (aborted) {
        setShareState('idle')
        return
      }
      setShareState('error')
    }
  }

  return (
    <div className="page page--home">
      <header className="home-header">
        <div>
          <h1 className="home-header__title">Templates</h1>
          <p className="home-header__sub">
            Live previews include your name and photo. Premium templates show a badge. Data comes
            from the Express API.
          </p>
        </div>
        <div className="home-header__actions">
          {session.premiumUnlocked ? (
            <span className="pill pill--premium">Premium unlocked (demo)</span>
          ) : (
            <span className="pill">Free plan</span>
          )}
          <button type="button" className="btn btn--ghost btn--small" onClick={() => logout()}>
            Sign out
          </button>
        </div>
      </header>

      {templatesError && (
        <p className="form-error home-banner-error" role="alert">
          {templatesError}
        </p>
      )}

      <nav className="category-tabs" aria-label="Template categories">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={`category-tab${c === category ? ' is-active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </nav>

      <section className="home-grid-section" aria-labelledby="grid-heading">
        <h2 id="grid-heading" className="sr-only">
          Background templates
        </h2>
        <div className="template-grid">
          {list.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`template-card${selected?.id === t.id ? ' is-selected' : ''}`}
              onClick={() => onPick(t)}
            >
              <div className="template-card__media">
                <OverlayPreview
                  imageUrl={t.imageUrl}
                  displayName={name}
                  photoDataUrl={photo}
                  dimmed={t.premium && !session.premiumUnlocked}
                />
                <span className={`tier-badge${t.premium ? ' tier-badge--premium' : ''}`}>
                  {t.premium ? 'Premium' : 'Free'}
                </span>
              </div>
              <span className="template-card__title">{t.title}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="home-detail" aria-live="polite">
        <h2 className="home-detail__title">Selected template</h2>
        {selected ? (
          <>
            <div className="home-detail__preview">
              <OverlayPreview
                imageUrl={selected.imageUrl}
                displayName={name}
                photoDataUrl={photo}
                dimmed={selected.premium && !session.premiumUnlocked}
              />
            </div>
            <p className="home-detail__caption">
              {selected.title} · {selected.category}
              {selected.premium && !session.premiumUnlocked
                ? ' · Tap the template or subscribe to use this premium design.'
                : ''}
            </p>
            <div className="home-detail__toolbar">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => void onShare()}
                disabled={shareState === 'working' || (selected.premium && !session.premiumUnlocked)}
              >
                {shareState === 'working' ? 'Preparing…' : 'Share'}
              </button>
              <p className="share-hint">
                Share merges the background, avatar, and name into one image, then opens your
                device share sheet (WhatsApp, Instagram, email, and more). If sharing files is not
                supported, the image downloads instead.
              </p>
            </div>
            {shareState === 'error' && (
              <p className="form-error" role="alert">
                Sharing failed. Check your connection and try again.
              </p>
            )}
          </>
        ) : (
          <p>Pick a template from the grid.</p>
        )}
      </section>

      <PremiumModal
        open={premiumOpen}
        onClose={() => {
          setPremiumOpen(false)
          setPendingPremium(null)
        }}
        onSubscribeDemo={() => void onSubscribeDemo()}
      />
    </div>
  )
}
