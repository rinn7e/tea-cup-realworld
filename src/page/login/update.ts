import * as Form from '@rinn7e/tea-cup-form'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import { Cmd } from 'tea-cup-fp'

import { login } from '@/api'
import { standardInputUi } from '@/component/form-fields'
import type { Shared } from '@/type'

import type { Model, Msg } from './type'

const emailField: [string, Form.FormType] = [
  'email',
  {
    _tag: 'TextType',
    placeholder: 'Email',
    label: 'Email',
    currentValue: '',
    validation: (s: string) => Form.nonEmptyValidator(s, 'Email'),
    linkValidations: [],
    showValidation: false,
    isTextarea: false,
    isPassword: O.none,
    isFocus: false,
    ui: standardInputUi(false),
  },
]

const passwordField: [string, Form.FormType] = [
  'password',
  {
    _tag: 'TextType',
    placeholder: 'Password',
    label: 'Password',
    currentValue: '',
    validation: (s: string) => Form.nonEmptyValidator(s, 'Password'),
    linkValidations: [],
    showValidation: false,
    isTextarea: false,
    isPassword: O.some({ revealPassword: false, disableAutocomplete: false }),
    isFocus: false,
    ui: standardInputUi(false),
  },
]

const loginFormConfig: [string, Form.FormType][] = [emailField, passwordField]

export const init = (_shared: Shared): [Model, Cmd<Msg>] => {
  return [
    {
      form: Form.init(new Map(loginFormConfig)),
      errors: null,
      submitting: false,
    },
    Cmd.none(),
  ]
}

export const update =
  (_shared: Shared) =>
  (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'FormMsg':
        return [
          { ...model, form: Form.update(msg.subMsg)(model.form) },
          Cmd.none(),
        ]
      case 'Submit': {
        const email = Form.valueTextType(
          Form.lookupForm('email', model.form.forms),
        )
        const password = Form.valueTextType(
          Form.lookupForm('password', model.form.forms),
        )

        return [
          { ...model, submitting: true, errors: null },
          attemptTE(
            login({ user: { email, password } }),
            (result): Msg => ({ _tag: 'SubmitResponse', result }),
          ),
        ]
      }
      case 'SubmitResponse':
        if (msg.result.tag === 'Ok') {
          return [{ ...model, submitting: false }, Cmd.none()]
        } else {
          return [
            { ...model, submitting: false, errors: msg.result.err },
            Cmd.none(),
          ]
        }
    }
  }
