import * as RD from '@devexperts/remote-data-ts'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import React from 'react'
import ReactMarkdown from 'react-markdown'

import type { ArticleResponse, CommentsResponse } from '@/api/type'
import { Link } from '@/component/link'

import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: (msg: Msg) => void
}

export const ArticleView: React.FC<Props> = ({ model }) => {
  return (
    <div className='article-page'>
      {pipe(
        model.article,
        RD.fold(
          () => <div className='article-preview'>Loading article...</div>,
          () => <div className='article-preview'>Loading article...</div>,
          (err: Error) => (
            <div className='article-preview'>
              Error loading article: {err.message}
            </div>
          ),
          (data: ArticleResponse) => (
            <>
              <div className='banner'>
                <div className='container'>
                  <h1>{data.article.title}</h1>
                  <div className='article-meta'>
                    <Link
                      route={{
                        page: {
                          _tag: 'ProfilePage',
                          username: data.article.author.username,
                          favorites: false,
                        },
                      }}
                    >
                      <img
                        src={
                          data.article.author.image ||
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
                            username: data.article.author.username,
                            favorites: false,
                          },
                        }}
                        className='author'
                      >
                        {data.article.author.username}
                      </Link>
                      <span className='date'>
                        {new Date(data.article.createdAt).toDateString()}
                      </span>
                    </div>
                    {/* TODO: show follow/favorite for non-owners, edit/delete for owner — ArticleView needs an isOwner prop */}
                    <button
                      type='button'
                      className='btn btn-sm btn-outline-secondary'
                    >
                      <i className='ion-plus-round' /> Follow{' '}
                      {data.article.author.username}
                    </button>
                    &nbsp;&nbsp;
                    <button
                      type='button'
                      className='btn btn-sm btn-outline-primary'
                    >
                      <i className='ion-heart' /> Favorite Post{' '}
                      <span className='counter'>
                        ({data.article.favoritesCount})
                      </span>
                    </button>
                    &nbsp;&nbsp;
                    {/* TODO: only show Edit/Delete to article owner */}
                    <Link
                      route={{
                        page: {
                          _tag: 'EditorPage',
                          slug: O.some(data.article.slug),
                        },
                      }}
                      className='btn btn-sm btn-outline-secondary'
                    >
                      <i className='ion-edit' /> Edit Article
                    </Link>
                    &nbsp;
                    <button
                      type='button'
                      className='btn btn-sm btn-outline-danger'
                    >
                      <i className='ion-trash-a' /> Delete Article
                    </button>
                  </div>
                </div>
              </div>

              <div className='container page'>
                <div className='row article-content'>
                  <div className='col-xs-12'>
                    <ReactMarkdown>{data.article.body}</ReactMarkdown>
                    <ul className='tag-list'>
                      {data.article.tagList.map((tag) => (
                        <li
                          key={tag}
                          className='tag-default tag-pill tag-outline'
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <hr />

                <div className='article-actions'>
                  {/* TODO: extract article-meta + action buttons into a shared helper to avoid duplication */}
                  <div className='article-meta'>
                    <Link
                      route={{
                        page: {
                          _tag: 'ProfilePage',
                          username: data.article.author.username,
                          favorites: false,
                        },
                      }}
                    >
                      <img
                        src={
                          data.article.author.image ||
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
                            username: data.article.author.username,
                            favorites: false,
                          },
                        }}
                        className='author'
                      >
                        {data.article.author.username}
                      </Link>
                      <span className='date'>
                        {new Date(data.article.createdAt).toDateString()}
                      </span>
                    </div>
                    <button
                      type='button'
                      className='btn btn-sm btn-outline-secondary'
                    >
                      <i className='ion-plus-round' /> Follow{' '}
                      {data.article.author.username}
                    </button>
                    &nbsp;&nbsp;
                    <button
                      type='button'
                      className='btn btn-sm btn-outline-primary'
                    >
                      <i className='ion-heart' /> Favorite Post{' '}
                      <span className='counter'>
                        ({data.article.favoritesCount})
                      </span>
                    </button>
                  </div>
                </div>

                <div className='row'>
                  <div className='col-xs-12 col-md-8 offset-md-2'>
                    {/* TODO: comment form — requires auth user + PostComment dispatch, not yet wired in model */}

                    {pipe(
                      model.comments,
                      RD.fold(
                        () => <div>Loading comments...</div>,
                        () => <div>Loading comments...</div>,
                        (err: Error) => (
                          <div>Error loading comments: {err.message}</div>
                        ),
                        (commentsData: CommentsResponse) => (
                          <div>
                            {commentsData.comments.map((comment) => (
                              <div key={comment.id} className='card'>
                                <div className='card-block'>
                                  <p className='card-text'>{comment.body}</p>
                                </div>
                                <div className='card-footer'>
                                  <Link
                                    route={{
                                      page: {
                                        _tag: 'ProfilePage',
                                        username: comment.author.username,
                                        favorites: false,
                                      },
                                    }}
                                    className='comment-author'
                                  >
                                    <img
                                      src={
                                        comment.author.image ||
                                        'https://api.realworld.io/images/smiley-cyrus.jpeg'
                                      }
                                      className='comment-author-img'
                                      alt=''
                                    />
                                  </Link>
                                  &nbsp;
                                  <Link
                                    route={{
                                      page: {
                                        _tag: 'ProfilePage',
                                        username: comment.author.username,
                                        favorites: false,
                                      },
                                    }}
                                    className='comment-author'
                                  >
                                    {comment.author.username}
                                  </Link>
                                  <span className='date-posted'>
                                    {new Date(comment.createdAt).toDateString()}
                                  </span>
                                  {/* TODO: show mod-options (delete icon) for own comments — needs auth user in ArticleView */}
                                </div>
                              </div>
                            ))}
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
