import { Cmd } from 'tea-cup-fp';
import type { Model, Msg } from './type';
import { createArticle, updateArticle, getArticle } from '../../api/service';
import { attemptTE } from '../../tea/util';
import type { Option } from 'fp-ts/lib/Option';
import * as TE from 'fp-ts/lib/TaskEither';

export const init = (slug: Option<string>): [Model, Cmd<Msg>] => {
  const model: Model = {
    slug: slug._tag === 'Some' ? slug.value : null,
    title: '',
    description: '',
    body: '',
    tagList: [],
    tagInput: '',
    submitting: false,
    errors: null,
  };

  if (slug._tag === 'Some') {
    return [
      { ...model, submitting: true },
      attemptTE(getArticle(slug.value), (result): Msg => ({ _tag: 'GetArticleResponse', result })),
    ];
  }

  return [model, Cmd.none()];
};

export const update = (token: string) => (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'SetTitle':
      return [{ ...model, title: msg.value }, Cmd.none()];
    case 'SetDescription':
      return [{ ...model, description: msg.value }, Cmd.none()];
    case 'SetBody':
      return [{ ...model, body: msg.value }, Cmd.none()];
    case 'SetTagInput':
      return [{ ...model, tagInput: msg.value }, Cmd.none()];
    case 'AddTag':
      if (model.tagInput && !model.tagList.includes(model.tagInput)) {
        return [{ ...model, tagList: [...model.tagList, model.tagInput], tagInput: '' }, Cmd.none()];
      }
      return [model, Cmd.none()];
    case 'RemoveTag':
      return [{ ...model, tagList: model.tagList.filter(t => t !== msg.tag) }, Cmd.none()];
    case 'GetArticleResponse':
      if (msg.result.tag === 'Ok') {
        const a = msg.result.value.article;
        return [
          {
            ...model,
            submitting: false,
            title: a.title,
            description: a.description,
            body: a.body,
            tagList: a.tagList,
          },
          Cmd.none()
        ];
      }
      return [{ ...model, submitting: false }, Cmd.none()];
    case 'Submit': {
      const articleData = {
        title: model.title,
        description: model.description,
        body: model.body,
        tagList: model.tagList,
      };

      const task = model.slug
        ? updateArticle(model.slug, articleData, token)
        : createArticle(articleData, token);

      return [
        { ...model, submitting: true, errors: null },
        attemptTE(task as TE.TaskEither<any, any>, (result): Msg => ({ _tag: 'SubmitResponse', result: result as any })),
      ];
    }
    case 'SubmitResponse':
      if (msg.result.tag === 'Ok') {
        return [{ ...model, submitting: false }, Cmd.none()];
      } else {
        const err = msg.result.err;
        return [
          {
            ...model,
            submitting: false,
            errors: (err as any).errors ? (err as any) : { errors: { 'error': [String(err)] } }
          },
          Cmd.none()
        ];
      }
  }
};
