import * as E from 'fp-ts/lib/Either'
import * as TE from 'fp-ts/lib/TaskEither'
import * as t from 'io-ts'

import { type ApiError, type HttpError, ApiErrorJson } from '../type/common'


export type FetchToTaskEitherError = { err: string; status?: number }
export type FetchToTaskEitherSuccess = {
  ok: boolean
  status: number
  text: string
}

export const fetchToTaskEither = (
  p: Promise<Response>,
): TE.TaskEither<FetchToTaskEitherError, FetchToTaskEitherSuccess> =>
  TE.tryCatch(
    () =>
      p.then(async (res) => ({
        ok: res.ok,
        status: res.status,
        text: await res.text(),
      })),
    (err) => ({ err: String(err) }),
  )

export const decodeSuccess =
  <A>(decoder: t.Type<A>) =>
  (s: FetchToTaskEitherSuccess): E.Either<FetchToTaskEitherError, A> => {
    if (!s.ok) return E.left({ err: s.text, status: s.status })
    try {
      const json: unknown = JSON.parse(s.text)
      const result = decoder.decode(json)
      if (result._tag === 'Left')
        return E.left({
          err: `Decode error: ${JSON.stringify(result.left)}`,
          status: s.status,
        })
      return E.right(result.right)
    } catch (e) {
      return E.left({ err: `JSON parse error: ${String(e)}`, status: s.status })
    }
  }

export const ensureIsOk =
  <A>(value: A) =>
  (s: FetchToTaskEitherSuccess): E.Either<FetchToTaskEitherError, A> =>
    s.ok ? E.right(value) : E.left({ err: s.text, status: s.status })

export const decodeError = (e: FetchToTaskEitherError): HttpError<ApiError> => ({
  statusCode: e.status ?? 0,
  err: { _tag: 'Generic', message: e.err },
  actualErr: e.err,
})


export const decodeApiError = (e: FetchToTaskEitherError): HttpError<ApiError> => {
  const statusCode = e.status ?? 0
  try {
    const json = JSON.parse(e.err)
    const result = ApiErrorJson.decode(json)
    if (result._tag === 'Right') {
      return {
        statusCode,
        err: result.right,
        actualErr: e.err,
      }
    }
  } catch (err) {
    // Not JSON or other error
  }
  return {
    statusCode,
    err: { _tag: 'Generic', message: e.err },
    actualErr: e.err,
  }
}



