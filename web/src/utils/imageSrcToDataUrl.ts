function loadImageForExport(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    if (!src.startsWith('data:')) img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`))
    img.src = src
  })
}

export async function imageSrcToDataUrl(src: string, maxEdge = 512): Promise<string> {
  if (src.startsWith('data:')) return src
  const img = await loadImageForExport(src)
  const w = img.naturalWidth
  const h = img.naturalHeight
  const scale = Math.min(1, maxEdge / Math.max(w, h))
  const tw = Math.max(1, Math.round(w * scale))
  const th = Math.max(1, Math.round(h * scale))
  const canvas = document.createElement('canvas')
  canvas.width = tw
  canvas.height = th
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not supported')
  ctx.drawImage(img, 0, 0, tw, th)
  return canvas.toDataURL('image/jpeg', 0.92)
}
