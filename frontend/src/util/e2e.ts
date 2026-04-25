import type { Model } from '@/type'

export interface ConduitDebug {
  getToken(): string | null
  getAuthState():
    | 'authenticated'
    | 'unauthenticated'
    | 'unavailable'
    | 'loading'
  getCurrentUser(): {
    username: string
    email: string
    bio: string | null
    image: string | null
    token: string
  } | null
}

// E2E test need this
export const assignConduitDebug = (model: Model | null) => {
  if (typeof window !== 'undefined') {
    ;(window as any).__conduit_debug__ = {
      getToken: () =>
        model?.shared.token._tag === 'Some' ? model.shared.token.value : null,
      getAuthState: () => {
        if (!model) return 'loading'
        return model.shared.user._tag === 'Some'
          ? 'authenticated'
          : 'unauthenticated'
      },
      getCurrentUser: () =>
        model?.shared.user._tag === 'Some' ? model.shared.user.value : null,
    } satisfies ConduitDebug
  }
}
