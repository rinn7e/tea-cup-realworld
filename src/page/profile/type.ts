import type * as RD from '@devexperts/remote-data-ts'
import type { Result } from 'tea-cup-fp'

import type {
  ArticlesResponse,
  HttpErrorString,
  ProfileResponse,
} from '@/api/type'

export type Model = {
  profile: RD.RemoteData<HttpErrorString, ProfileResponse>
  articles: RD.RemoteData<HttpErrorString, ArticlesResponse>
  showFavorites: boolean
}

export type Msg =
  | {
      _tag: 'GetProfileResponse'
      result: Result<HttpErrorString, ProfileResponse>
    }
  | {
      _tag: 'GetArticlesResponse'
      result: Result<HttpErrorString, ArticlesResponse>
    }
  | { _tag: 'ToggleFavorites'; show: boolean }
  | { _tag: 'Follow' }
  | { _tag: 'Unfollow' }
