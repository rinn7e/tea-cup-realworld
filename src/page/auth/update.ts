import * as Form from '@rinn7e/tea-cup-form'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import { Cmd } from 'tea-cup-fp'

import { login, register } from '@/api'
import { standardInputUi } from '@/component/form-fields'

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

const loginFormConfig: [string, Form.FormType][] = [emailField, passwordField]

const signupFormConfig: [string, Form.FormType][] = [
  usernameField,
  emailField,
  passwordField,
]

export const init = (isRegister: boolean): [Model, Cmd<Msg>] => {
  return [
    {
      isRegister,
      loginForm: Form.init(new Map(loginFormConfig)),
      signupForm: Form.init(new Map(signupFormConfig)),
      errors: null,
      submitting: false,
    },
    Cmd.none(),
  ]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'FormMsg':
      if (model.isRegister) {
        return [
          { ...model, signupForm: Form.update(msg.subMsg)(model.signupForm) },
          Cmd.none(),
        ]
      } else {
        return [
          { ...model, loginForm: Form.update(msg.subMsg)(model.loginForm) },
          Cmd.none(),
        ]
      }
    case 'Submit': {
      const currentForm = model.isRegister ? model.signupForm : model.loginForm
      const email = Form.valueTextType(
        Form.lookupForm('email', currentForm.forms),
      )
      const password = Form.valueTextType(
        Form.lookupForm('password', currentForm.forms),
      )

      const authTask = model.isRegister
        ? register({
            user: {
              username: Form.valueTextType(
                Form.lookupForm('username', currentForm.forms),
              ),
              email,
              password,
            },
          })
        : login({ user: { email, password } })

      return [
        { ...model, submitting: true, errors: null },
        attemptTE(
          authTask,
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
