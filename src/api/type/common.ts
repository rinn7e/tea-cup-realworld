export type Errors = {
  errors: Record<string, string[]>
}

export type HttpError<T> = {
  statusCode: number
  err: T | null
  actualErr: string
}

export type HttpErrorString = HttpError<string>

export const mkHttpError = (statusCode: number, actualErr: string): HttpErrorString => ({
  statusCode,
  err: actualErr,
  actualErr,
})
