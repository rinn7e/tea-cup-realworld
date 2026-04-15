import type * as RD from '@devexperts/remote-data-ts'
import type { Result } from 'tea-cup-fp'

import type { ArticlesResponse, ProfileResponse } from '../../api/type'

export type Model = {
  profile: RD.RemoteData<Error, ProfileResponse>
  articles: RD.RemoteData<Error, ArticlesResponse>
  showFavorites: boolean
}

export type Msg =
  | { _tag: 'GetProfileResponse'; result: Result<Error, ProfileResponse> }
  | { _tag: 'GetArticlesResponse'; result: Result<Error, ArticlesResponse> }
  | { _tag: 'ToggleFavorites'; show: boolean }
  | { _tag: 'Follow' }
  | { _tag: 'Unfollow' }
