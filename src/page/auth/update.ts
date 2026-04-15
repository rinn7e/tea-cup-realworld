import * as FormUpdate from '@rinn7e/tea-cup-form'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import * as Map from 'fp-ts/lib/Map'
import * as O from 'fp-ts/lib/Option'
import * as S from 'fp-ts/lib/string'
import { Cmd } from 'tea-cup-fp'

import { login, register } from '@/api/service'
import { standardInputUi } from '@/component/form-fields'

import type { Model, Msg } from './type'

const emailField = (ui: any): [string, FormUpdate.FormType] => [
  'email',
  {
    ...FormUpdate.defaultTextType(ui),
    placeholder: 'Email',
    label: 'Email',
    validation: FormUpdate.emailValidator,
  },
]

const passwordField = (ui: any): [string, FormUpdate.FormType] => [
  'password',
  {
    ...FormUpdate.defaultTextType(ui),
    placeholder: 'Password',
    label: 'Password',
    isPassword: O.some({ revealPassword: false, disableAutocomplete: false }),
    validation: (s: string) => FormUpdate.minLengthValidator('Password', 8)(s),
  },
]

const usernameField = (ui: any): [string, FormUpdate.FormType] => [
  'username',
  {
    ...FormUpdate.defaultTextType(ui),
    placeholder: 'Username',
    label: 'Username',
    validation: (s: string) => FormUpdate.nonEmptyValidator(s, 'Username'),
  },
]

const loginFormConfig: [string, FormUpdate.FormType][] = [
  emailField(standardInputUi(false)),
  passwordField(standardInputUi(false)),
]

const signupFormConfig: [string, FormUpdate.FormType][] = [
  usernameField(standardInputUi(false)),
  emailField(standardInputUi(false)),
  passwordField(standardInputUi(false)),
]

const toForms = (config: [string, FormUpdate.FormType][]): FormUpdate.Forms =>
  config.reduce(
    (acc, [key, val]) => Map.upsertAt(S.Eq)(key, val)(acc),
    Map.empty as FormUpdate.Forms,
  )

export const init = (isRegister: boolean): [Model, Cmd<Msg>] => {
  return [
    {
      isRegister,
      loginForm: FormUpdate.init(toForms(loginFormConfig)),
      signupForm: FormUpdate.init(toForms(signupFormConfig)),
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
          {
            ...model,
            signupForm: FormUpdate.update(msg.msg)(model.signupForm),
          },
          Cmd.none(),
        ]
      } else {
        return [
          { ...model, loginForm: FormUpdate.update(msg.msg)(model.loginForm) },
          Cmd.none(),
        ]
      }
    case 'Submit': {
      const currentForm = model.isRegister ? model.signupForm : model.loginForm
      const email = FormUpdate.valueTextType(
        FormUpdate.lookupForm('email', currentForm.forms),
      )
      const password = FormUpdate.valueTextType(
        FormUpdate.lookupForm('password', currentForm.forms),
      )

      const authTask = model.isRegister
        ? register({
            user: {
              username: FormUpdate.valueTextType(
                FormUpdate.lookupForm('username', currentForm.forms),
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
        const err = msg.result.err
        return [
          {
            ...model,
            submitting: false,
            errors: (err as any).errors
              ? (err as any)
              : { errors: { error: [String(err)] } },
          },
          Cmd.none(),
        ]
      }
  }
}
