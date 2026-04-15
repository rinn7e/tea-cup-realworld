import type * as RD from '@devexperts/remote-data-ts'
import type { Option } from 'fp-ts/lib/Option'
import type { Result } from 'tea-cup-fp'

import type {
  ArticleResponse,
  CommentResponse,
  CommentsResponse,
  HttpErrorString,
  ProfileResponse,
} from '@/api/type'

export type Model = {
  slug: string
  token: Option<string>
  article: RD.RemoteData<HttpErrorString, ArticleResponse>
  comments: RD.RemoteData<HttpErrorString, CommentsResponse>
  commentInput: string
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
  | { _tag: 'FavoriteArticle' }
  | { _tag: 'UnfavoriteArticle' }
  | {
      _tag: 'FavoriteArticleResponse'
      result: Result<HttpErrorString, ArticleResponse>
    }
  | { _tag: 'FollowAuthor'; username: string }
  | { _tag: 'UnfollowAuthor'; username: string }
  | { _tag: 'FollowAuthorResponse'; result: Result<HttpErrorString, ProfileResponse> }
  | { _tag: 'UnfollowAuthorResponse'; result: Result<HttpErrorString, ProfileResponse> }
  | { _tag: 'DeleteArticle' }
  | { _tag: 'DeleteArticleResponse'; result: Result<HttpErrorString, true> }
  | { _tag: 'SetCommentInput'; value: string }
  | { _tag: 'SubmitComment' }
  | {
      _tag: 'SubmitCommentResponse'
      result: Result<HttpErrorString, CommentResponse>
    }
  | { _tag: 'DeleteComment'; id: number }
  | {
      _tag: 'DeleteCommentResponse'
      id: number
      result: Result<HttpErrorString, true>
    }
