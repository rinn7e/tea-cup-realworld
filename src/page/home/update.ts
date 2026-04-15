import * as RD from '@devexperts/remote-data-ts'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import type { Option } from 'fp-ts/lib/Option'
import { Cmd } from 'tea-cup-fp'

import { favoriteArticle, getArticles, getTags, unfavoriteArticle } from '@/api'

import type { Model, Msg } from './type'

export const init = (token: Option<string> = O.none): [Model, Cmd<Msg>] => {
  const model: Model = {
    articles: RD.pending,
    tags: RD.pending,
  }

  const articlesCmd =
    // token._tag === 'Some'
    // ? attemptTE(
    //     getArticlesFeed({}, token.value),
    //     (result): Msg => ({ _tag: 'GetArticlesResponse', result }),
    //   )
    // :
    attemptTE(
      getArticles({}, token),
      (result): Msg => ({ _tag: 'GetArticlesResponse', result }),
    )

  return [
    model,
    Cmd.batch([
      articlesCmd,
      attemptTE(
        getTags(),
        (result): Msg => ({ _tag: 'GetTagsResponse', result }),
      ),
    ]),
  ]
}

export const update =
  (token: Option<string>) =>
  (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'GetArticlesResponse':
        if (msg.result.tag === 'Ok') {
          return [
            { ...model, articles: RD.success(msg.result.value) },
            Cmd.none(),
          ]
        } else {
          return [
            { ...model, articles: RD.failure(msg.result.err) },
            Cmd.none(),
          ]
        }
      case 'GetTagsResponse':
        if (msg.result.tag === 'Ok') {
          return [{ ...model, tags: RD.success(msg.result.value) }, Cmd.none()]
        } else {
          return [{ ...model, tags: RD.failure(msg.result.err) }, Cmd.none()]
        }
      case 'FavoriteArticle':
        if (token._tag === 'Some') {
          return [
            model,
            attemptTE(
              favoriteArticle(msg.slug, token.value),
              (result): Msg => ({ _tag: 'FavoriteArticleResponse', result }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'UnfavoriteArticle':
        if (token._tag === 'Some') {
          return [
            model,
            attemptTE(
              unfavoriteArticle(msg.slug, token.value),
              (result): Msg => ({ _tag: 'FavoriteArticleResponse', result }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'FavoriteArticleResponse':
        if (
          msg.result.tag === 'Ok' &&
          model.articles._tag === 'RemoteSuccess'
        ) {
          const updated = msg.result.value.article
          return [
            {
              ...model,
              articles: RD.success({
                ...model.articles.value,
                articles: model.articles.value.articles.map((a) =>
                  a.slug === updated.slug ? updated : a,
                ),
              }),
            },
            Cmd.none(),
          ]
        }
        return [model, Cmd.none()]
    }
  }
