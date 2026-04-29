import * as RD from '@devexperts/remote-data-ts'
import { cn } from '@rinn7e/tea-cup-prelude'
import { pipe } from 'fp-ts/lib/function'
import React from 'react'
import { Dispatcher } from 'tea-cup-fp'

import type {
  ApiError,
  ArticlesResponse,
  HttpError,
  TagsResponse,
} from '@/api/type'
import { ArticleShortComponent } from '@/component/article-short/component'
import { DotLoading } from '@/component/dot-loading'
import { ErrorMessages } from '@/component/error-messages'
import { Link } from '@/component/link'
import {
  AppRoute,
  globalFeedTab,
  homePage,
  tagFeedTab,
  userFeedTab,
} from '@/data/route/type'
import { memoStrategy } from '@/util/memo-strategy'

import { Msg, Props, PropsEq } from './type'

const HomePageComponent = ({ model, dispatch }: Props) => {
  return (
    <div className='flex min-h-full flex-col'>
      {/* Hero Section */}
      <div
        className='banner bg-green-600 py-[48px] text-center text-white shadow-inner'
        data-test='hero-banner'
      >
        <div className='mx-auto flex max-w-[1152px] flex-col gap-[8px] px-[16px]'>
          <h1 className='text-4xl font-bold tracking-tight lg:text-5xl'>
            conduit
          </h1>
          <p className='text-base font-light opacity-90 lg:text-lg'>
            A place to share your knowledge.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className='mx-auto w-full max-w-[1152px] px-[16px] py-[24px]'>
        <div
          className={cn(
            // shared
            'flex flex-col gap-[24px]',
            // desktop
            'lg:flex-row lg:gap-[48px]',
          )}
        >
          {/* Article List */}
          <div className='flex min-w-0 flex-1 flex-col'>
            <div
              className='flex border-b border-gray-200'
              data-test='feed-toggle'
            >
              {renderTabView(model.tab._tag === 'UserFeedTab', 'Your Feed', {
                page: homePage(userFeedTab()),
              })}
              {renderTabView(
                model.tab._tag === 'GlobalFeedTab',
                'Global Feed',
                { page: homePage(globalFeedTab()) },
              )}
              {model.tab._tag === 'TagFeedTab' &&
                renderTabView(true, `# ${model.tab.tag}`, {
                  page: homePage(tagFeedTab(model.tab.tag)),
                })}
            </div>

            <div className='flex flex-col'>
              {renderArticlesView(model.articles, dispatch)}
              {renderPagination(model.page, model.pageAmount, dispatch)}
            </div>
          </div>

          {/* Popular Tags */}
          <div
            className='w-full shrink-0 lg:w-[224px]'
            data-test='home-sidebar'
          >
            <div
              className='flex flex-col gap-[12px] rounded-lg bg-gray-50 p-[16px]'
              data-test='popular-tags'
            >
              <p className='text-sm font-semibold text-gray-700'>
                Popular Tags
              </p>
              {pipe(
                model.tags,
                RD.fold(
                  () => <DotLoading className='text-2xl text-gray-400' />,
                  () => <DotLoading className='text-2xl text-gray-400' />,
                  () => (
                    <span className='text-xs text-red-400'>
                      Error loading tags
                    </span>
                  ),
                  (data: TagsResponse) => (
                    <div
                      className='flex flex-wrap gap-[4px]'
                      data-test='tag-list'
                    >
                      {data.tags.map((tag) => (
                        <a
                          key={tag}
                          href='#'
                          className='inline-block rounded-full bg-gray-200 px-[8px] py-[2px] text-xs text-gray-700 hover:bg-gray-300'
                          data-test='tag-pill'
                          onClick={(e) => {
                            e.preventDefault()
                            dispatch({
                              _tag: 'ChangeTab',
                              tab: tagFeedTab(tag),
                            })
                          }}
                        >
                          {tag}
                        </a>
                      ))}
                    </div>
                  ),
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const renderTabView = (active: boolean, label: string, route: AppRoute) => {
  return (
    <Link
      route={route}
      className={cn(
        'border-b-2 px-4 py-2 font-medium transition-colors',
        active
          ? 'border-green-500 text-green-500'
          : 'border-transparent text-gray-500 hover:text-gray-700',
      )}
      data-test='home-tab'
      aria-current={active ? 'page' : undefined}
    >
      {label}
    </Link>
  )
}

const renderArticlesView = (
  articles: RD.RemoteData<HttpError<ApiError>, ArticlesResponse>,
  dispatch: Dispatcher<Msg>,
) => {
  return pipe(
    articles,
    RD.fold(
      () => (
        <div className='py-[24px]'>
          <DotLoading className='text-2xl text-green-600' />
        </div>
      ),
      () => (
        <div className='py-[24px]'>
          <DotLoading className='text-2xl text-green-600' />
        </div>
      ),
      (err: HttpError<ApiError>) => (
        <div className='py-[24px]'>
          <ErrorMessages error={err} />
        </div>
      ),
      (data: ArticlesResponse) =>
        data.articles.length === 0 ? (
          <div
            className='py-[24px] text-sm text-gray-500'
            data-test='empty-feed-msg'
          >
            Your feed is empty... yet. Why not check out the{' '}
            <Link
              route={{ page: homePage() }}
              className='text-green-600 hover:underline'
            >
              Global Feed
            </Link>
            ?
          </div>
        ) : (
          <div className='flex flex-col'>
            {data.articles.map((article) => (
              <ArticleShortComponent
                key={article.slug}
                model={article}
                dispatch={(subMsg) =>
                  dispatch({
                    _tag: 'ArticleShortMsg',
                    slug: article.slug,
                    subMsg,
                  })
                }
              />
            ))}
          </div>
        ),
    ),
  )
}

const renderPagination = (
  currentPage: number,
  pageAmount: number,
  dispatch: Dispatcher<Msg>,
) => {
  if (pageAmount <= 1) {
    return null
  }

  const pages: ReadonlyArray<number | string> = pipe(pageAmount, (amount) => {
    // If we have 7 or fewer pages, show all of them without truncation
    if (amount <= 7) {
      return Array.from({ length: amount }, (_, i) => i + 1)
    }
    // If current page is near the beginning, show first 5 pages and truncate the rest
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, '...', amount]
    }
    // If current page is near the end, truncate early pages and show the last 5
    if (currentPage >= amount - 3) {
      return [1, '...', amount - 4, amount - 3, amount - 2, amount - 1, amount]
    }
    // If current page is in the middle, truncate both sides around the current page
    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      amount,
    ]
  })

  return (
    <nav className='my-[24px]' data-test='pagination-nav'>
      <ul className='flex w-fit flex-wrap rounded-md border border-gray-200'>
        {pages.map((p, index) => {
          if (p === '...') {
            return (
              <li
                key={`ellipsis-${index}`}
                className='border-r border-gray-200 last:border-r-0'
              >
                <span className='flex h-[38px] min-w-[38px] items-center justify-center px-[12px] text-sm text-gray-500'>
                  ...
                </span>
              </li>
            )
          }

          return (
            <li
              key={p}
              className='border-r border-gray-200 last:border-r-0'
              data-test='pagination-item'
            >
              <button
                type='button'
                className={cn(
                  'flex h-[38px] min-w-[38px] items-center justify-center px-[12px] text-sm transition-colors duration-200 hover:bg-gray-100 focus:outline-none',
                  p === currentPage
                    ? 'bg-gray-200 font-medium text-gray-700'
                    : 'text-green-600',
                )}
                aria-current={p === currentPage ? 'page' : undefined}
                onClick={() =>
                  dispatch({ _tag: 'ChangePage', page: p as number })
                }
              >
                {p}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export const HomePageMemo = memoStrategy(HomePageComponent, PropsEq.equals)
