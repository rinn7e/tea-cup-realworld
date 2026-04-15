import { type Option } from 'fp-ts/lib/Option'
import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'

import { type HttpErrorString } from '../type/common'
import { type ProfileResponse, ProfileResponseJson } from '../type/profile'
import {
  API_BASE,
  decodeError,
  decodeSuccess,
  fetchToTaskEither,
} from './common'

export const getProfile = (
  token: Option<string>,
  username: string,
): TE.TaskEither<HttpErrorString, ProfileResponse> =>
  pipe(
    fetch(`${API_BASE}/profiles/${encodeURIComponent(username)}`, {
      headers:
        token._tag === 'Some' ? { Authorization: `Token ${token.value}` } : {},
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(ProfileResponseJson)),
    TE.mapLeft(decodeError),
  )

export const followUser = (
  token: string,
  username: string,
): TE.TaskEither<HttpErrorString, ProfileResponse> =>
  pipe(
    fetch(`${API_BASE}/profiles/${encodeURIComponent(username)}/follow`, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(ProfileResponseJson)),
    TE.mapLeft(decodeError),
  )

export const unfollowUser = (
  token: string,
  username: string,
): TE.TaskEither<HttpErrorString, ProfileResponse> =>
  pipe(
    fetch(`${API_BASE}/profiles/${encodeURIComponent(username)}/follow`, {
      method: 'DELETE',
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(ProfileResponseJson)),
    TE.mapLeft(decodeError),
  )
