
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

import * as Form from '@rinn7e/tea-cup-form'
import { pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'

import { textInputView } from '@/component/text-input'
import { Cmd } from 'tea-cup-fp'
import { formMsgHandler, submitHandler } from './handler'
import type { Model, Msg } from './type'



// -----------------------------------------------------------------
// Config
// -----------------------------------------------------------------

export const usernameField = 'username'
export const emailField = 'email'
export const passwordField = 'password'

const defaultFormConfig: [string, Form.FormType][] = [
  [
    usernameField,
    {
      ...Form.defaultTextType(textInputView),
      label: 'Username',
      placeholder: 'Username',
      validation: (input: string) =>
        pipe(Form.nonEmptyValidator(input, usernameField)),
    },
  ],
  [
    emailField,
    {
      ...Form.defaultTextType(textInputView),
      label: 'Email',
      placeholder: 'Email',
      validation: (input: string) =>
        pipe(Form.nonEmptyValidator(input, emailField)),
    },
  ],
  [
    passwordField,
    {
      ...Form.defaultTextType(textInputView),
      label: 'Password',
      placeholder: 'Password',
      isPassword: O.some({ revealPassword: false, disableAutocomplete: true }),
      validation: (input: string) =>
        pipe(Form.nonEmptyValidator(input, passwordField)),
    },
  ],
]

// -----------------------------------------------------------------
// Init
// -----------------------------------------------------------------

export const init = (): [Model, Cmd<Msg>] => {
  return [
    ({
      form: Form.init(new Map(defaultFormConfig)),
    }), Cmd.none()
  ]
}

// -----------------------------------------------------------------
// Update
// -----------------------------------------------------------------

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'None':
      return [model, Cmd.none()]
    case 'FormMsg':
      return pipe([formMsgHandler(msg.subMsg)(model), Cmd.none()])
    case 'Submit':
      return submitHandler(model)
  }
}

export * from './handler'
export * from './type'

