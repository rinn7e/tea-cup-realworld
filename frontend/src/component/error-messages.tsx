import * as A from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'
import * as R from 'fp-ts/lib/Record'
import React from 'react'

import { type ApiError, type HttpError } from '@/api/type/common'

interface Props {
  error: HttpError<ApiError>
}

export const ErrorMessages: React.FC<Props> = ({ error }) => {
  const apiError = error.err

  const messages: string[] = pipe(
    apiError,
    (err) => {
      if (err?._tag === 'Validation') {
        return pipe(
          err.errors,
          R.collect((field, errors) =>
            pipe(
              errors,
              A.map((message) => `${field} ${message}`),
            ),
          ),
          A.flatten,
        )
      }
      if (err?._tag === 'Generic') {
        const msg = err.message
        if (
          msg.toLowerCase().includes('failed to fetch') ||
          msg.toLowerCase().includes('networkerror')
        ) {
          return ['Unable to connect']
        }
        return [msg]
      }
      if (
        error.actualErr.toLowerCase().includes('failed to fetch') ||
        error.actualErr.toLowerCase().includes('networkerror')
      ) {
        return ['Unable to connect']
      }
      return [error.actualErr]
    },
  )

  return (
    <ul className='error-messages flex flex-col gap-[4px] rounded border border-red-200 bg-red-50 p-[12px] text-sm text-red-700'>
      {messages.map((message, index) => (
        <li key={index}>{message}</li>
      ))}
    </ul>
  )
}

