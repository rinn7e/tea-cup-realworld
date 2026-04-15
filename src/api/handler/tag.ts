import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'

import { type HttpErrorString } from '../type/common'
import { type TagsResponse, TagsResponseJson } from '../type/tag'
import {
  API_BASE,
  decodeError,
  decodeSuccess,
  fetchToTaskEither,
} from './common'

export const getTags = (): TE.TaskEither<HttpErrorString, TagsResponse> =>
  pipe(
    fetch(`${API_BASE}/tags`),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(TagsResponseJson)),
    TE.mapLeft(decodeError),
  )
