import * as RD from '@devexperts/remote-data-ts'
import * as Form from '@rinn7e/tea-cup-form'
import { lookupForm, valueTextType } from '@rinn7e/tea-cup-form'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Cmd } from 'tea-cup-fp'

import { createArticle, getArticle, updateArticle } from '@/api'
import { standardInputUi } from '@/component/form-fields'
import type { Shared } from '@/type'
import type { User } from '@/api/type'

import type { Model, Msg } from './type'

const editorFormConfig = (values: {
  title: string
  description: string
  body: string
  tagInput: string
}): [string, Form.FormType][] => [
  [
    'title',
    {
      _tag: 'TextType',
      placeholder: 'Article Title',
      label: 'Title',
      currentValue: values.title,
      validation: (s: string) => Form.nonEmptyValidator(s, 'Title'),
      linkValidations: [],
      showValidation: false,
      isTextarea: false,
      isPassword: O.none,
      isFocus: false,
      ui: standardInputUi(false, O.none, true),
    },
  ],
  [
    'description',
    {
      _tag: 'TextType',
      placeholder: "What's this article about?",
      label: 'Description',
      currentValue: values.description,
      validation: (s: string) => Form.nonEmptyValidator(s, 'Description'),
      linkValidations: [],
      showValidation: false,
      isTextarea: false,
      isPassword: O.none,
      isFocus: false,
      ui: standardInputUi(false, O.none, false),
    },
  ],
  [
    'body',
    {
      _tag: 'TextType',
      placeholder: 'Write your article (in markdown)',
      label: 'Body',
      currentValue: values.body,
      validation: (s: string) => Form.nonEmptyValidator(s, 'Body'),
      linkValidations: [],
      showValidation: false,
      isTextarea: true,
      isPassword: O.none,
      isFocus: false,
      ui: standardInputUi(true, O.none, false),
    },
  ],
  [
    'tagInput',
    {
      _tag: 'TextType',
      placeholder: 'Enter tags',
      label: 'Tags',
      currentValue: values.tagInput,
      validation: (s: string) => E.right(s),
      linkValidations: [],
      showValidation: false,
      isTextarea: false,
      isPassword: O.none,
      isFocus: false,
      ui: standardInputUi(false),
    },
  ],
]

const emptyEditorFormConfig = editorFormConfig({
  title: '',
  description: '',
  body: '',
  tagInput: '',
})

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

export const init = (
  user: User,
  slug: O.Option<string>,
): [Model, Cmd<Msg>] => {
  const initialForm = Form.init(new Map(emptyEditorFormConfig))
  const baseModel: Model = {
    slug: slug._tag === 'Some' ? slug.value : null,
    form: initialForm,
    tagList: [],
    requestRd: RD.initial,
    isFormValid: false,
  }

  const model = preprocessFormMsgHandler(initialForm)(baseModel)

  if (slug._tag === 'Some') {
    const token = O.some(user.token)
    return [
      { ...model, requestRd: RD.pending },
      attemptTE(
        getArticle(token, slug.value),
        (result): Msg => ({ _tag: 'GetArticleResponse', result }),
      ),
    ]
  }

  return [model, Cmd.none()]
}

export const update =
  (user: User) =>
  (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'FormMsg': {
        return [{ ...formMsgHandler(msg.subMsg)(model) }, Cmd.none()]
      }
      case 'GetArticleResponse':
        if (msg.result.tag === 'Ok') {
          const a = msg.result.value.article
          return [
            preprocessFormMsgHandler(
              Form.init(
                new Map(
                  editorFormConfig({
                    title: a.title,
                    description: a.description,
                    body: a.body ?? '',
                    tagInput: '',
                  }),
                ),
              ),
            )({ ...model, requestRd: RD.success(null), tagList: a.tagList }),
            Cmd.none(),
          ]
        }
        return [{ ...model, requestRd: RD.failure(msg.result.err) }, Cmd.none()]
      case 'AddTag': {
        const form = model.form
        const tagInput = valueTextType(
          lookupForm('tagInput', form.forms),
        ).trim()
        if (tagInput && !model.tagList.includes(tagInput)) {
          return [
            preprocessFormMsgHandler(
              Form.update({
                _tag: 'UpdateFormManual',
                key: 'tagInput',
                value: '',
              })(form),
            )({ ...model, tagList: [...model.tagList, tagInput] }),
            Cmd.none(),
          ]
        }
        return [model, Cmd.none()]
      }
      case 'RemoveTag':
        return [
          { ...model, tagList: model.tagList.filter((t) => t !== msg.tag) },
          Cmd.none(),
        ]
      case 'Submit': {
        const form = model.form
        const title = valueTextType(lookupForm('title', form.forms))
        const description = valueTextType(lookupForm('description', form.forms))
        const body = valueTextType(lookupForm('body', form.forms))

        const request = {
          article: { title, description, body, tagList: model.tagList },
        }
        const task = model.slug
          ? updateArticle(user.token, model.slug, request)
          : createArticle(user.token, request)

        return [
          { ...model, requestRd: RD.pending },
          attemptTE(
            task,
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
