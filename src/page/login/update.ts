import * as RD from '@devexperts/remote-data-ts'
import * as Form from '@rinn7e/tea-cup-form'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
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

const preprocessFormMsgHandler =
  (newForm: Form.Model) =>
  (model: Model): Model => {
    const isFormValid =
      Form.runValidationForAll(newForm.forms, Form.noExtraValidation)._tag ===
      'Right'
    return {
      ...model,
      form: newForm,
      isFormValid,
      requestRd: RD.initial,
    }
  }

export const formMsgHandler =
  (subMsg: Form.Msg) =>
  (model: Model): Model => {
    return pipe(model.form, Form.update(subMsg), (newForm) =>
      preprocessFormMsgHandler(newForm)(model),
    )
  }

export const init = (_shared: Shared): [Model, Cmd<Msg>] => {
  const model: Model = {
    form: Form.init(new Map(loginFormConfig)),
    requestRd: RD.initial,
    isFormValid: false,
  }
  return [preprocessFormMsgHandler(model.form)(model), Cmd.none()]
}

export const update =
  (_shared: Shared) =>
  (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'FormMsg': {
        return [{ ...formMsgHandler(msg.subMsg)(model) }, Cmd.none()]
      }
      case 'Submit': {
        const email = Form.valueTextType(
          Form.lookupForm('email', model.form.forms),
        )
        const password = Form.valueTextType(
          Form.lookupForm('password', model.form.forms),
        )

        return [
          { ...model, requestRd: RD.pending },
          attemptTE(
            login({ user: { email, password } }),
            (result): Msg => ({ _tag: 'SubmitResponse', result }),
          ),
        ]
      }
      case 'SubmitResponse':
        if (msg.result.tag === 'Ok') {
          return [{ ...model, requestRd: RD.success(null) }, Cmd.none()]
        } else {
          return [
            { ...model, requestRd: RD.failure(msg.result.err) },
            Cmd.none(),
          ]
        }
    }
  }
