import { BASE_URL } from '@/env'

export const assetPath = (path: string): string => {
  if (path.startsWith('http') || path.startsWith('//')) {
    return path
  }
  const base = BASE_URL.replace(/\/$/, '')
  const cleanPath = path.replace(/^\//, '')
  return base + '/' + cleanPath
}
