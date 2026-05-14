import './PremiumModal.css'

interface PremiumModalProps {
  open: boolean
  onClose: () => void
  onSubscribeDemo: () => void
}

export function PremiumModal({ open, onClose, onSubscribeDemo }: PremiumModalProps) {
  if (!open) return null

  return (
    <div className="premium-modal-root" role="presentation" onMouseDown={onClose}>
      <div
        className="premium-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="premium-modal-title"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <button type="button" className="premium-modal__close" onClick={onClose}>
          Close
        </button>
        <div className="premium-modal__badge">Premium</div>
        <h2 id="premium-modal-title" className="premium-modal__title">
          Unlock premium templates
        </h2>
        <p className="premium-modal__text">
          Subscribe to remove limits, access exclusive backgrounds, and export
          high-resolution greetings. This assignment uses a demo subscription
          (no real payment).
        </p>
        <ul className="premium-modal__list">
          <li>Exclusive premium artwork</li>
          <li>Full-resolution sharing</li>
          <li>Early access to new categories</li>
        </ul>
        <div className="premium-modal__actions">
          <button type="button" className="btn btn--ghost" onClick={onClose}>
            Not now
          </button>
          <button type="button" className="btn btn--primary" onClick={onSubscribeDemo}>
            Subscribe (demo)
          </button>
        </div>
      </div>
    </div>
  )
}
