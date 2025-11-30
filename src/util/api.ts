import * as Api from '@/generated/api/client'

// export const baseUrl = 'https://api.realworld.io/api'
export const baseUrl = 'https://api.realworld.show/api'

export const client = (accessToken?: string) => Api.createClient({
  baseUrl,
  fetch: async (input, init) => {
    const authInit: RequestInit = {
      ...init,
      headers: {
        ...init?.headers,
        ...(accessToken ? { Authorization: `Token ${accessToken}` } : {}),
      },
    };
    return fetch(input, authInit);
  },
})
