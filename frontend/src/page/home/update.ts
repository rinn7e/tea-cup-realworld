import * as RD from '@devexperts/remote-data-ts'
import { ArrayExtra, attemptTE, cmdSucceed } from '@rinn7e/tea-cup-prelude'
import * as A from 'fp-ts/lib/Array'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Cmd } from 'tea-cup-fp'

import { getArticles, getArticlesFeed, getTags } from '@/api'
import * as ArticleShort from '@/component/article-short'
import type { Shared } from '@/type'
import { HomeTab, HomeTabEq } from '@/data/route/type'

import type { Model, Msg } from './type'
import { GET_ARTICLES_LIMIT } from './type'

export const init = (
  tab: HomeTab,
  page: number,
  shared: Shared,
): [Model, Cmd<Msg>] => {
  const model: Model = {
    articles: RD.pending,
    tags: RD.pending,
    tab,
    page,
    pageAmount: 0,
  }

  return [
    model,
    Cmd.batch([
      getArticlesBaseOnTabCmd(
        tab,
        shared,
        getOffsetBaseOnPage(page),
        GET_ARTICLES_LIMIT,
      ),

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
            {
              ...model,
              articles: RD.success(msg.result.value),
              pageAmount: getPageAmountFromArticlesCount(
                msg.result.value.articlesCount,
              ),
            },
            msg.shouldScrollToTop ? scrollToTopCmd() : Cmd.none(),
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
      case 'ChangeTab': {
        if (HomeTabEq.equals(msg.tab, model.tab)) {
          return [model, Cmd.none()]
        }
        const newModel: Model = {
          ...model,
          tab: msg.tab,
          articles: RD.pending,
          page: 1,
          pageAmount: 0,
        }

        return [
          newModel,
          getArticlesBaseOnTabCmd(
            msg.tab,
            shared,
            getOffsetBaseOnPage(1),
            GET_ARTICLES_LIMIT,
            true,
          ),
        ]
      }

      case 'ChangePage': {
        const newModel: Model = {
          ...model,
          page: msg.page,
        }
        return [
          newModel,
          getArticlesBaseOnTabCmd(
            model.tab,
            shared,
            getOffsetBaseOnPage(msg.page),
            GET_ARTICLES_LIMIT,
            true,
          ),
        ]
      }
      case 'NoOp':
        return [model, Cmd.none()]
    }
  }

const getArticlesBaseOnTabCmd = (
  tab: HomeTab,
  shared: Shared,
  offset: number,
  limit: number,
  shouldScrollToTop?: true,
): Cmd<Msg> => {
  switch (tab._tag) {
    case 'GlobalFeedTab':
      return attemptTE(
        getArticles(shared.token, { offset, limit }),
        (result): Msg => ({
          _tag: 'GetArticlesResponse',
          result,
          shouldScrollToTop,
        }),
      )
    case 'UserFeedTab':
      return pipe(
        shared.token,
        O.fold(
          () => Cmd.none<Msg>(),
          (token) =>
            attemptTE(
              getArticlesFeed(token, { offset, limit }),
              (result): Msg => ({
                _tag: 'GetArticlesResponse',
                result,
                shouldScrollToTop,
              }),
            ),
        ),
      )
    case 'TagFeedTab':
      return attemptTE(
        getArticles(shared.token, { offset, limit, tag: tab.tag }),
        (result): Msg => ({
          _tag: 'GetArticlesResponse',
          result,
          shouldScrollToTop,
        }),
      )
  }
}

const scrollToTopCmd = (): Cmd<Msg> =>
  cmdSucceed(() =>
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    }),
  )

const getOffsetBaseOnPage = (page: number): number =>
  (page - 1) * GET_ARTICLES_LIMIT

const getPageAmountFromArticlesCount = (articlesCount: number): number =>
  Math.ceil(articlesCount / GET_ARTICLES_LIMIT)
