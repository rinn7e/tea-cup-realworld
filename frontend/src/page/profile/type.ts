import * as RD from '@devexperts/remote-data-ts'
import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import type { Dispatcher, Result } from 'tea-cup-fp'

import {
  ApiErrorEq,
  ArticlesResponseEq,
  ProfileResponseEq,
  getHttpErrorEq,
} from '@/api/type'
import type {
  ApiError,
  ArticlesResponse,
  HttpError,
  ProfileResponse,
} from '@/api/type'
import * as ArticleShort from '@/component/article-short'
import type { Route } from '@/type'

export type Model = {
  profile: RD.RemoteData<HttpError<ApiError>, ProfileResponse>
  articles: RD.RemoteData<HttpError<ApiError>, ArticlesResponse>
  showFavorites: boolean
  followRd: RD.RemoteData<HttpError<ApiError>, ProfileResponse>
  unfollowRd: RD.RemoteData<HttpError<ApiError>, ProfileResponse>
}

export const ModelEq = EqClass.struct<Model>({
  profile: RD.getEq(getHttpErrorEq(ApiErrorEq), ProfileResponseEq),
  articles: RD.getEq(getHttpErrorEq(ApiErrorEq), ArticlesResponseEq),
  showFavorites: B.Eq,
  followRd: RD.getEq(getHttpErrorEq(ApiErrorEq), ProfileResponseEq),
  unfollowRd: RD.getEq(getHttpErrorEq(ApiErrorEq), ProfileResponseEq),
})

export type Msg =
  | {
      _tag: 'GetProfileResponse'
      result: Result<HttpError<ApiError>, ProfileResponse>
    }
  | {
      _tag: 'GetArticlesResponse'
      result: Result<HttpError<ApiError>, ArticlesResponse>
    }
  | { _tag: 'ToggleFavorites'; show: boolean }
  | { _tag: 'Follow' }
  | {
      _tag: 'FollowResponse'
      result: Result<HttpError<ApiError>, ProfileResponse>
    }
  | { _tag: 'Unfollow' }
  | {
      _tag: 'UnfollowResponse'
      result: Result<HttpError<ApiError>, ProfileResponse>
    }
  | {
      _tag: 'ArticleShortMsg'
      slug: string
      subMsg: ArticleShort.Msg
    }

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
  isCurrentUser: boolean
  route: Route
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  dispatch: EqAlways,
  isCurrentUser: B.Eq,
})
