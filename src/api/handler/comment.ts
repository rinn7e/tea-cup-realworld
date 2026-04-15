import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'

import {
  type CommentResponse,
  CommentResponseJson,
  type CommentsResponse,
  CommentsResponseJson,
} from '../type/comment'
import { type HttpErrorString } from '../type/common'
import {
  API_BASE,
  decodeError,
  decodeSuccess,
  ensureIsOk,
  fetchToTaskEither,
} from './common'

export const getComments = (
  slug: string,
  token?: string,
): TE.TaskEither<HttpErrorString, CommentsResponse> =>
  pipe(
    fetch(`${API_BASE}/articles/${encodeURIComponent(slug)}/comments`, {
      headers: token ? { Authorization: `Token ${token}` } : {},
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(CommentsResponseJson)),
    TE.mapLeft(decodeError),
  )

export const createComment = (
  slug: string,
  body: string,
  token: string,
): TE.TaskEither<HttpErrorString, CommentResponse> =>
  pipe(
    fetch(`${API_BASE}/articles/${encodeURIComponent(slug)}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify({ comment: { body } }),
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(CommentResponseJson)),
    TE.mapLeft(decodeError),
  )

export const deleteComment = (
  slug: string,
  id: number,
  token: string,
): TE.TaskEither<HttpErrorString, true> =>
  pipe(
    fetch(`${API_BASE}/articles/${encodeURIComponent(slug)}/comments/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(ensureIsOk(true as const)),
    TE.mapLeft(decodeError),
  )
