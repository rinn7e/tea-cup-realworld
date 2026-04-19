import * as RD from '@devexperts/remote-data-ts'
import * as Form from '@rinn7e/tea-cup-form'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import { Cmd } from 'tea-cup-fp'

import { signup } from '@/api'
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
    validation: Form.emailValidator,
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
    validation: (s: string) => Form.minLengthValidator('Password', 8)(s),
    linkValidations: [],
    showValidation: false,
    isTextarea: false,
    isPassword: O.some({ revealPassword: false, disableAutocomplete: false }),
    isFocus: false,
    ui: standardInputUi(false),
  },
]

const usernameField: [string, Form.FormType] = [
  'username',
  {
    _tag: 'TextType',
    placeholder: 'Username',
    label: 'Username',
    currentValue: '',
    validation: (s: string) => Form.nonEmptyValidator(s, 'Username'),
    linkValidations: [],
    showValidation: false,
    isTextarea: false,
    isPassword: O.none,
    isFocus: false,
    ui: standardInputUi(false),
  },
]

const signupFormConfig: [string, Form.FormType][] = [
  usernameField,
  emailField,
  passwordField,
]

export const init = (_shared: Shared): [Model, Cmd<Msg>] => {
  return [
    {
      form: Form.init(new Map(signupFormConfig)),
      submitRd: RD.initial,
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
        const username = Form.valueTextType(
          Form.lookupForm('username', model.form.forms),
        )

        return [
          { ...model, submitRd: RD.pending },
          attemptTE(
            signup({ user: { username, email, password } }),
            (result): Msg => ({ _tag: 'SubmitResponse', result }),
          ),
        ]
      }
      case 'SubmitResponse':
        if (msg.result.tag === 'Ok') {
          return [{ ...model, submitRd: RD.success(null) }, Cmd.none()]
        } else {
          return [
            { ...model, submitRd: RD.failure(msg.result.err) },
            Cmd.none(),
          ]
        }
    }
  }
