import * as RD from '@devexperts/remote-data-ts'
import * as Form from '@rinn7e/tea-cup-form'
import { lookupForm, valueTextType } from '@rinn7e/tea-cup-form'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { Cmd } from 'tea-cup-fp'

import { createArticle, getArticle, updateArticle } from '@/api'
import type { User } from '@/api/type'
import { standardInputUi } from '@/component/form-fields'

import type { Model, Msg } from './type'
import {
  editorBodyField,
  editorDescriptionField,
  editorTagInputField,
  editorTitleField,
} from './type'

const editorTitleFormItem = (title: string): [string, Form.FormType] => [
  editorTitleField,
  {
    _tag: 'TextType',
    placeholder: 'Article Title',
    label: 'Title',
    currentValue: title,
    validation: (s: string) => Form.nonEmptyValidator(s, 'Title'),
    linkValidations: [],
    showValidation: false,
    isTextarea: false,
    isPassword: O.none,
    isFocus: false,
    ui: standardInputUi(false, O.none, true),
  },
]

const editorDescriptionFormItem = (
  description: string,
): [string, Form.FormType] => [
  editorDescriptionField,
  {
    _tag: 'TextType',
    placeholder: "What's this article about?",
    label: 'Description',
    currentValue: description,
    validation: (s: string) => Form.nonEmptyValidator(s, 'Description'),
    linkValidations: [],
    showValidation: false,
    isTextarea: false,
    isPassword: O.none,
    isFocus: false,
    ui: standardInputUi(false, O.none, false),
  },
]

const editorBodyFormItem = (body: string): [string, Form.FormType] => [
  editorBodyField,
  {
    _tag: 'TextType',
    placeholder: 'Write your article (in markdown)',
    label: 'Body',
    currentValue: body,
    validation: (s: string) => Form.nonEmptyValidator(s, 'Body'),
    linkValidations: [],
    showValidation: false,
    isTextarea: true,
    isPassword: O.none,
    isFocus: false,
    ui: standardInputUi(true, O.none, false),
  },
]

const editorTagInputFormItem = (tagInput: string): [string, Form.FormType] => [
  editorTagInputField,
  {
    _tag: 'TextType',
    placeholder: 'Enter tags',
    label: 'Tags',
    currentValue: tagInput,
    validation: (s: string) => E.right(s),
    linkValidations: [],
    showValidation: false,
    isTextarea: false,
    isPassword: O.none,
    isFocus: false,
    ui: standardInputUi(false),
  },
]

const editorFormConfigForEdit = (values: {
  title: string
  description: string
  body: string
  tagInput: string
}): Form.Forms =>
  new Map([
    editorTitleFormItem(values.title),
    editorDescriptionFormItem(values.description),
    editorBodyFormItem(values.body),
    editorTagInputFormItem(values.tagInput),
  ])

const editorFormConfig = (): Form.Forms =>
  new Map([
    editorTitleFormItem(''),
    editorDescriptionFormItem(''),
    editorBodyFormItem(''),
    editorTagInputFormItem(''),
  ])

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

export const init = (user: User, slug: O.Option<string>): [Model, Cmd<Msg>] => {
  const initialForm = Form.init(editorFormConfig())
  const baseModel: Model = {
    slug: slug._tag === 'Some' ? slug.value : null,
    form: initialForm,
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
                editorFormConfigForEdit({
                  title: a.title,
                  description: a.description,
                  body: a.body ?? '',
                  tagInput: a.tagList.join(', '),
                }),
              ),
            )({ ...model, requestRd: RD.success(null) }),
            Cmd.none(),
          ]
        }
        return [{ ...model, requestRd: RD.failure(msg.result.err) }, Cmd.none()]

      case 'Submit': {
        const form = model.form
        const title = valueTextType(lookupForm(editorTitleField, form.forms))
        const description = valueTextType(
          lookupForm(editorDescriptionField, form.forms),
        )
        const body = valueTextType(lookupForm(editorBodyField, form.forms))
        const tagInput = valueTextType(
          lookupForm(editorTagInputField, form.forms),
        )
        const tagList = tagInput
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s !== '')

        const request = {
          article: { title, description, body, tagList },
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
