import './OverlayPreview.css'

interface OverlayPreviewProps {
  imageUrl: string
  displayName: string
  photoDataUrl: string
  /** When true, dims the card (e.g. premium locked). */
  dimmed?: boolean
}

export function OverlayPreview({
  imageUrl,
  displayName,
  photoDataUrl,
  dimmed,
}: OverlayPreviewProps) {
  const initial = displayName.trim().charAt(0).toUpperCase() || '?'

  return (
    <div className={`overlay-preview${dimmed ? ' overlay-preview--dimmed' : ''}`}>
      <div
        className="overlay-preview__bg"
        style={{ backgroundImage: `url(${imageUrl})` }}
        role="img"
        aria-label=""
      />
      <div className="overlay-preview__shade" aria-hidden />
      <div className="overlay-preview__content">
        <div className="overlay-preview__avatar-wrap">
          {photoDataUrl ? (
            <img
              src={photoDataUrl}
              alt=""
              className="overlay-preview__avatar"
              decoding="async"
            />
          ) : (
            <div className="overlay-preview__avatar overlay-preview__avatar--placeholder">
              {initial}
            </div>
          )}
        </div>
        <p className="overlay-preview__name">{displayName.trim() || 'Your name'}</p>
      </div>
    </div>
  )
}
