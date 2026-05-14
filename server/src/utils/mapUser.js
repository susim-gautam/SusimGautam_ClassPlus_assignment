export function mapUser(u) {
  return {
    authMethod: u.authMethod,
    accountEmail: u.email || undefined,
    displayName: u.displayName || '',
    photoDataUrl: u.photoDataUrl || '',
    premiumUnlocked: Boolean(u.premiumUnlocked),
    profileConfigured: Boolean(u.profileConfigured),
  }
}
