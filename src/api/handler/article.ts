import { Option } from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'

import {
  type ArticleResponse,
  ArticleResponseJson,
  type ArticlesResponse,
  ArticlesResponseJson,
  type NewArticleRequest,
  type UpdateArticleRequest,
} from '../type/article'
import { type HttpErrorString } from '../type/common'
import {
  API_BASE,
  decodeError,
  decodeSuccess,
  ensureIsOk,
  fetchToTaskEither,
} from './common'

export const getArticles = (
  params: {
    tag?: string
    author?: string
    favorited?: string
    offset?: number
    limit?: number
  } = {},
  token: Option<string>,
): TE.TaskEither<HttpErrorString, ArticlesResponse> => {
  const query = new URLSearchParams()
  if (params.tag !== undefined) query.set('tag', params.tag)
  if (params.author !== undefined) query.set('author', params.author)
  if (params.favorited !== undefined) query.set('favorited', params.favorited)
  if (params.offset !== undefined) query.set('offset', String(params.offset))
  if (params.limit !== undefined) query.set('limit', String(params.limit))
  const qs = query.toString()
  return pipe(
    fetch(
      `${API_BASE}/articles${qs ? `?${qs}` : ''}`,
      token._tag === 'Some'
        ? {
            headers: { Authorization: `Token ${token.value}` },
          }
        : undefined,
    ),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(ArticlesResponseJson)),
    TE.mapLeft(decodeError),
  )
}

export const getArticlesFeed = (
  params: { offset?: number; limit?: number } = {},
  token: string,
): TE.TaskEither<HttpErrorString, ArticlesResponse> => {
  const query = new URLSearchParams()
  if (params.offset !== undefined) query.set('offset', String(params.offset))
  if (params.limit !== undefined) query.set('limit', String(params.limit))
  const qs = query.toString()
  return pipe(
    fetch(`${API_BASE}/articles/feed${qs ? `?${qs}` : ''}`, {
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(ArticlesResponseJson)),
    TE.mapLeft(decodeError),
  )
}

export const getArticle = (
  slug: string,
): TE.TaskEither<HttpErrorString, ArticleResponse> =>
  pipe(
    fetch(`${API_BASE}/articles/${encodeURIComponent(slug)}`),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(ArticleResponseJson)),
    TE.mapLeft(decodeError),
  )

export const createArticle = (
  request: NewArticleRequest,
  token: string,
): TE.TaskEither<HttpErrorString, ArticleResponse> =>
  pipe(
    fetch(`${API_BASE}/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(request),
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(ArticleResponseJson)),
    TE.mapLeft(decodeError),
  )

export const updateArticle = (
  slug: string,
  request: UpdateArticleRequest,
  token: string,
): TE.TaskEither<HttpErrorString, ArticleResponse> =>
  pipe(
    fetch(`${API_BASE}/articles/${encodeURIComponent(slug)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(request),
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(ArticleResponseJson)),
    TE.mapLeft(decodeError),
  )

export const deleteArticle = (
  slug: string,
  token: string,
): TE.TaskEither<HttpErrorString, true> =>
  pipe(
    fetch(`${API_BASE}/articles/${encodeURIComponent(slug)}`, {
      method: 'DELETE',
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(ensureIsOk(true as const)),
    TE.mapLeft(decodeError),
  )

export const favoriteArticle = (
  slug: string,
  token: string,
): TE.TaskEither<HttpErrorString, ArticleResponse> =>
  pipe(
    fetch(`${API_BASE}/articles/${encodeURIComponent(slug)}/favorite`, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(ArticleResponseJson)),
    TE.mapLeft(decodeError),
  )

export const unfavoriteArticle = (
  slug: string,
  token: string,
): TE.TaskEither<HttpErrorString, ArticleResponse> =>
  pipe(
    fetch(`${API_BASE}/articles/${encodeURIComponent(slug)}/favorite`, {
      method: 'DELETE',
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(ArticleResponseJson)),
    TE.mapLeft(decodeError),
  )
