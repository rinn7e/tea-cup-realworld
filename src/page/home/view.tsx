import * as RD from '@devexperts/remote-data-ts'
import { HeartIcon } from '@heroicons/react/24/solid'
import { pipe } from 'fp-ts/lib/function'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import type { ArticlesResponse, TagsResponse } from '../../api/type'
import { Link } from '../../component/link'
import { homePage } from '../../data/route'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const HomeView: React.FC<Props> = ({ model }) => {
  return (
    <div className='home-page'>
      <div className='banner bg-brand-primary mb-8 py-8 text-white'>
        <div className='container mx-auto px-4 text-center'>
          <h1 className='mb-2 font-sans text-5xl font-bold shadow-sm'>
            conduit
          </h1>
          <p className='text-xl font-light'>A place to share your knowledge.</p>
        </div>
      </div>

      <div className='container mx-auto px-4'>
        <div className='-mx-4 flex flex-wrap'>
          <div className='w-full px-4 md:w-3/4'>
            <div className='feed-toggle mb-4'>
              <ul className='flex border-b'>
                <li className='mr-1'>
                  <Link
                    className='text-brand-primary border-brand-primary inline-block border-b-2 bg-white px-4 py-2 font-medium'
                    route={{ page: homePage() }}
                  >
                    Global Feed
                  </Link>
                </li>
              </ul>
            </div>

            {pipe(
              model.articles,
              RD.fold(
                () => <div>Loading articles...</div>,
                () => <div>Loading articles...</div>,
                (err: Error) => (
                  <div className='text-red-500'>
                    Error loading articles: {err.message}
                  </div>
                ),
                (data: ArticlesResponse) => (
                  <div className='article-list'>
                    {data.articles.length === 0 ? (
                      <div className='py-4'>No articles are here... yet.</div>
                    ) : (
                      data.articles.map((article) => (
                        <div
                          key={article.slug}
                          className='article-preview border-t py-6 first:border-t-0'
                        >
                          <div className='article-meta mb-4 flex items-center'>
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
                                  'https://api.realworld.io/images/smiley-cyrus.jpeg'
                                }
                                className='h-8 w-8 rounded-full'
                                alt=''
                              />
                            </Link>
                            <div className='info ml-2 flex-grow'>
                              <Link
                                route={{
                                  page: {
                                    _tag: 'ProfilePage',
                                    username: article.author.username,
                                    favorites: false,
                                  },
                                }}
                                className='text-brand-primary block font-medium hover:underline'
                              >
                                {article.author.username}
                              </Link>
                              <span className='text-xs text-gray-400'>
                                {new Date(article.createdAt).toDateString()}
                              </span>
                            </div>
                            <button
                              type='button'
                              className='btn btn-sm outline-brand-primary border-brand-primary text-brand-primary hover:bg-brand-primary flex items-center gap-1 rounded border px-2 py-1 text-sm transition-colors hover:text-white'
                            >
                              <HeartIcon className='h-4 w-4' />{' '}
                              {article.favoritesCount}
                            </button>
                          </div>
                          <Link
                            route={{
                              page: { _tag: 'ArticlePage', slug: article.slug },
                            }}
                            className='preview-link'
                          >
                            <h1 className='mb-1 text-2xl font-bold'>
                              {article.title}
                            </h1>
                            <p className='mb-4 font-light text-gray-400'>
                              {article.description}
                            </p>
                            <span className='text-xs font-light text-gray-400'>
                              Read more...
                            </span>
                            <ul className='tag-list float-right flex space-x-1'>
                              {article.tagList.map((tag) => (
                                <li
                                  key={tag}
                                  className='tag-default tag-pill tag-outline'
                                >
                                  {tag}
                                </li>
                              ))}
                            </ul>
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                ),
              ),
            )}
          </div>

          <div className='w-full px-4 md:w-1/4'>
            <div className='sidebar rounded bg-gray-100 p-4'>
              <p className='mb-3 font-medium'>Popular Tags</p>
              <div className='tag-list flex flex-wrap'>
                {pipe(
                  model.tags,
                  RD.fold(
                    () => <div>Loading tags...</div>,
                    () => <div>Loading tags...</div>,
                    () => <div>Error loading tags</div>,
                    (data: TagsResponse) => (
                      <>
                        {data.tags.map((tag) => (
                          <span key={tag} className='tag-pill cursor-pointer'>
                            {tag}
                          </span>
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
