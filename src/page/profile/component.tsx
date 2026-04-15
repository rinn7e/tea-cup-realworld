import * as RD from '@devexperts/remote-data-ts'
import { Cog6ToothIcon, PlusIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { pipe } from 'fp-ts/lib/function'
import React from 'react'

import type { ArticlesResponse, ProfileResponse } from '@/api/type'
import { Link } from '@/component/link'

import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: (msg: Msg) => void
  isCurrentUser: boolean
}

export const ProfileView: React.FC<Props> = ({
  model,
  dispatch,
  isCurrentUser,
}) => {
  return (
    <div className='profile-page'>
      {pipe(
        model.profile,
        RD.fold(
          () => <div className='p-8 text-center'>Loading profile...</div>,
          () => <div className='p-8 text-center'>Loading profile...</div>,
          (err: Error) => (
            <div className='p-8 text-center text-red-500'>
              Error loading profile: {err.message}
            </div>
          ),
          (data: ProfileResponse) => (
            <>
              <div className='user-info mb-8 bg-gray-100 py-8 text-center'>
                <div className='container mx-auto px-4'>
                  <img
                    src={
                      data.profile.image ||
                      'https://api.realworld.io/images/smiley-cyrus.jpeg'
                    }
                    className='mx-auto mb-4 h-24 w-24 rounded-full'
                    alt=''
                  />
                  <h4 className='mb-2 text-2xl font-bold'>
                    {data.profile.username}
                  </h4>
                  <p className='mb-4 font-light text-gray-400'>
                    {data.profile.bio}
                  </p>

                  <div className='container mx-auto flex justify-end px-4'>
                    {isCurrentUser ? (
                      <Link
                        route={{ page: { _tag: 'SettingsPage' } }}
                        className='btn btn-sm flex items-center gap-1 rounded border border-gray-400 px-2 py-1 text-sm text-gray-400 transition-colors hover:bg-gray-200'
                      >
                        <Cog6ToothIcon className='h-4 w-4' /> Edit Profile
                        Settings
                      </Link>
                    ) : (
                      <button
                        type='button'
                        className={`btn btn-sm flex items-center gap-1 rounded border px-2 py-1 text-sm transition-colors ${data.profile.following ? 'bg-gray-400 text-white' : 'border-gray-400 text-gray-400 hover:bg-gray-200'}`}
                        onClick={() =>
                          dispatch({
                            _tag: data.profile.following
                              ? 'Unfollow'
                              : 'Follow',
                          })
                        }
                      >
                        <PlusIcon className='h-4 w-4' />{' '}
                        {data.profile.following
                          ? `Unfollow ${data.profile.username}`
                          : `Follow ${data.profile.username}`}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className='container mx-auto px-4'>
                <div className='-mx-4 flex flex-wrap'>
                  <div className='mx-auto w-full px-4 md:w-3/4'>
                    <div className='articles-toggle mb-4'>
                      <ul className='flex border-b'>
                        <li className='mr-1'>
                          <button
                            type='button'
                            className={`inline-block px-4 py-2 font-medium ${!model.showFavorites ? 'text-brand-primary border-brand-primary border-b-2' : 'text-gray-400 hover:text-gray-600'}`}
                            onClick={() =>
                              dispatch({ _tag: 'ToggleFavorites', show: false })
                            }
                          >
                            My Articles
                          </button>
                        </li>
                        <li className='mr-1'>
                          <button
                            type='button'
                            className={`inline-block px-4 py-2 font-medium ${model.showFavorites ? 'text-brand-primary border-brand-primary border-b-2' : 'text-gray-400 hover:text-gray-600'}`}
                            onClick={() =>
                              dispatch({ _tag: 'ToggleFavorites', show: true })
                            }
                          >
                            Favorited Articles
                          </button>
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
                        (articlesData: ArticlesResponse) => (
                          <div className='article-list'>
                            {articlesData.articles.length === 0 ? (
                              <div className='py-4'>
                                No articles are here... yet.
                              </div>
                            ) : (
                              articlesData.articles.map((article: any) => (
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
                                        {new Date(
                                          article.createdAt,
                                        ).toDateString()}
                                      </span>
                                    </div>
                                    <button
                                      type='button'
                                      className='btn btn-sm outline-brand-primary border-brand-primary text-brand-primary hover:bg-brand-primary flex items-center gap-1 rounded border px-2 py-1 text-sm transition-colors hover:text-white'
                                    >
                                      <HeartIconSolid className='h-4 w-4' />{' '}
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
                                    className='preview-link'
                                  >
                                    <h1 className='mb-1 text-xl font-bold'>
                                      {article.title}
                                    </h1>
                                    <p className='mb-4 font-light text-gray-400'>
                                      {article.description}
                                    </p>
                                    <span className='text-xs font-light text-gray-400'>
                                      Read more...
                                    </span>
                                  </Link>
                                </div>
                              ))
                            )}
                          </div>
                        ),
                      ),
                    )}
                  </div>
                </div>
              </div>
            </>
          ),
        ),
      )}
    </div>
  )
}
