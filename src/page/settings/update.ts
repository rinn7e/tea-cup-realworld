import * as FormUpdate from '@rinn7e/tea-cup-form'
import { lookupForm, valueTextType } from '@rinn7e/tea-cup-form'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import * as Map from 'fp-ts/lib/Map'
import * as O from 'fp-ts/lib/Option'
import * as S from 'fp-ts/lib/string'
import { Cmd } from 'tea-cup-fp'

import { updateUser } from '@/api'
import type { Errors, User } from '@/api/type'
import { standardInputUi } from '@/component/form-fields'

import type { Model, Msg } from './type'

export const init = (user: User): [Model, Cmd<Msg>] => {
  let forms: FormUpdate.Forms = Map.empty

  forms = Map.upsertAt(S.Eq)('image', {
    _tag: 'TextType',
    placeholder: 'URL of profile picture',
    label: 'Profile picture',
    currentValue: user.image || '',
    validation: (s: string) => FormUpdate.nonEmptyValidator(s, 'Image URL'),
    linkValidations: [],
    showValidation: false,
    isTextarea: false,
    isPassword: O.none,
    isFocus: false,
    onKeyDown: O.none,
    ui: standardInputUi(false, O.none, false),
  } as any)(forms)

  forms = Map.upsertAt(S.Eq)('username', {
    _tag: 'TextType',
    placeholder: 'Username',
    label: 'Username',
    currentValue: user.username,
    validation: (s: string) => FormUpdate.nonEmptyValidator(s, 'Username'),
    linkValidations: [],
    showValidation: false,
    isTextarea: false,
    isPassword: O.none,
    isFocus: false,
    onKeyDown: O.none,
    ui: standardInputUi(false),
  } as any)(forms)

  forms = Map.upsertAt(S.Eq)('bio', {
    _tag: 'TextType',
    placeholder: 'Short bio about you',
    label: 'Bio',
    currentValue: user.bio || '',
    validation: (s: string) => FormUpdate.nonEmptyValidator(s, 'Bio'),
    linkValidations: [],
    showValidation: false,
    isTextarea: true,
    isPassword: O.none,
    isFocus: false,
    onKeyDown: O.none,
    ui: standardInputUi(true),
  } as any)(forms)

  forms = Map.upsertAt(S.Eq)('email', {
    _tag: 'TextType',
    placeholder: 'Email',
    label: 'Email',
    currentValue: user.email,
    validation: (s: string) => FormUpdate.emailValidator(s),
    linkValidations: [],
    showValidation: false,
    isTextarea: false,
    isPassword: O.none,
    isFocus: false,
    onKeyDown: O.none,
    ui: standardInputUi(false),
  } as any)(forms)

  forms = Map.upsertAt(S.Eq)('password', {
    _tag: 'TextType',
    placeholder: 'New Password',
    label: 'Password',
    currentValue: '',
    validation: (s: string) => FormUpdate.minLengthValidator('Password', 8)(s),
    linkValidations: [],
    showValidation: false,
    isTextarea: false,
    isPassword: O.some({ revealPassword: false, disableAutocomplete: false }),
    isFocus: false,
    onKeyDown: O.none,
    ui: standardInputUi(false),
  } as any)(forms)

  return [
    {
      form: FormUpdate.init(forms),
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
          { ...model, form: FormUpdate.update(msg.msg)(model.form) },
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
        } = {
          image,
          username,
          bio,
          email,
        }
        if (password) {
          userUpdate.password = password
        }

        return [
          { ...model, submitting: true, errors: null },
          attemptTE(
            updateUser({ user: userUpdate }, token),
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
              errors: err,
            },
            Cmd.none(),
          ]
        }
    }
  }
