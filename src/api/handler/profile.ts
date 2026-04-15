import { pipe } from 'fp-ts/lib/function'
import * as TE from 'fp-ts/lib/TaskEither'

import { type HttpErrorString } from '../type/common'
import { type ProfileResponse, ProfileResponseJson } from '../type/profile'
import { API_BASE, decodeError, decodeSuccess, fetchToTaskEither } from './common'

export const getProfile = (
  username: string,
  token?: string,
): TE.TaskEither<HttpErrorString, ProfileResponse> =>
  pipe(
    fetch(`${API_BASE}/profiles/${encodeURIComponent(username)}`, {
      headers: token ? { Authorization: `Token ${token}` } : {},
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(ProfileResponseJson)),
    TE.mapLeft(decodeError),
  )

export const followUser = (
  username: string,
  token: string,
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
  username: string,
  token: string,
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
