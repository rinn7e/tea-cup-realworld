import * as RD from '@devexperts/remote-data-ts'
import { ArrayExtra, attemptTE } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Cmd } from 'tea-cup-fp'

import { followUser, getArticles, getProfile, unfollowUser } from '@/api'
import * as ArticleShort from '@/component/article-short'
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
    followRd: RD.initial,
    unfollowRd: RD.initial,
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
            { ...model, followRd: RD.pending },
            attemptTE(
              followUser(token.value, username),
              (result): Msg => ({ _tag: 'FollowResponse', result }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'FollowResponse':
        if (msg.result.tag === 'Ok') {
          return [
            {
              ...model,
              profile: RD.success(msg.result.value),
              followRd: RD.initial,
            },
            Cmd.none(),
          ]
        } else {
          return [
            { ...model, followRd: RD.failure(msg.result.err) },
            Cmd.none(),
          ]
        }
      case 'Unfollow':
        if (token._tag === 'Some') {
          return [
            { ...model, unfollowRd: RD.pending },
            attemptTE(
              unfollowUser(token.value, username),
              (result): Msg => ({ _tag: 'UnfollowResponse', result }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'UnfollowResponse':
        if (msg.result.tag === 'Ok') {
          return [
            {
              ...model,
              profile: RD.success(msg.result.value),
              unfollowRd: RD.initial,
            },
            Cmd.none(),
          ]
        } else {
          return [
            { ...model, unfollowRd: RD.failure(msg.result.err) },
            Cmd.none(),
          ]
        }
      case 'ArticleShortMsg':
        if (model.articles._tag === 'RemoteSuccess') {
          const articlesData = model.articles.value
          return pipe(
            articlesData.articles,
            A.findIndex((a) => a.slug === msg.slug),
            O.fold(
              () => [model, Cmd.none()],
              (index) => {
                const [updated, subCmd] = ArticleShort.update(shared)(
                  msg.subMsg,
                  articlesData.articles[index],
                )
                return [
                  {
                    ...model,
                    articles: RD.success({
                      ...articlesData,
                      articles: pipe(
                        articlesData.articles,
                        ArrayExtra.modifyAtIfExist(index, () => updated),
                      ),
                    }),
                  },
                  subCmd.map(
                    (m): Msg => ({
                      _tag: 'ArticleShortMsg',
                      slug: msg.slug,
                      subMsg: m,
                    }),
                  ),
                ]
              },
            ),
          )
        }
        return [model, Cmd.none()]
    }
  }
