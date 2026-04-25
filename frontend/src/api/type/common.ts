import { NullableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as N from 'fp-ts/lib/number'
import * as S from 'fp-ts/lib/string'
import * as t from 'io-ts'

export type Errors = {
  errors: Record<string, string[]>
}

export const ErrorsJson = t.type({
  errors: t.record(t.string, t.array(t.string)),
})

export type HttpError<T> = {
  statusCode: number
  err: T | null
  actualErr: string
}

export const getHttpErrorEq = <T>(
  eq: EqClass.Eq<T>,
): EqClass.Eq<HttpError<T>> =>
  EqClass.struct({
    statusCode: N.Eq,
    err: NullableEq(eq),
    actualErr: S.Eq,
  })

export type HttpErrorString = HttpError<string>

export const HttpErrorStringEq: EqClass.Eq<HttpErrorString> =
  getHttpErrorEq(S.Eq)


export type ApiError =

  | { _tag: 'Generic'; message: string }
  | { _tag: 'Validation'; errors: Record<string, string[]> }

export const ApiErrorEq: EqClass.Eq<ApiError> = {
  equals: (x, y) => {
    if (x._tag !== y._tag) return false
    if (x._tag === 'Generic' && y._tag === 'Generic')
      return x.message === y.message
    if (x._tag === 'Validation' && y._tag === 'Validation')
      return JSON.stringify(x.errors) === JSON.stringify(y.errors)
    return false
  },
}

export const API_ERROR_VALIDATION = 'Validation'
export const API_ERROR_GENERIC = 'Generic'

/**
 * Custom io-ts decoder for ApiError.
 * It transforms raw API error responses (which don't have a _tag)
 * into our internal tagged union representation.
 */
export const ApiErrorJson = new t.Type<ApiError, unknown, unknown>(
  'ApiError',
  (u): u is ApiError =>
    (typeof u === 'object' && u !== null && '_tag' in u) as boolean,
  (u, c) => {
    if (typeof u !== 'object' || u === null) {
      return t.failure(u, c)
    }
    const obj = u as any
    // Map RealWorld validation errors (obj.errors) to our 'Validation' tag
    if (obj.errors && typeof obj.errors === 'object') {
      return t.success({
        _tag: 'Validation',
        errors: obj.errors,
      })
    }
    // Map simple error messages (obj.message) to our 'Generic' tag
    if (obj.message && typeof obj.message === 'string') {
      return t.success({
        _tag: 'Generic',
        message: obj.message,
      })
    }

    return t.failure(u, c)
  },
  (a) => a,
)



export const mkHttpError = (
  statusCode: number,
  actualErr: string,
): HttpErrorString => ({
  statusCode,
  err: actualErr,
  actualErr,
})


