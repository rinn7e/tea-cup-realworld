import * as RD from '@devexperts/remote-data-ts'
import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import type { Dispatcher, Result } from 'tea-cup-fp'

import {
  ArticlesResponseEq,
  HttpErrorStringEq,
  TagsResponseEq,
} from '@/api/type'
import type {
  ArticleResponse,
  ArticlesResponse,
  HttpErrorString,
  TagsResponse,
} from '@/api/type'

export type Model = {
  articles: RD.RemoteData<HttpErrorString, ArticlesResponse>
  tags: RD.RemoteData<HttpErrorString, TagsResponse>
}

export const ModelEq = EqClass.struct<Model>({
  articles: RD.getEq(HttpErrorStringEq, ArticlesResponseEq),
  tags: RD.getEq(HttpErrorStringEq, TagsResponseEq),
})

export type Msg =
  | {
      _tag: 'GetArticlesResponse'
      result: Result<HttpErrorString, ArticlesResponse>
    }
  | { _tag: 'GetTagsResponse'; result: Result<HttpErrorString, TagsResponse> }
  | { _tag: 'FavoriteArticle'; slug: string }
  | { _tag: 'UnfavoriteArticle'; slug: string }
  | {
      _tag: 'FavoriteArticleResponse'
      result: Result<HttpErrorString, ArticleResponse>
    }

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  dispatch: EqAlways,
})
