import type * as RD from '@devexperts/remote-data-ts'
import type { Result } from 'tea-cup-fp'

import type {
  ArticleResponse,
  CommentsResponse,
  HttpErrorString,
} from '@/api/type'

export type Model = {
  article: RD.RemoteData<HttpErrorString, ArticleResponse>
  comments: RD.RemoteData<HttpErrorString, CommentsResponse>
}

export type Msg =
  | {
      _tag: 'GetArticleResponse'
      result: Result<HttpErrorString, ArticleResponse>
    }
  | {
      _tag: 'GetCommentsResponse'
      result: Result<HttpErrorString, CommentsResponse>
    }
