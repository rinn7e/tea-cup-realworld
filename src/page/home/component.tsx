import * as RD from '@devexperts/remote-data-ts'
import { cn } from '@rinn7e/tea-cup-prelude'
import { pipe } from 'fp-ts/lib/function'
import React from 'react'

import type {
  ArticlesResponse,
  HttpErrorString,
  TagsResponse,
} from '@/api/type'
import { ArticleShortView } from '@/component/article-short'
import { Link } from '@/component/link'
import { homePage } from '@/data/route'
import { memoStrategy } from '@/util/memo-strategy'

import { Props, PropsEq } from './type'

function HomeView({ model, dispatch }: Props) {
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
              <Link
                className='border-b-2 border-green-600 px-[16px] py-[8px] text-sm font-medium text-green-600'
                route={{ page: homePage() }}
              >
                Global Feed
              </Link>
            </div>

            <div className='flex flex-col'>
              {pipe(
                model.articles,
                RD.fold(
                  () => (
                    <div className='py-[24px] text-sm text-gray-500'>
                      Loading articles...
                    </div>
                  ),
                  () => (
                    <div className='py-[24px] text-sm text-gray-500'>
                      Loading articles...
                    </div>
                  ),
                  (err: HttpErrorString) => (
                    <div className='py-[24px] text-sm text-red-500'>
                      Error loading articles: {err.actualErr}
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
                          <ArticleShortView
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
              )}
            </div>
          </div>

          {/* Popular Tags */}
          <div className='w-full shrink-0 lg:w-[224px]'>
            <div className='flex flex-col gap-[12px] rounded-lg bg-gray-50 p-[16px]'>
              <p className='text-sm font-semibold text-gray-700'>
                Popular Tags
              </p>
              <div className='flex flex-wrap gap-[4px]'>
                {pipe(
                  model.tags,
                  RD.fold(
                    () => (
                      <span className='text-xs text-gray-400'>
                        Loading tags...
                      </span>
                    ),
                    () => (
                      <span className='text-xs text-gray-400'>
                        Loading tags...
                      </span>
                    ),
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
                            className='inline-block rounded-full bg-gray-200 px-[8px] py-[2px] text-xs text-gray-700 hover:bg-gray-300'
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

export const HomeViewMemo = memoStrategy(HomeView, PropsEq.equals)
