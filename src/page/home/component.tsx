import * as RD from '@devexperts/remote-data-ts'
import { Heart } from 'lucide-react'
import { pipe } from 'fp-ts/lib/function'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import type { ArticlesResponse, TagsResponse } from '@/api/type'
import { Link } from '@/component/link'
import { homePage } from '@/data/route'

import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const HomeView: React.FC<Props> = ({ model }) => {
  return (
    <div>
      <div className='bg-green-600 py-12 text-center text-white shadow-inner'>
        <div className='mx-auto max-w-6xl px-4'>
          <h1 className='text-5xl font-bold tracking-tight'>conduit</h1>
          <p className='mt-2 text-lg font-light opacity-90'>A place to share your knowledge.</p>
        </div>
      </div>

      <div className='mx-auto max-w-6xl px-4 py-6'>
        <div className='flex gap-6'>
          <div className='flex-1 min-w-0'>
            <div className='flex border-b border-gray-200'>
              <Link
                className='border-b-2 border-green-600 px-4 py-2 text-sm font-medium text-green-600'
                route={{ page: homePage() }}
              >
                Global Feed
              </Link>
            </div>

            {pipe(
              model.articles,
              RD.fold(
                () => <div className='py-6 text-sm text-gray-500'>Loading articles...</div>,
                () => <div className='py-6 text-sm text-gray-500'>Loading articles...</div>,
                (err: Error) => (
                  <div className='py-6 text-sm text-red-500'>
                    Error loading articles: {err.message}
                  </div>
                ),
                (data: ArticlesResponse) =>
                  data.articles.length === 0 ? (
                    <div className='py-6 text-sm text-gray-500'>No articles are here... yet.</div>
                  ) : (
                    <>
                      {data.articles.map((article) => (
                        <div key={article.slug} className='border-b border-gray-200 py-6'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
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
                                  src={
                                    article.author.image ||
                                    '/default-avatar.svg'
                                  }
                                  className='h-8 w-8 rounded-full object-cover'
                                  alt=''
                                />
                              </Link>
                              <div>
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
                            <button
                              type='button'
                              className='flex items-center gap-1 rounded border border-green-500 px-2 py-1 text-xs text-green-600 hover:bg-green-50'
                            >
                              <Heart size={12} />
                              {article.favoritesCount}
                            </button>
                          </div>
                          <Link
                            route={{
                              page: {
                                _tag: 'ArticlePage',
                                slug: article.slug,
                              },
                            }}
                            className='mt-3 block'
                          >
                            <h1 className='text-xl font-bold text-gray-900'>{article.title}</h1>
                            <p className='mt-1 text-sm text-gray-500'>{article.description}</p>
                            <div className='mt-3 flex items-center justify-between'>
                              <span className='text-xs text-gray-400'>Read more...</span>
                              <ul className='flex flex-wrap gap-1'>
                                {article.tagList.map((tag) => (
                                  <li
                                    key={tag}
                                    className='rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-400'
                                  >
                                    {tag}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </>
                  ),
              ),
            )}
          </div>

          <div className='w-56 shrink-0'>
            <div className='rounded-lg bg-gray-50 p-4'>
              <p className='mb-3 text-sm font-semibold text-gray-700'>Popular Tags</p>
              <div className='flex flex-wrap gap-1'>
                {pipe(
                  model.tags,
                  RD.fold(
                    () => <span className='text-xs text-gray-400'>Loading tags...</span>,
                    () => <span className='text-xs text-gray-400'>Loading tags...</span>,
                    () => <span className='text-xs text-red-400'>Error loading tags</span>,
                    (data: TagsResponse) => (
                      <>
                        {data.tags.map((tag) => (
                          <a
                            key={tag}
                            href='#'
                            className='inline-block rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700 hover:bg-gray-300'
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
