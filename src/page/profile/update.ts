import * as RD from '@devexperts/remote-data-ts'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import { Cmd } from 'tea-cup-fp'

import {
  favoriteArticle,
  followUser,
  getArticles,
  getProfile,
  unfavoriteArticle,
  unfollowUser,
} from '@/api'
import {
  favoriteArticleUtil,
  unfavoriteArticleUtil,
} from '@/api/type/article'
import type { Shared } from '@/type'

import type { Model, Msg } from './type'

export const init = (
  username: string,
  favorites: boolean,
  shared: Shared,
): [Model, Cmd<Msg>] => {
  const model: Model = {
    profile: RD.pending,
    articles: RD.pending,
    showFavorites: favorites,
  }

  const token = shared.token

  return [
    model,
    Cmd.batch([
      attemptTE(
        getProfile(token, username),
        (result): Msg => ({ _tag: 'GetProfileResponse', result }),
      ),
      attemptTE(
        getArticles(
          token,
          favorites ? { favorited: username } : { author: username },
        ),
        (result): Msg => ({ _tag: 'GetArticlesResponse', result }),
      ),
    ]),
  ]
}

export const update =
  (username: string, shared: Shared) =>
  (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    const token = shared.token
    switch (msg._tag) {
      case 'GetProfileResponse':
        if (msg.result.tag === 'Ok') {
          return [
            { ...model, profile: RD.success(msg.result.value) },
            Cmd.none(),
          ]
        } else {
          return [{ ...model, profile: RD.failure(msg.result.err) }, Cmd.none()]
        }
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
      case 'ToggleFavorites': {
        const newModel = {
          ...model,
          showFavorites: msg.show,
          articles: RD.pending,
        }
        return [
          newModel,
          attemptTE(
            getArticles(
              token,
              msg.show ? { favorited: username } : { author: username },
            ),
            (result): Msg => ({ _tag: 'GetArticlesResponse', result }),
          ),
        ]
      }
      case 'Follow':
        if (token._tag === 'Some') {
          return [
            model,
            attemptTE(
              followUser(token.value, username),
              (result): Msg => ({ _tag: 'GetProfileResponse', result }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'Unfollow':
        if (token._tag === 'Some') {
          return [
            model,
            attemptTE(
              unfollowUser(token.value, username),
              (result): Msg => ({ _tag: 'GetProfileResponse', result }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'FavoriteArticle':
        if (token._tag === 'Some' && model.articles._tag === 'RemoteSuccess') {
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
              favoriteArticle(token.value, msg.slug),
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
        if (token._tag === 'Some' && model.articles._tag === 'RemoteSuccess') {
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
              unfavoriteArticle(token.value, msg.slug),
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
