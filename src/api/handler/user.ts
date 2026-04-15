import * as TE from 'fp-ts/lib/TaskEither'
import { pipe } from 'fp-ts/lib/function'

import { type HttpErrorString } from '../type/common'
import {
  type LoginRequest,
  type RegisterRequest,
  type UpdateUserRequest,
  type UserResponse,
  UserResponseJson,
} from '../type/user'
import {
  API_BASE,
  decodeError,
  decodeSuccess,
  fetchToTaskEither,
} from './common'

export const getCurrentUser = (
  token: string,
): TE.TaskEither<HttpErrorString, UserResponse> =>
  pipe(
    fetch(`${API_BASE}/user`, {
      headers: { Authorization: `Token ${token}` },
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(UserResponseJson)),
    TE.mapLeft(decodeError),
  )

export const updateUser = (
  request: UpdateUserRequest,
  token: string,
): TE.TaskEither<HttpErrorString, UserResponse> =>
  pipe(
    fetch(`${API_BASE}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`,
      },
      body: JSON.stringify(request),
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(UserResponseJson)),
    TE.mapLeft(decodeError),
  )

export const login = (
  request: LoginRequest,
): TE.TaskEither<HttpErrorString, UserResponse> =>
  pipe(
    fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(UserResponseJson)),
    TE.mapLeft(decodeError),
  )

export const register = (
  request: RegisterRequest,
): TE.TaskEither<HttpErrorString, UserResponse> =>
  pipe(
    fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request),
    }),
    fetchToTaskEither,
    TE.chainEitherK(decodeSuccess(UserResponseJson)),
    TE.mapLeft(decodeError),
  )
