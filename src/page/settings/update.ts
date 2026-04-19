import * as RD from '@devexperts/remote-data-ts'
import * as Form from '@rinn7e/tea-cup-form'
import { lookupForm, valueTextType } from '@rinn7e/tea-cup-form'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Cmd } from 'tea-cup-fp'

import { updateUser } from '@/api'
import type { User } from '@/api/type'
import { standardInputUi } from '@/component/form-fields'
import type { Shared } from '@/type'

import type { Model, Msg } from './type'

const settingsFormConfig = (user: User): [string, Form.FormType][] => [
  [
    'image',
    {
      _tag: 'TextType',
      placeholder: 'URL of profile picture',
      label: 'Profile picture',
      currentValue: user.image || '',
      validation: (s: string) => Form.nonEmptyValidator(s, 'Image URL'),
      linkValidations: [],
      showValidation: false,
      isTextarea: false,
      isPassword: O.none,
      isFocus: false,
      ui: standardInputUi(false, O.none, false),
    },
  ],
  [
    'username',
    {
      _tag: 'TextType',
      placeholder: 'Username',
      label: 'Username',
      currentValue: user.username,
      validation: (s: string) => Form.nonEmptyValidator(s, 'Username'),
      linkValidations: [],
      showValidation: false,
      isTextarea: false,
      isPassword: O.none,
      isFocus: false,
      ui: standardInputUi(false),
    },
  ],
  [
    'bio',
    {
      _tag: 'TextType',
      placeholder: 'Short bio about you',
      label: 'Bio',
      currentValue: user.bio || '',
      validation: (s: string) => Form.nonEmptyValidator(s, 'Bio'),
      linkValidations: [],
      showValidation: false,
      isTextarea: true,
      isPassword: O.none,
      isFocus: false,
      ui: standardInputUi(true),
    },
  ],
  [
    'email',
    {
      _tag: 'TextType',
      placeholder: 'Email',
      label: 'Email',
      currentValue: user.email,
      validation: (s: string) => Form.emailValidator(s),
      linkValidations: [],
      showValidation: false,
      isTextarea: false,
      isPassword: O.none,
      isFocus: false,
      ui: standardInputUi(false),
    },
  ],
  [
    'password',
    {
      _tag: 'TextType',
      placeholder: 'New Password',
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
  ],
]

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
    return preprocessFormMsgHandler(Form.update(subMsg)(model.form))(model)
  }


export const init = (user: User): [Model, Cmd<Msg>] => {
  const initialForm = Form.init(new Map(settingsFormConfig(user)))
  const baseModel: Model = {
    form: initialForm,
    requestRd: RD.initial,
    isFormValid: false,
  }
  return [preprocessFormMsgHandler(initialForm)(baseModel), Cmd.none()]
}

export const update =
  (user: User) =>
  (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'FormMsg': {
        return [{ ...formMsgHandler(msg.subMsg)(model) }, Cmd.none()]
      }
      case 'Logout':
        return [model, Cmd.none()]
      case 'Submit': {
        const form = model.form
        const image = valueTextType(lookupForm('image', form.forms))
        const username = valueTextType(lookupForm('username', form.forms))
        const bio = valueTextType(lookupForm('bio', form.forms))
        const email = valueTextType(lookupForm('email', form.forms))
        const password = valueTextType(lookupForm('password', form.forms))

        const userUpdate: {
          image?: string
          username?: string
          bio?: string
          email?: string
          password?: string
        } = { image, username, bio, email }
        if (password) {
          userUpdate.password = password
        }

        return [
          { ...model, requestRd: RD.pending },
          attemptTE(
            updateUser(user.token, { user: userUpdate }),
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
