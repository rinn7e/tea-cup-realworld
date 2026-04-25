import * as RD from '@devexperts/remote-data-ts'
import { EqAlways, NullableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import type { Option } from 'fp-ts/lib/Option'
import * as S from 'fp-ts/lib/string'
import type { Dispatcher, Result } from 'tea-cup-fp'

import {
  ArticleResponseEq,
  CommentsResponseEq,
  getHttpErrorEq,
  ApiErrorEq,
  UserEq,
} from '@/api/type'

import type {
  ApiError,
  ArticleResponse,
  CommentResponse,
  CommentsResponse,
  HttpError,
  ProfileResponse,
  User,
} from '@/api/type'

export type Model = {
  slug: string
  article: RD.RemoteData<HttpError<ApiError>, ArticleResponse>
  comments: RD.RemoteData<HttpError<ApiError>, CommentsResponse>
  newCommentInput: string
  newCommentError: HttpError<ApiError> | null
}

export const ModelEq = EqClass.struct<Model>({
  slug: S.Eq,
  article: RD.getEq(getHttpErrorEq(ApiErrorEq), ArticleResponseEq),
  comments: RD.getEq(getHttpErrorEq(ApiErrorEq), CommentsResponseEq),
  newCommentInput: S.Eq,
  newCommentError: NullableEq(getHttpErrorEq(ApiErrorEq)),
})


export type Msg =
  | {
      _tag: 'GetArticleResponse'
      result: Result<HttpError<ApiError>, ArticleResponse>
    }
  | {
      _tag: 'GetCommentsResponse'
      result: Result<HttpError<ApiError>, CommentsResponse>
    }
  | { _tag: 'FavoriteArticle' }
  | { _tag: 'UnfavoriteArticle' }
  | {
      _tag: 'FavoriteArticleResponse'
      result: Result<HttpError<ApiError>, ArticleResponse>
    }
  | {
      _tag: 'UnfavoriteArticleResponse'
      result: Result<HttpError<ApiError>, ArticleResponse>
    }
  | { _tag: 'FollowAuthor'; username: string }
  | { _tag: 'UnfollowAuthor'; username: string }
  | {
      _tag: 'FollowAuthorResponse'
      result: Result<HttpError<ApiError>, ProfileResponse>
    }
  | {
      _tag: 'UnfollowAuthorResponse'
      result: Result<HttpError<ApiError>, ProfileResponse>
    }
  | { _tag: 'DeleteArticle' }
  | { _tag: 'DeleteArticleResponse'; result: Result<HttpError<ApiError>, true> }
  | { _tag: 'SetCommentInput'; value: string }
  | { _tag: 'SubmitComment' }
  | {
      _tag: 'SubmitCommentResponse'
      result: Result<HttpError<ApiError>, CommentResponse>
    }
  | { _tag: 'DeleteComment'; id: number }
  | {
      _tag: 'DeleteCommentResponse'
      id: number
      result: Result<HttpError<ApiError>, true>
    }


export type Props = {
  model: Model
  user: Option<User>
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  user: O.getEq(UserEq),
  dispatch: EqAlways,
})
