import * as Api from '@/generated/api/client'

export const baseUrl = 'https://api.realworld.show/api'

export const client = Api.createClient({
  baseUrl,
})
