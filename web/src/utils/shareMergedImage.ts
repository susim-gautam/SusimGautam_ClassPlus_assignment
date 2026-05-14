import { mergeGreetingImage } from './mergeGreetingImage'

export async function shareMergedImage(
  backgroundUrl: string,
  displayName: string,
  avatarDataUrl: string,
  fileName = 'greeting.png'
): Promise<void> {
  const blob = await mergeGreetingImage(backgroundUrl, displayName, avatarDataUrl)
  const file = new File([blob], fileName, { type: 'image/png' })

  const nav = navigator as Navigator & {
    share?: (data: ShareData) => Promise<void>
    canShare?: (data: { files?: File[] }) => boolean
  }

  if (typeof nav.share === 'function') {
    const data: ShareData = {
      files: [file],
      title: 'My greeting',
      text: `A personalized greeting from ${displayName}`,
    }
    if (!nav.canShare || nav.canShare({ files: [file] })) {
      await nav.share(data)
      return
    }
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.rel = 'noopener'
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
