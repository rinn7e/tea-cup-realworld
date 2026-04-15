import * as RD from '@devexperts/remote-data-ts'
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
    <div className='home-page'>
      <div className='banner'>
        <div className='container'>
          <h1 className='logo-font'>conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className='container page'>
        <div className='row'>
          <div className='col-md-9'>
            <div className='feed-toggle'>
              {/* TODO: add "Your Feed" tab when user is authenticated (HomeView currently doesn't receive shared user) */}
              <ul className='nav nav-pills outline-active'>
                <li className='nav-item'>
                  <Link
                    className='nav-link active'
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
                () => <div className='article-preview'>Loading articles...</div>,
                () => <div className='article-preview'>Loading articles...</div>,
                (err: Error) => (
                  <div className='article-preview'>
                    Error loading articles: {err.message}
                  </div>
                ),
                (data: ArticlesResponse) =>
                  data.articles.length === 0 ? (
                    <div className='article-preview'>
                      No articles are here... yet.
                    </div>
                  ) : (
                    <>
                      {data.articles.map((article) => (
                        <div key={article.slug} className='article-preview'>
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
                                {new Date(article.createdAt).toDateString()}
                              </span>
                            </div>
                            <button
                              type='button'
                              className='btn btn-outline-primary btn-sm pull-xs-right'
                            >
                              <i className='ion-heart' /> {article.favoritesCount}
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
                            <ul className='tag-list'>
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
                      ))}
                      {/* TODO: pagination — model doesn't support page state yet */}
                    </>
                  ),
              ),
            )}
          </div>

          <div className='col-md-3'>
            <div className='sidebar'>
              <p>Popular Tags</p>
              <div className='tag-list'>
                {pipe(
                  model.tags,
                  RD.fold(
                    () => <span>Loading tags...</span>,
                    () => <span>Loading tags...</span>,
                    () => <span>Error loading tags</span>,
                    (data: TagsResponse) => (
                      <>
                        {data.tags.map((tag) => (
                          // TODO: clicking a tag should filter the feed; model has no selectedTag yet
                          <a key={tag} href='#' className='tag-pill tag-default'>
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
