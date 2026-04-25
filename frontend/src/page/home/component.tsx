import * as RD from '@devexperts/remote-data-ts'
import { cn } from '@rinn7e/tea-cup-prelude'
import { pipe } from 'fp-ts/lib/function'
import React from 'react'
import { Dispatcher } from 'tea-cup-fp'

import type { ApiError, ArticlesResponse, HttpError, TagsResponse } from '@/api/type'
import { ArticleShortComponent } from '@/component/article-short/component'
import { DotLoading } from '@/component/dot-loading'
import { ErrorMessages } from '@/component/error-messages'
import { memoStrategy } from '@/util/memo-strategy'

import { Msg, Props, PropsEq } from './type'

const HomePageComponent = ({ model, dispatch }: Props) => {
  return (
    <div className='flex min-h-full flex-col'>
      {/* Hero Section */}
      <div className='bg-green-600 py-[48px] text-center text-white shadow-inner'>
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
            <div className='flex border-b border-gray-200'>
              {renderTabView(model.tab === 'user-feed', 'Your Feed', () =>
                dispatch({ _tag: 'ChangeTab', tab: 'user-feed' }),
              )}
              {renderTabView(model.tab === 'global-feed', 'Global Feed', () =>
                dispatch({ _tag: 'ChangeTab', tab: 'global-feed' }),
              )}
            </div>

            <div className='flex flex-col'>
              {renderArticlesView(model.articles, dispatch)}
              {renderPagination(model.page, model.pageAmount, dispatch)}
            </div>
          </div>

          {/* Popular Tags */}
          <div className='sidebar w-full shrink-0 lg:w-[224px]'>
            <div className='flex flex-col gap-[12px] rounded-lg bg-gray-50 p-[16px]'>
              <p className='text-sm font-semibold text-gray-700'>
                Popular Tags
              </p>
              <div className='tag-list flex flex-wrap gap-[4px]'>
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
                      <>
                        {data.tags.map((tag) => (
                          <a
                            key={tag}
                            href='#'
                            className='tag-default tag-pill inline-block rounded-full bg-gray-200 px-[8px] py-[2px] text-xs text-gray-700 hover:bg-gray-300'
                          >
                            {tag}
                          </a>
                        ))}
                      </>
                    ),
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const renderTabView = (active: boolean, label: string, onClick: () => void) => {
  return (
    <button
      type='button'
      className={cn(
        'px-[16px] py-[8px] text-sm font-medium transition-colors duration-200',
        active
          ? 'border-b-2 border-green-600 text-green-600'
          : 'text-gray-400 hover:text-gray-600',
      )}
      onClick={onClick}
    >
      {label}
    </button>
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
          <div className='py-[24px] text-sm text-gray-500'>
            No articles are here... yet.
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

  const pages = Array.from({ length: pageAmount }, (_, i) => i + 1)

  return (
    <nav className='my-[24px]'>
      <ul className='pagination flex w-fit flex-wrap rounded-md border border-gray-200'>
        {pages.map((p) => (
          <li
            key={p}
            className='page-item border-r border-gray-200 last:border-r-0'
          >
            <button
              type='button'
              className={cn(
                'flex h-[38px] min-w-[38px] items-center justify-center px-[12px] text-sm transition-colors duration-200 hover:bg-gray-100 focus:outline-none',
                p === currentPage
                  ? 'bg-gray-200 font-medium text-gray-700'
                  : 'text-green-600',
              )}
              onClick={() => dispatch({ _tag: 'ChangePage', page: p })}
            >
              {p}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export const HomePageMemo = memoStrategy(HomePageComponent, PropsEq.equals)
