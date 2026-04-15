import * as RD from '@devexperts/remote-data-ts'
import type { Result } from 'tea-cup-fp'

import type {
  ArticlesResponse,
  HttpErrorString,
  TagsResponse,
} from '@/api/type'

export type Model = {
  articles: RD.RemoteData<HttpErrorString, ArticlesResponse>
  tags: RD.RemoteData<HttpErrorString, TagsResponse>
}

export type Msg =
  | {
      _tag: 'GetArticlesResponse'
      result: Result<HttpErrorString, ArticlesResponse>
    }
  | { _tag: 'GetTagsResponse'; result: Result<HttpErrorString, TagsResponse> }
