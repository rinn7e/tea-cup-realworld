import * as RD from '@devexperts/remote-data-ts'
import { pipe } from 'fp-ts/lib/function'
import { Heart, Settings, UserPlus } from 'lucide-react'
import React from 'react'

import type {
  ArticlesResponse,
  HttpErrorString,
  ProfileResponse,
} from '@/api/type'
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
    <div>
      {pipe(
        model.profile,
        RD.fold(
          () => (
            <div className='py-6 text-center text-sm text-gray-500'>
              Loading profile...
            </div>
          ),
          () => (
            <div className='py-6 text-center text-sm text-gray-500'>
              Loading profile...
            </div>
          ),
          (err: HttpErrorString) => (
            <div className='py-6 text-center text-sm text-red-500'>
              Error loading profile: {err.actualErr}
            </div>
          ),
          (data: ProfileResponse) => (
            <>
              <div className='border-b border-gray-200 bg-gray-50 py-10 text-center'>
                <div className='mx-auto max-w-6xl px-4'>
                  <img
                    src={data.profile.image || '/default-avatar.svg'}
                    className='mx-auto h-24 w-24 rounded-full border-4 border-white object-cover shadow'
                    alt=''
                  />
                  <h4 className='mt-3 text-2xl font-bold text-gray-900'>
                    {data.profile.username}
                  </h4>
                  {data.profile.bio && (
                    <p className='mt-1 text-sm text-gray-500'>
                      {data.profile.bio}
                    </p>
                  )}

                  {isCurrentUser ? (
                    <Link
                      route={{ page: { _tag: 'SettingsPage' } }}
                      className='mt-4 inline-flex items-center gap-1.5 rounded border border-gray-400 px-3 py-1.5 text-sm text-gray-600 hover:border-gray-600'
                    >
                      <Settings size={13} /> Edit Profile Settings
                    </Link>
                  ) : (
                    <button
                      type='button'
                      className='mt-4 inline-flex items-center gap-1.5 rounded border border-gray-400 px-3 py-1.5 text-sm text-gray-600 hover:border-gray-600'
                      onClick={() =>
                        dispatch({
                          _tag: data.profile.following ? 'Unfollow' : 'Follow',
                        })
                      }
                    >
                      <UserPlus size={13} />{' '}
                      {data.profile.following
                        ? `Unfollow ${data.profile.username}`
                        : `Follow ${data.profile.username}`}
                    </button>
                  )}
                </div>
              </div>

              <div className='mx-auto max-w-6xl px-4 py-6'>
                <div className='flex border-b border-gray-200'>
                  <button
                    type='button'
                    className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${!model.showFavorites ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    onClick={() =>
                      dispatch({ _tag: 'ToggleFavorites', show: false })
                    }
                  >
                    My Articles
                  </button>
                  <button
                    type='button'
                    className={`-mb-px border-b-2 px-4 py-2 text-sm font-medium ${model.showFavorites ? 'border-green-600 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    onClick={() =>
                      dispatch({ _tag: 'ToggleFavorites', show: true })
                    }
                  >
                    Favorited Articles
                  </button>
                </div>

                {pipe(
                  model.articles,
                  RD.fold(
                    () => (
                      <div className='py-6 text-sm text-gray-500'>
                        Loading articles...
                      </div>
                    ),
                    () => (
                      <div className='py-6 text-sm text-gray-500'>
                        Loading articles...
                      </div>
                    ),
                    (err: HttpErrorString) => (
                      <div className='py-6 text-sm text-red-500'>
                        Error loading articles: {err.actualErr}
                      </div>
                    ),
                    (articlesData: ArticlesResponse) =>
                      articlesData.articles.length === 0 ? (
                        <div className='py-6 text-sm text-gray-500'>
                          No articles are here... yet.
                        </div>
                      ) : (
                        <>
                          {articlesData.articles.map((article: any) => (
                            <div
                              key={article.slug}
                              className='border-b border-gray-200 py-6'
                            >
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
                                      {new Date(
                                        article.createdAt,
                                      ).toDateString()}
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
                                <h1 className='text-xl font-bold text-gray-900'>
                                  {article.title}
                                </h1>
                                <p className='mt-1 text-sm text-gray-500'>
                                  {article.description}
                                </p>
                                <span className='mt-2 block text-xs text-gray-400'>
                                  Read more...
                                </span>
                              </Link>
                            </div>
                          ))}
                        </>
                      ),
                  ),
                )}
              </div>
            </>
          ),
        ),
      )}
    </div>
  )
}
