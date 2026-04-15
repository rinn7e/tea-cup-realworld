import * as RD from '@devexperts/remote-data-ts'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import type { Option } from 'fp-ts/lib/Option'
import { Cmd } from 'tea-cup-fp'

import {
  followUser,
  getArticles,
  getProfile,
  unfollowUser,
} from '@/api/service'
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

  const token = user._tag === 'Some' ? user.value.token : undefined

  return [
    model,
    Cmd.batch([
      attemptTE(
        getProfile(username, token),
        (result): Msg => ({ _tag: 'GetProfileResponse', result }),
      ),
      attemptTE(
        getArticles(favorites ? { favorited: username } : { author: username }),
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
              followUser(username, token.value),
              (result): Msg => ({
                _tag: 'GetProfileResponse',
                result: result as any,
              }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'Unfollow':
        if (token._tag === 'Some') {
          return [
            model,
            attemptTE(
              unfollowUser(username, token.value),
              (result): Msg => ({
                _tag: 'GetProfileResponse',
                result: result as any,
              }),
            ),
          ]
        }
        return [model, Cmd.none()]
    }
  }
