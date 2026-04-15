import * as RD from '@devexperts/remote-data-ts'
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
          () => <div className='article-preview'>Loading profile...</div>,
          () => <div className='article-preview'>Loading profile...</div>,
          (err: Error) => (
            <div className='article-preview'>
              Error loading profile: {err.message}
            </div>
          ),
          (data: ProfileResponse) => (
            <>
              <div className='user-info'>
                <div className='container'>
                  <div className='row'>
                    <div className='col-xs-12 col-md-10 offset-md-1'>
                      <img
                        src={
                          data.profile.image ||
                          'https://api.realworld.io/images/smiley-cyrus.jpeg'
                        }
                        className='user-img'
                        alt=''
                      />
                      <h4>{data.profile.username}</h4>
                      <p>{data.profile.bio}</p>

                      {isCurrentUser ? (
                        <Link
                          route={{ page: { _tag: 'SettingsPage' } }}
                          className='btn btn-sm btn-outline-secondary action-btn'
                        >
                          <i className='ion-gear-a' /> Edit Profile Settings
                        </Link>
                      ) : (
                        <button
                          type='button'
                          className='btn btn-sm btn-outline-secondary action-btn'
                          onClick={() =>
                            dispatch({
                              _tag: data.profile.following
                                ? 'Unfollow'
                                : 'Follow',
                            })
                          }
                        >
                          <i className='ion-plus-round' />{' '}
                          {data.profile.following
                            ? `Unfollow ${data.profile.username}`
                            : `Follow ${data.profile.username}`}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className='container'>
                <div className='row'>
                  <div className='col-xs-12 col-md-10 offset-md-1'>
                    <div className='articles-toggle'>
                      <ul className='nav nav-pills outline-active'>
                        <li className='nav-item'>
                          <button
                            type='button'
                            className={`nav-link${!model.showFavorites ? ' active' : ''}`}
                            onClick={() =>
                              dispatch({ _tag: 'ToggleFavorites', show: false })
                            }
                          >
                            My Articles
                          </button>
                        </li>
                        <li className='nav-item'>
                          <button
                            type='button'
                            className={`nav-link${model.showFavorites ? ' active' : ''}`}
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
                        () => (
                          <div className='article-preview'>
                            Loading articles...
                          </div>
                        ),
                        () => (
                          <div className='article-preview'>
                            Loading articles...
                          </div>
                        ),
                        (err: Error) => (
                          <div className='article-preview'>
                            Error loading articles: {err.message}
                          </div>
                        ),
                        (articlesData: ArticlesResponse) =>
                          articlesData.articles.length === 0 ? (
                            <div className='article-preview'>
                              No articles are here... yet.
                            </div>
                          ) : (
                            <>
                              {articlesData.articles.map((article: any) => (
                                <div
                                  key={article.slug}
                                  className='article-preview'
                                >
                                  <div className='article-meta'>
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
                                        alt=''
                                      />
                                    </Link>
                                    <div className='info'>
                                      <Link
                                        route={{
                                          page: {
                                            _tag: 'ProfilePage',
                                            username: article.author.username,
                                            favorites: false,
                                          },
                                        }}
                                        className='author'
                                      >
                                        {article.author.username}
                                      </Link>
                                      <span className='date'>
                                        {new Date(
                                          article.createdAt,
                                        ).toDateString()}
                                      </span>
                                    </div>
                                    <button
                                      type='button'
                                      className='btn btn-outline-primary btn-sm pull-xs-right'
                                    >
                                      <i className='ion-heart' />{' '}
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
                                    <h1>{article.title}</h1>
                                    <p>{article.description}</p>
                                    <span>Read more...</span>
                                  </Link>
                                </div>
                              ))}
                              {/* TODO: pagination — model doesn't support page state yet */}
                            </>
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
