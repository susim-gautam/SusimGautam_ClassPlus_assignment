const u = (seed, w = 800, h = 600) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`

export const TEMPLATES = [
  { id: 'b1', title: 'Balloons & Cake', category: 'Birthday', imageUrl: u('greet-bday-1'), premium: false },
  { id: 'b2', title: 'Confetti Burst', category: 'Birthday', imageUrl: u('greet-bday-2'), premium: true },
  { id: 'b3', title: 'Pastel Wishes', category: 'Birthday', imageUrl: u('greet-bday-3'), premium: false },
  { id: 'b4', title: 'Golden Sparkle', category: 'Birthday', imageUrl: u('greet-bday-4'), premium: true },
  { id: 'a1', title: 'Roses & Rings', category: 'Anniversary', imageUrl: u('greet-ann-1'), premium: false },
  { id: 'a2', title: 'Champagne Glow', category: 'Anniversary', imageUrl: u('greet-ann-2'), premium: true },
  { id: 'a3', title: 'Sunset Hearts', category: 'Anniversary', imageUrl: u('greet-ann-3'), premium: false },
  { id: 'f1', title: 'Lantern Night', category: 'Festivals', imageUrl: u('greet-fest-1'), premium: false },
  { id: 'f2', title: 'Aurora Lights', category: 'Festivals', imageUrl: u('greet-fest-2'), premium: true },
  { id: 'f3', title: 'Harvest Warmth', category: 'Festivals', imageUrl: u('greet-fest-3'), premium: false },
]
