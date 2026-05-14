function loadImage(src: string, crossOrigin = true): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    if (crossOrigin) img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

export async function mergeGreetingImage(
  backgroundUrl: string,
  displayName: string,
  avatarDataUrl: string
): Promise<Blob> {
  const bg = await loadImage(backgroundUrl, true)
  const avatar = await loadImage(avatarDataUrl, false)

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')

  const w = bg.naturalWidth
  const h = bg.naturalHeight
  canvas.width = w
  canvas.height = h

  ctx.drawImage(bg, 0, 0, w, h)

  const avSize = Math.min(w, h) * 0.2
  const cx = w / 2
  const avatarCenterY = h * 0.68

  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, avatarCenterY, avSize / 2, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(avatar, cx - avSize / 2, avatarCenterY - avSize / 2, avSize, avSize)
  ctx.restore()

  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = Math.max(3, avSize * 0.04)
  ctx.beginPath()
  ctx.arc(cx, avatarCenterY, avSize / 2, 0, Math.PI * 2)
  ctx.stroke()

  const fontSize = Math.max(22, Math.floor(w * 0.048))
  ctx.font = `700 ${fontSize}px system-ui, Segoe UI, Roboto, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const textY = avatarCenterY + avSize * 0.55
  ctx.lineJoin = 'round'
  ctx.miterLimit = 2
  ctx.strokeStyle = 'rgba(0,0,0,0.55)'
  ctx.lineWidth = Math.max(4, fontSize * 0.12)
  ctx.strokeText(displayName, cx, textY)
  ctx.fillStyle = '#ffffff'
  ctx.fillText(displayName, cx, textY)

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/png', 0.95)
  )
  if (!blob) throw new Error('Could not export image')
  return blob
}
