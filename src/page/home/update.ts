import * as RD from '@devexperts/remote-data-ts'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import { Cmd } from 'tea-cup-fp'

import { favoriteArticle, getArticles, getTags, unfavoriteArticle } from '@/api'
import {
  favoriteArticleUtil,
  unfavoriteArticleUtil,
} from '@/api/type/article'
import type { Shared } from '@/type'

import type { Model, Msg } from './type'

export const init = (shared: Shared): [Model, Cmd<Msg>] => {
  const model: Model = {
    articles: RD.pending,
    tags: RD.pending,
  }

  const articlesCmd = attemptTE(
    getArticles(shared.token),
    (result): Msg => ({ _tag: 'GetArticlesResponse', result }),
  )

  return [
    model,
    Cmd.batch([
      articlesCmd,
      attemptTE(
        getTags(shared.token),
        (result): Msg => ({ _tag: 'GetTagsResponse', result }),
      ),
    ]),
  ]
}

export const update =
  (shared: Shared) =>
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
        if (
          shared.token._tag === 'Some' &&
          model.articles._tag === 'RemoteSuccess'
        ) {
          return [
            {
              ...model,
              articles: RD.success({
                ...model.articles.value,
                articles: model.articles.value.articles.map((a) =>
                  a.slug === msg.slug ? favoriteArticleUtil(a) : a,
                ),
              }),
            },
            attemptTE(
              favoriteArticle(shared.token.value, msg.slug),
              (result): Msg => ({
                _tag: 'FavoriteArticleResponse',
                slug: msg.slug,
                result,
              }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'UnfavoriteArticle':
        if (
          shared.token._tag === 'Some' &&
          model.articles._tag === 'RemoteSuccess'
        ) {
          return [
            {
              ...model,
              articles: RD.success({
                ...model.articles.value,
                articles: model.articles.value.articles.map((a) =>
                  a.slug === msg.slug ? unfavoriteArticleUtil(a) : a,
                ),
              }),
            },
            attemptTE(
              unfavoriteArticle(shared.token.value, msg.slug),
              (result): Msg => ({
                _tag: 'UnfavoriteArticleResponse',
                slug: msg.slug,
                result,
              }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'FavoriteArticleResponse':
      case 'UnfavoriteArticleResponse':
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
        } else if (model.articles._tag === 'RemoteSuccess') {
          return [
            {
              ...model,
              articles: RD.success({
                ...model.articles.value,
                articles: model.articles.value.articles.map((a) =>
                  a.slug === msg.slug
                    ? msg._tag === 'FavoriteArticleResponse'
                      ? unfavoriteArticleUtil(a)
                      : favoriteArticleUtil(a)
                    : a,
                ),
              }),
            },
            Cmd.none(),
          ]
        }
        return [model, Cmd.none()]
    }
  }
