export type AuthMethod = 'google' | 'email' | 'guest'

export interface AppSession {
  authMethod: AuthMethod
  accountEmail?: string
  displayName: string
  photoDataUrl: string
  premiumUnlocked: boolean
  profileConfigured: boolean
}

export type TemplateCategory = 'Birthday' | 'Anniversary' | 'Festivals'

export interface GreetingTemplate {
  id: string
  title: string
  category: TemplateCategory
  imageUrl: string
  premium: boolean
}
