import type * as RD from '@devexperts/remote-data-ts'
import type { Result } from 'tea-cup-fp'

import type { ArticleResponse, CommentsResponse } from '@/api/type'

export type Model = {
  article: RD.RemoteData<Error, ArticleResponse>
  comments: RD.RemoteData<Error, CommentsResponse>
}

export type Msg =
  | { _tag: 'GetArticleResponse'; result: Result<Error, ArticleResponse> }
  | { _tag: 'GetCommentsResponse'; result: Result<Error, CommentsResponse> }
