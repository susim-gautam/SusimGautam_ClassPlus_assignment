import { api } from './client'
import type { GreetingTemplate } from '../types'

export async function fetchTemplates(): Promise<GreetingTemplate[]> {
  const out = await api<{ templates: GreetingTemplate[] }>('/api/templates', {
    method: 'GET',
  })
  return out.templates
}
