import * as RD from '@devexperts/remote-data-ts'
import type { Result } from 'tea-cup-fp'

import type { ArticlesResponse, TagsResponse } from '../../api/type'

export type Model = {
  articles: RD.RemoteData<Error, ArticlesResponse>
  tags: RD.RemoteData<Error, TagsResponse>
}

export type Msg =
  | { _tag: 'GetArticlesResponse'; result: Result<Error, ArticlesResponse> }
  | { _tag: 'GetTagsResponse'; result: Result<Error, TagsResponse> }
