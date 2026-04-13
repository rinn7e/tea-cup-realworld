import * as RD from '@devexperts/remote-data-ts';
import { Cmd } from 'tea-cup-fp';
import type { Model, Msg } from './type';
import { getArticle, getComments } from '../../api/service';
import { attemptTE } from '../../tea/util';

export const init = (slug: string): [Model, Cmd<Msg>] => {
  const model: Model = {
    article: RD.pending,
    comments: RD.pending,
  };

  return [
    model,
    Cmd.batch([
      attemptTE(getArticle(slug), (result): Msg => ({ _tag: 'GetArticleResponse', result })),
      attemptTE(getComments(slug), (result): Msg => ({ _tag: 'GetCommentsResponse', result })),
    ]),
  ];
};

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'GetArticleResponse':
      if (msg.result.tag === 'Ok') {
        return [{ ...model, article: RD.success(msg.result.value) }, Cmd.none()];
      } else {
        return [{ ...model, article: RD.failure(msg.result.err) }, Cmd.none()];
      }
    case 'GetCommentsResponse':
      if (msg.result.tag === 'Ok') {
        return [{ ...model, comments: RD.success(msg.result.value) }, Cmd.none()];
      } else {
        return [{ ...model, comments: RD.failure(msg.result.err) }, Cmd.none()];
      }
  }
};
