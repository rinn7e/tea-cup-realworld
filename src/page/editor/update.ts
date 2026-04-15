import * as FormUpdate from '@rinn7e/tea-cup-form'
import { lookupForm, valueTextType } from '@rinn7e/tea-cup-form'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import * as E from 'fp-ts/lib/Either'
import * as Map from 'fp-ts/lib/Map'
import * as O from 'fp-ts/lib/Option'
import * as S from 'fp-ts/lib/string'
import { Cmd } from 'tea-cup-fp'

import { createArticle, getArticle, updateArticle } from '../../api/service'
import type { Errors } from '../../api/type'
import { standardInputUi } from '../../component/form-fields'
import type { Model, Msg } from './type'

const initialForms = (
  dispatch: (msg: Msg) => void,
  initialValues?: {
    title: string
    description: string
    body: string
    tagInput: string
  },
): FormUpdate.Forms => {
  let forms: FormUpdate.Forms = Map.empty

  forms = Map.upsertAt(S.Eq)('title', {
    _tag: 'TextType',
    placeholder: 'Article Title',
    label: 'Title',
    currentValue: initialValues?.title || '',
    validation: (s: string) => FormUpdate.nonEmptyValidator(s, 'Title'),
    linkValidations: [],
    showValidation: false,
    isTextarea: false,
    isPassword: O.none,
    isFocus: false,
    onKeyDown: O.none,
    ui: standardInputUi(false),
  } as any)(forms)

  forms = Map.upsertAt(S.Eq)('description', {
    _tag: 'TextType',
    placeholder: "What's this article about?",
    label: 'Description',
    currentValue: initialValues?.description || '',
    validation: (s: string) => FormUpdate.nonEmptyValidator(s, 'Description'),
    linkValidations: [],
    showValidation: false,
    isTextarea: false,
    isPassword: O.none,
    isFocus: false,
    onKeyDown: O.none,
    ui: standardInputUi(false),
  } as any)(forms)

  forms = Map.upsertAt(S.Eq)('body', {
    _tag: 'TextType',
    placeholder: 'Write your article (in markdown)',
    label: 'Body',
    currentValue: initialValues?.body || '',
    validation: (s: string) => FormUpdate.nonEmptyValidator(s, 'Body'),
    linkValidations: [],
    showValidation: false,
    isTextarea: true,
    isPassword: O.none,
    isFocus: false,
    onKeyDown: O.none,
    ui: standardInputUi(true),
  } as any)(forms)

  const tagOnKeyDown = O.some((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      dispatch({ _tag: 'AddTag' })
    }
  })

  forms = Map.upsertAt(S.Eq)('tagInput', {
    _tag: 'TextType',
    placeholder: 'Enter tags',
    label: 'Tags',
    currentValue: initialValues?.tagInput || '',
    validation: (s: string) => E.right(s),
    linkValidations: [],
    showValidation: false,
    isTextarea: false,
    isPassword: O.none,
    isFocus: false,
    onKeyDown: tagOnKeyDown,
    ui: standardInputUi(false, tagOnKeyDown),
  } as any)(forms)

  return forms
}

export const init = (slug: O.Option<string>): [Model, Cmd<Msg>] => {
  // We need a dummy dispatcher for initial forms if we use it for tagInput onKeyDown
  // Or better, handle the Enter key in the View instead of the Model if the library allows.
  // But the library passes onKeyDown from the Model.
  // Actually, I'll pass a "mock" dispatcher since init doesn't have one, or just update it later.

  const model: Model = {
    slug: slug._tag === 'Some' ? slug.value : null,
    form: FormUpdate.init(initialForms(() => {})),
    tagList: [],
    submitting: false,
    errors: null,
  }

  if (slug._tag === 'Some') {
    return [
      { ...model, submitting: true },
      attemptTE(
        getArticle(slug.value),
        (result): Msg => ({ _tag: 'GetArticleResponse', result }),
      ),
    ]
  }

  return [model, Cmd.none()]
}

export const update =
  (token: string) =>
  (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    // For Editor, we might need to recreate forms with correct dispatcher on every update or once.
    // But TEA usually handles this via the dispatch function passed by the component.
    // Here, the onKeyDown closure captures the dispatch.

    switch (msg._tag) {
      case 'FormMsg':
        return [
          { ...model, form: FormUpdate.update(msg.msg)(model.form) },
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
              form: FormUpdate.init(
                initialForms(() => {}, {
                  title: a.title,
                  description: a.description,
                  body: a.body,
                  tagInput: '',
                }),
              ),
            },
            Cmd.none(),
          ]
        }
        return [{ ...model, submitting: false }, Cmd.none()]
      case 'AddTag': {
        const tagInput = valueTextType(
          lookupForm('tagInput', model.form.forms),
        ).trim()
        if (tagInput && !model.tagList.includes(tagInput)) {
          return [
            {
              ...model,
              tagList: [...model.tagList, tagInput],
              form: FormUpdate.update({
                _tag: 'UpdateFormManual',
                key: 'tagInput',
                value: '',
              })(model.form),
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
        const title = valueTextType(lookupForm('title', model.form.forms))
        const description = valueTextType(
          lookupForm('description', model.form.forms),
        )
        const body = valueTextType(lookupForm('body', model.form.forms))

        const request = {
          article: {
            title,
            description,
            body,
            tagList: model.tagList,
          },
        }

        const task = model.slug
          ? updateArticle(model.slug, request, token)
          : createArticle(request, token)

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
          const err = msg.result.err
          return [
            {
              ...model,
              submitting: false,
              errors: (err as Errors).errors
                ? (err as Errors)
                : { errors: { error: [String(err)] } },
            },
            Cmd.none(),
          ]
        }
    }
  }
