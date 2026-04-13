import * as RD from '@devexperts/remote-data-ts';
import { Cmd } from 'tea-cup-fp';
import type { Model, Msg } from './type';
import { getArticles, getTags } from '../../api/service';
import { attemptTE } from '@rinn7e/tea-cup-prelude';

export const init = (): [Model, Cmd<Msg>] => {
  const model: Model = {
    articles: RD.pending,
    tags: RD.pending,
  };

  return [
    model,
    Cmd.batch([
      attemptTE(getArticles(), (result): Msg => ({ _tag: 'GetArticlesResponse', result })),
      attemptTE(getTags(), (result): Msg => ({ _tag: 'GetTagsResponse', result })),
    ]),
  ];
};

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'GetArticlesResponse':
      if (msg.result.tag === 'Ok') {
        return [{ ...model, articles: RD.success(msg.result.value) }, Cmd.none()];
      } else {
        return [{ ...model, articles: RD.failure(msg.result.err) }, Cmd.none()];
      }
    case 'GetTagsResponse':
      if (msg.result.tag === 'Ok') {
        return [{ ...model, tags: RD.success(msg.result.value) }, Cmd.none()];
      } else {
        return [{ ...model, tags: RD.failure(msg.result.err) }, Cmd.none()];
      }
  }
};
