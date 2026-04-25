import { type Option } from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'

import { API_BASE } from '@/env'

import { type HttpErrorString } from '../type/common'
import { type TagsResponse, TagsResponseJson } from '../type/tag'
import { decodeError, decodeSuccess, fetchToTaskEither } from './common'

export const getTags = (
  token: Option<string>,
): TE.TaskEither<HttpErrorString, TagsResponse> =>
  pipe(
    fetch(
      `${API_BASE}/tags`,
      token._tag === 'Some'
        ? { headers: { Authorization: `Token ${token.value}` } }
        : undefined,
    ),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(TagsResponseJson)),
    TE.mapLeft(decodeError),
  )
