import * as Form from '@rinn7e/tea-cup-form'
import { lookupForm, valueTextType } from '@rinn7e/tea-cup-form'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Cmd } from 'tea-cup-fp'

import type { Shared } from '@/type'

import { updateUser } from '@/api'
import type { User } from '@/api/type'
import { standardInputUi } from '@/component/form-fields'

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

export const init = (shared: Shared): [Model, Cmd<Msg>] => {
  return [
    {
      form: pipe(
      shared.user,
      O.map((u) => Form.init(new Map(settingsFormConfig(u)))),
    ),
      errors: null,
      submitting: false,
    },
    Cmd.none(),
  ]
}

export const update =
  (shared: Shared) =>
  (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'FormMsg':
        return [
          { ...model, form: pipe(model.form, O.map(Form.update(msg.subMsg))) },
          Cmd.none(),
        ]
      case 'Logout':
        return [model, Cmd.none()]
      case 'Submit': {
        if (model.form._tag === 'None') return [model, Cmd.none()]
        const form = model.form.value
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

        if (shared.token._tag === 'None') return [model, Cmd.none()]

        return [
          { ...model, submitting: true, errors: null },
          attemptTE(
            updateUser(shared.token.value, { user: userUpdate }),
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
