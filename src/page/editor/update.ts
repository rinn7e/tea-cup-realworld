import * as Form from '@rinn7e/tea-cup-form'
import { lookupForm, valueTextType } from '@rinn7e/tea-cup-form'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Cmd } from 'tea-cup-fp'

import type { Shared } from '@/type'

import { createArticle, getArticle, updateArticle } from '@/api'
import type { User } from '@/api/type'
import { standardInputUi } from '@/component/form-fields'

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

const emptyFormConfig = editorFormConfig({
  title: '',
  description: '',
  body: '',
  tagInput: '',
})

export const init = (
  slug: O.Option<string>,
  shared: Shared,
): [Model, Cmd<Msg>] => {
  const model: Model = {
    slug: slug._tag === 'Some' ? slug.value : null,
    form: pipe(
      shared.user,
      O.map(() => Form.init(new Map(emptyFormConfig))),
    ),
    tagList: [],
    submitting: false,
    errors: null,
  }

  if (slug._tag === 'Some') {
    return [
      { ...model, submitting: true },
      attemptTE(
        getArticle(shared.token, slug.value),
        (result): Msg => ({ _tag: 'GetArticleResponse', result }),
      ),
    ]
  }

  return [model, Cmd.none()]
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
      case 'GetArticleResponse':
        if (msg.result.tag === 'Ok') {
          const a = msg.result.value.article
          return [
            {
              ...model,
              submitting: false,
              tagList: a.tagList,
              form: O.some(
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
              ),
            },
            Cmd.none(),
          ]
        }
        return [{ ...model, submitting: false }, Cmd.none()]
      case 'AddTag': {
        if (model.form._tag === 'None') return [model, Cmd.none()]
        const form = model.form.value
        const tagInput = valueTextType(
          lookupForm('tagInput', form.forms),
        ).trim()
        if (tagInput && !model.tagList.includes(tagInput)) {
          return [
            {
              ...model,
              tagList: [...model.tagList, tagInput],
              form: O.some(
                Form.update({
                  _tag: 'UpdateFormManual',
                  key: 'tagInput',
                  value: '',
                })(form),
              ),
            },
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
        if (model.form._tag === 'None' || shared.token._tag === 'None')
          return [model, Cmd.none()]
        const form = model.form.value
        const title = valueTextType(lookupForm('title', form.forms))
        const description = valueTextType(lookupForm('description', form.forms))
        const body = valueTextType(lookupForm('body', form.forms))

        const request = {
          article: { title, description, body, tagList: model.tagList },
        }
        const task = model.slug
          ? updateArticle(shared.token.value, model.slug, request)
          : createArticle(shared.token.value, request)

        return [
          { ...model, submitting: true, errors: null },
          attemptTE(
            task,
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
