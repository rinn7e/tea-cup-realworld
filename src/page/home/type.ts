import * as RD from '@devexperts/remote-data-ts'
import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as N from 'fp-ts/lib/number'
import * as S from 'fp-ts/lib/string'
import type { Dispatcher, Result } from 'tea-cup-fp'

import {
  ArticlesResponseEq,
  HttpErrorStringEq,
  TagsResponseEq,
} from '@/api/type'
import type {
  ArticlesResponse,
  HttpErrorString,
  TagsResponse,
} from '@/api/type'
import * as ArticleShort from '@/component/article-short'

export const GET_ARTICLES_LIMIT = 5

export type Model = {
  articles: RD.RemoteData<HttpErrorString, ArticlesResponse>
  tags: RD.RemoteData<HttpErrorString, TagsResponse>
  tab: 'global-feed' | 'user-feed'
  page: number
  pageAmount: number
}

export const ModelEq = EqClass.struct<Model>({
  articles: RD.getEq(HttpErrorStringEq, ArticlesResponseEq),
  tags: RD.getEq(HttpErrorStringEq, TagsResponseEq),
  tab: S.Eq,
  page: N.Eq,
  pageAmount: N.Eq,
})

export type Msg =
  | {
      _tag: 'GetArticlesResponse'
      result: Result<HttpErrorString, ArticlesResponse>
      shouldScrollToTop?: true
    }
  | { _tag: 'GetTagsResponse'; result: Result<HttpErrorString, TagsResponse> }
  | {
      _tag: 'ArticleShortMsg'
      slug: string
      subMsg: ArticleShort.Msg
    }
  | { _tag: 'ChangeTab'; tab: 'global-feed' | 'user-feed' }
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
