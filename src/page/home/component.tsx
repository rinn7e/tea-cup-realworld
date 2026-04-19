import * as RD from '@devexperts/remote-data-ts'
import { cn } from '@rinn7e/tea-cup-prelude'
import { pipe } from 'fp-ts/lib/function'
import { Heart } from 'lucide-react'
import React from 'react'

import type {
  ArticlesResponse,
  HttpErrorString,
  TagsResponse,
} from '@/api/type'
import { favButtonView } from '@/component/fav-button'
import { Link } from '@/component/link'
import { homePage } from '@/data/route'
import { assetPath } from '@/util'
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
                          <div
                            key={article.slug}
                            className='flex flex-col gap-[12px] border-b border-gray-200 py-[24px]'
                          >
                            <div className='flex items-center justify-between'>
                              <div className='flex items-center gap-[12px]'>
                                <Link
                                  route={{
                                    page: {
                                      _tag: 'ProfilePage',
                                      username: article.author.username,
                                      favorites: false,
                                    },
                                  }}
                                >
                                  <img
                                    src={assetPath(
                                      article.author.image ||
                                        '/default-avatar.svg',
                                    )}
                                    className='h-[32px] w-[32px] rounded-full object-cover'
                                    alt=''
                                  />
                                </Link>
                                <div className='flex flex-col'>
                                  <Link
                                    route={{
                                      page: {
                                        _tag: 'ProfilePage',
                                        username: article.author.username,
                                        favorites: false,
                                      },
                                    }}
                                    className='block text-sm font-medium text-green-600 hover:underline'
                                  >
                                    {article.author.username}
                                  </Link>
                                  <span className='text-xs text-gray-400'>
                                    {new Date(article.createdAt).toDateString()}
                                  </span>
                                </div>
                              </div>
                              {favButtonView({
                                favorited: article.favorited,
                                favoritesCount: article.favoritesCount,
                                onClick: () =>
                                  dispatch({
                                    _tag: article.favorited
                                      ? 'UnfavoriteArticle'
                                      : 'FavoriteArticle',
                                    slug: article.slug,
                                  }),
                              })}
                            </div>
                            <Link
                              route={{
                                page: {
                                  _tag: 'ArticlePage',
                                  slug: article.slug,
                                },
                              }}
                              className='flex flex-col gap-[12px]'
                            >
                              <div className='flex flex-col gap-[4px]'>
                                <h1 className='line-clamp-2 text-xl font-bold text-gray-900'>
                                  {article.title}
                                </h1>
                                <p className='line-clamp-3 text-sm text-gray-500'>
                                  {article.description}
                                </p>
                              </div>
                              <div className='flex items-center justify-between'>
                                <span className='text-xs text-gray-400'>
                                  Read more...
                                </span>
                                <ul className='flex flex-wrap gap-[4px]'>
                                  {article.tagList.map((tag) => (
                                    <li
                                      key={tag}
                                      className='rounded-full border border-gray-300 px-[8px] py-[2px] text-xs text-gray-400'
                                    >
                                      {tag}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </Link>
                          </div>
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
