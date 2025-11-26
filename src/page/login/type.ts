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
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import * as Form from '@rinn7e/tea-cup-form'
import { type FormType } from '@rinn7e/tea-cup-form'

import { inputField } from '@/component/common/form-ui'

// -----------------------------------------------------------------
// Config
// -----------------------------------------------------------------

export const currentPassword = 'currentPassword'
export const newPassword = 'newPassword'
export const repeatNewPassword = 'repeatNewPassword'

export const defaultChangePasswordFormConfig: [string, FormType][] = [
  [
    currentPassword,
    {
      ...Form.defaultTextType(inputField()),
      label: 'Current password',
      placeholder: '********',
      isPassword: O.some({ revealPassword: false, disableAutocomplete: true }),
      validation: (password: string) =>
        pipe(Form.nonEmptyValidator(password, currentPassword)),
    },
  ],
  [
    newPassword,
    {
      ...Form.defaultTextType(inputField()),
      label: 'New password',
      placeholder: '********',
      isPassword: O.some({ revealPassword: false, disableAutocomplete: true }),
      validation: (password: string) =>
        pipe(Form.nonEmptyValidator(password, newPassword)),
    },
  ],
  [
    repeatNewPassword,
    {
      ...Form.defaultTextType(inputField()),
      label: 'Repeat new password',
      placeholder: '********',
      isPassword: O.some({ revealPassword: false, disableAutocomplete: true }),
      linkValidations: [
        {
          linkKey: newPassword,
          validation: (currentInput: string, linkInput: string) => {
            if (currentInput !== linkInput) {
              return E.left('Password does not match')
            }

            return E.right(currentInput)
          },
        },
      ],
    },
  ],
]
