import * as RD from '@devexperts/remote-data-ts'
import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import type { Dispatcher, Result } from 'tea-cup-fp'

import {
  ArticlesResponseEq,
  HttpErrorStringEq,
  ProfileResponseEq,
} from '@/api/type'
import type {
  ArticleResponse,
  ArticlesResponse,
  HttpErrorString,
  ProfileResponse,
} from '@/api/type'

export type Model = {
  profile: RD.RemoteData<HttpErrorString, ProfileResponse>
  articles: RD.RemoteData<HttpErrorString, ArticlesResponse>
  showFavorites: boolean
}

export const ModelEq = EqClass.struct<Model>({
  profile: RD.getEq(HttpErrorStringEq, ProfileResponseEq),
  articles: RD.getEq(HttpErrorStringEq, ArticlesResponseEq),
  showFavorites: B.Eq,
})

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
  | { _tag: 'FavoriteArticle'; slug: string }
  | { _tag: 'UnfavoriteArticle'; slug: string }
  | {
      _tag: 'FavoriteArticleResponse'
      result: Result<HttpErrorString, ArticleResponse>
    }

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
  isCurrentUser: boolean
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  dispatch: EqAlways,
  isCurrentUser: B.Eq,
})
