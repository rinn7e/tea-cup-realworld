import * as RD from '@devexperts/remote-data-ts'
import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import type { Option } from 'fp-ts/lib/Option'
import * as S from 'fp-ts/lib/string'
import type { Dispatcher, Result } from 'tea-cup-fp'

import {
  ArticleResponseEq,
  CommentsResponseEq,
  HttpErrorStringEq,
} from '@/api/type'
import type {
  ArticleResponse,
  CommentResponse,
  CommentsResponse,
  HttpErrorString,
  ProfileResponse,
} from '@/api/type'

export type Model = {
  slug: string
  article: RD.RemoteData<HttpErrorString, ArticleResponse>
  comments: RD.RemoteData<HttpErrorString, CommentsResponse>
  commentInput: string
}

export const ModelEq = EqClass.struct<Model>({
  slug: S.Eq,
  article: RD.getEq(HttpErrorStringEq, ArticleResponseEq),
  comments: RD.getEq(HttpErrorStringEq, CommentsResponseEq),
  commentInput: S.Eq,
})

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
  | {
      _tag: 'UnfavoriteArticleResponse'
      result: Result<HttpErrorString, ArticleResponse>
    }
  | { _tag: 'FollowAuthor'; username: string }
  | { _tag: 'UnfollowAuthor'; username: string }
  | {
      _tag: 'FollowAuthorResponse'
      result: Result<HttpErrorString, ProfileResponse>
    }
  | {
      _tag: 'UnfollowAuthorResponse'
      result: Result<HttpErrorString, ProfileResponse>
    }
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

export type Props = {
  model: Model
  token: Option<string>
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  token: O.getEq(S.Eq),
  dispatch: EqAlways,
})
