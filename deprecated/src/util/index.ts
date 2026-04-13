/*
 * MIT License
 *
 * Copyright (c) 2025 Moremi Vannak
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import * as E from 'fp-ts/lib/Either'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// The same as haskell's error.
export const error = (err: string): any => {
  return () => {
    throw new Error(err)
  }
}

// Converts any error value into a readable string.
// Handles Error objects, plain strings, objects, and other types.
// Falls back to String() if nothing else works.
export const errorToString = (err: unknown): string => {
  if (err instanceof Error) {
    return err.stack || err.message
  }
  if (typeof err === 'string') {
    return err
  }
  try {
    return JSON.stringify(err)
  } catch {
    return String(err)
  }
}

// Convert result from `openapi-ts` to Either
export const fromApi = <R, L>(result: {
  data: R | undefined
  error: L
}): E.Either<L, R> => {
  if (result.data) return E.right(result.data)
  else return E.left(result.error)
}

export function cl(...args: ClassValue[]): string {
  return twMerge(clsx(args))
}

// TODO fix this
export const tooltip = (props: any) => {
  return props.children()
}

export * from './api'
export * from './tea'
