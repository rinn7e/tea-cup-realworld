import { NullableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as N from 'fp-ts/lib/number'
import * as S from 'fp-ts/lib/string'

export type Errors = {
  errors: Record<string, string[]>
}

export type HttpError<T> = {
  statusCode: number
  err: T | null
  actualErr: string
}

export type HttpErrorString = HttpError<string>

export const HttpErrorStringEq: EqClass.Eq<HttpErrorString> = EqClass.struct({
  statusCode: N.Eq,
  err: NullableEq(S.Eq),
  actualErr: S.Eq,
})

export const mkHttpError = (
  statusCode: number,
  actualErr: string,
): HttpErrorString => ({
  statusCode,
  err: actualErr,
  actualErr,
})
