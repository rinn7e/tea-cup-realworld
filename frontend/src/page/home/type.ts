import * as RD from '@devexperts/remote-data-ts'
import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as N from 'fp-ts/lib/number'
import * as S from 'fp-ts/lib/string'
import type { Dispatcher, Result } from 'tea-cup-fp'

import {
  ApiErrorEq,
  ArticlesResponseEq,
  TagsResponseEq,
  getHttpErrorEq,
} from '@/api/type'
import type {
  ApiError,
  ArticlesResponse,
  HttpError,
  TagsResponse,
} from '@/api/type'
import * as ArticleShort from '@/component/article-short'
import { HomeTab, HomeTabEq } from '@/data/route/type'

export const GET_ARTICLES_LIMIT = 10

export type Model = {
  articles: RD.RemoteData<HttpError<ApiError>, ArticlesResponse>
  tags: RD.RemoteData<HttpError<ApiError>, TagsResponse>
  tab: HomeTab
  page: number
  pageAmount: number
}

export const ModelEq = EqClass.struct<Model>({
  articles: RD.getEq(getHttpErrorEq(ApiErrorEq), ArticlesResponseEq),
  tags: RD.getEq(getHttpErrorEq(ApiErrorEq), TagsResponseEq),
  tab: HomeTabEq,
  page: N.Eq,
  pageAmount: N.Eq,
})

export type Msg =
  | {
      _tag: 'GetArticlesResponse'
      result: Result<HttpError<ApiError>, ArticlesResponse>
      shouldScrollToTop?: true
    }
  | {
      _tag: 'GetTagsResponse'
      result: Result<HttpError<ApiError>, TagsResponse>
    }
  | {
      _tag: 'ArticleShortMsg'
      slug: string
      subMsg: ArticleShort.Msg
    }
  | { _tag: 'ChangeTab'; tab: HomeTab }
  | { _tag: 'ChangePage'; page: number }
  | { _tag: 'NoOp' }

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  dispatch: EqAlways,
})
