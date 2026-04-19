import * as RD from '@devexperts/remote-data-ts'
import { ArrayExtra, attemptTE } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Cmd } from 'tea-cup-fp'

import { getArticles, getTags } from '@/api'
import * as ArticleShort from '@/component/article-short'
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
