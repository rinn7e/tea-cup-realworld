import * as RD from '@devexperts/remote-data-ts'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import { type Option, none, some } from 'fp-ts/lib/Option'
import { Cmd } from 'tea-cup-fp'

import {
  favoriteArticle,
  followUser,
  getArticles,
  getProfile,
  unfavoriteArticle,
  unfollowUser,
} from '@/api'
import type { User } from '@/api/type'

import type { Model, Msg } from './type'

export const init = (
  username: string,
  favorites: boolean,
  user: Option<User>,
): [Model, Cmd<Msg>] => {
  const model: Model = {
    profile: RD.pending,
    articles: RD.pending,
    showFavorites: favorites,
  }

  const token = user._tag === 'Some' ? some(user.value.token) : none

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
  (username: string, token: Option<string>) =>
  (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
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
        if (token._tag === 'Some') {
          return [
            model,
            attemptTE(
              favoriteArticle(token.value, msg.slug),
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
              unfavoriteArticle(token.value, msg.slug),
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
