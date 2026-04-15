import * as Form from '@rinn7e/tea-cup-form'
import { lookupForm, valueTextType } from '@rinn7e/tea-cup-form'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import { Cmd } from 'tea-cup-fp'

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

export const init = (user: User): [Model, Cmd<Msg>] => {
  return [
    {
      form: Form.init(new Map(settingsFormConfig(user))),
      errors: null,
      submitting: false,
    },
    Cmd.none(),
  ]
}

export const update =
  (token: string) =>
  (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'FormMsg':
        return [
          { ...model, form: Form.update(msg.msg)(model.form) },
          Cmd.none(),
        ]
      case 'Logout':
        return [model, Cmd.none()]
      case 'Submit': {
        const image = valueTextType(lookupForm('image', model.form.forms))
        const username = valueTextType(lookupForm('username', model.form.forms))
        const bio = valueTextType(lookupForm('bio', model.form.forms))
        const email = valueTextType(lookupForm('email', model.form.forms))
        const password = valueTextType(lookupForm('password', model.form.forms))

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
          { ...model, submitting: true, errors: null },
          attemptTE(
            updateUser(token, { user: userUpdate }),
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
