import * as RD from '@devexperts/remote-data-ts'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Heart, Pencil, Trash2, UserMinus, UserPlus } from 'lucide-react'
import React from 'react'
import ReactMarkdown from 'react-markdown'

import type {
  ArticleResponse,
  CommentsResponse,
  HttpErrorString,
} from '@/api/type'
import { Link } from '@/component/link'
import { memoStrategy } from '@/util/memo-strategy'

import { Props, PropsEq } from './type'

function ArticleView({ model, token, dispatch }: Props) {
  return (
    <div>
      {pipe(
        model.article,
        RD.fold(
          () => (
            <div className='py-6 text-center text-sm text-gray-500'>
              Loading article...
            </div>
          ),
          () => (
            <div className='py-6 text-center text-sm text-gray-500'>
              Loading article...
            </div>
          ),
          (err: HttpErrorString) => (
            <div className='py-6 text-center text-sm text-red-500'>
              Error loading article: {err.actualErr}
            </div>
          ),
          (data: ArticleResponse) => {
            const isLoggedIn = O.isSome(token)
            const author = data.article.author
            return (
              <>
                <div className='bg-gray-900 py-10 text-white'>
                  <div className='mx-auto max-w-6xl px-4'>
                    <h1 className='text-3xl font-bold'>{data.article.title}</h1>
                    <div className='mt-4 flex flex-wrap items-center gap-3'>
                      <Link
                        route={{
                          page: {
                            _tag: 'ProfilePage',
                            username: author.username,
                            favorites: false,
                          },
                        }}
                      >
                        <img
                          src={author.image || '/default-avatar.svg'}
                          className='h-9 w-9 rounded-full object-cover'
                          alt=''
                        />
                      </Link>
                      <div>
                        <Link
                          route={{
                            page: {
                              _tag: 'ProfilePage',
                              username: author.username,
                              favorites: false,
                            },
                          }}
                          className='block text-sm font-medium text-green-400 hover:underline'
                        >
                          {author.username}
                        </Link>
                        <span className='text-xs text-gray-400'>
                          {new Date(data.article.createdAt).toDateString()}
                        </span>
                      </div>
                      <div className='flex flex-wrap items-center gap-2'>
                        {isLoggedIn &&
                          (author.following ? (
                            <button
                              type='button'
                              onClick={() =>
                                dispatch({
                                  _tag: 'UnfollowAuthor',
                                  username: author.username,
                                })
                              }
                              className='flex items-center gap-1 rounded border border-gray-400 px-3 py-1 text-xs text-gray-300 hover:border-white hover:text-white'
                            >
                              <UserMinus size={13} /> Unfollow {author.username}
                            </button>
                          ) : (
                            <button
                              type='button'
                              onClick={() =>
                                dispatch({
                                  _tag: 'FollowAuthor',
                                  username: author.username,
                                })
                              }
                              className='flex items-center gap-1 rounded border border-gray-400 px-3 py-1 text-xs text-gray-300 hover:border-white hover:text-white'
                            >
                              <UserPlus size={13} /> Follow {author.username}
                            </button>
                          ))}
                        <button
                          type='button'
                          onClick={() =>
                            isLoggedIn &&
                            dispatch({
                              _tag: data.article.favorited
                                ? 'UnfavoriteArticle'
                                : 'FavoriteArticle',
                            })
                          }
                          className='flex items-center gap-1 rounded border border-green-500 px-3 py-1 text-xs text-green-400 hover:bg-green-900'
                        >
                          <Heart size={13} /> Favorite Post{' '}
                          <span>({data.article.favoritesCount})</span>
                        </button>
                        {isLoggedIn && (
                          <>
                            <Link
                              route={{
                                page: {
                                  _tag: 'EditorPage',
                                  slug: O.some(data.article.slug),
                                },
                              }}
                              className='flex items-center gap-1 rounded border border-gray-400 px-3 py-1 text-xs text-gray-300 hover:border-white hover:text-white'
                            >
                              <Pencil size={13} /> Edit Article
                            </Link>
                            <button
                              type='button'
                              onClick={() =>
                                dispatch({ _tag: 'DeleteArticle' })
                              }
                              className='flex items-center gap-1 rounded border border-red-500 px-3 py-1 text-xs text-red-400 hover:bg-red-900'
                            >
                              <Trash2 size={13} /> Delete Article
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className='mx-auto max-w-6xl px-4 py-8'>
                  <div className='prose prose-gray max-w-none'>
                    <ReactMarkdown>{data.article.body ?? ''}</ReactMarkdown>
                  </div>
                  <ul className='mt-4 flex flex-wrap gap-1'>
                    {data.article.tagList.map((tag) => (
                      <li
                        key={tag}
                        className='rounded-full border border-gray-300 px-2 py-0.5 text-xs text-gray-400'
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>

                  <hr className='my-8 border-gray-200' />

                  <div className='flex flex-wrap items-center gap-3'>
                    <Link
                      route={{
                        page: {
                          _tag: 'ProfilePage',
                          username: author.username,
                          favorites: false,
                        },
                      }}
                    >
                      <img
                        src={author.image || '/default-avatar.svg'}
                        className='h-9 w-9 rounded-full object-cover'
                        alt=''
                      />
                    </Link>
                    <div>
                      <Link
                        route={{
                          page: {
                            _tag: 'ProfilePage',
                            username: author.username,
                            favorites: false,
                          },
                        }}
                        className='block text-sm font-medium text-green-600 hover:underline'
                      >
                        {author.username}
                      </Link>
                      <span className='text-xs text-gray-400'>
                        {new Date(data.article.createdAt).toDateString()}
                      </span>
                    </div>
                    <div className='flex flex-wrap items-center gap-2'>
                      {isLoggedIn &&
                        (author.following ? (
                          <button
                            type='button'
                            onClick={() =>
                              dispatch({
                                _tag: 'UnfollowAuthor',
                                username: author.username,
                              })
                            }
                            className='flex items-center gap-1 rounded border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:border-gray-500'
                          >
                            <UserMinus size={13} /> Unfollow {author.username}
                          </button>
                        ) : (
                          <button
                            type='button'
                            onClick={() =>
                              dispatch({
                                _tag: 'FollowAuthor',
                                username: author.username,
                              })
                            }
                            className='flex items-center gap-1 rounded border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:border-gray-500'
                          >
                            <UserPlus size={13} /> Follow {author.username}
                          </button>
                        ))}
                      <button
                        type='button'
                        onClick={() =>
                          isLoggedIn &&
                          dispatch({
                            _tag: data.article.favorited
                              ? 'UnfavoriteArticle'
                              : 'FavoriteArticle',
                          })
                        }
                        className='flex items-center gap-1 rounded border border-green-500 px-3 py-1 text-xs text-green-600 hover:bg-green-50'
                      >
                        <Heart size={13} /> Favorite Post{' '}
                        <span>({data.article.favoritesCount})</span>
                      </button>
                    </div>
                  </div>

                  <div className='mx-auto mt-8 max-w-2xl'>
                    {isLoggedIn && (
                      <form
                        className='mb-6 rounded border border-gray-200'
                        onSubmit={(e) => {
                          e.preventDefault()
                          dispatch({ _tag: 'SubmitComment' })
                        }}
                      >
                        <textarea
                          className='w-full resize-none p-3 text-sm text-gray-800 outline-none'
                          rows={3}
                          placeholder='Write a comment...'
                          value={model.commentInput}
                          onChange={(e) =>
                            dispatch({
                              _tag: 'SetCommentInput',
                              value: e.target.value,
                            })
                          }
                        />
                        <div className='flex justify-end border-t border-gray-100 bg-gray-50 px-3 py-2'>
                          <button
                            type='submit'
                            className='rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700'
                          >
                            Post Comment
                          </button>
                        </div>
                      </form>
                    )}
                    {pipe(
                      model.comments,
                      RD.fold(
                        () => (
                          <div className='text-sm text-gray-500'>
                            Loading comments...
                          </div>
                        ),
                        () => (
                          <div className='text-sm text-gray-500'>
                            Loading comments...
                          </div>
                        ),
                        (err: HttpErrorString) => (
                          <div className='text-sm text-red-500'>
                            Error loading comments: {err.actualErr}
                          </div>
                        ),
                        (commentsData: CommentsResponse) => (
                          <div className='space-y-4'>
                            {commentsData.comments.map((comment) => (
                              <div
                                key={comment.id}
                                className='rounded-lg border border-gray-200'
                              >
                                <div className='p-4'>
                                  <p className='text-sm text-gray-800'>
                                    {comment.body}
                                  </p>
                                </div>
                                <div className='flex items-center gap-2 border-t border-gray-100 bg-gray-50 px-4 py-2 text-xs'>
                                  <Link
                                    route={{
                                      page: {
                                        _tag: 'ProfilePage',
                                        username: comment.author.username,
                                        favorites: false,
                                      },
                                    }}
                                  >
                                    <img
                                      src={
                                        comment.author.image ||
                                        '/default-avatar.svg'
                                      }
                                      className='h-5 w-5 rounded-full object-cover'
                                      alt=''
                                    />
                                  </Link>
                                  <Link
                                    route={{
                                      page: {
                                        _tag: 'ProfilePage',
                                        username: comment.author.username,
                                        favorites: false,
                                      },
                                    }}
                                    className='font-medium text-green-600 hover:underline'
                                  >
                                    {comment.author.username}
                                  </Link>
                                  <span className='text-gray-400'>
                                    {new Date(comment.createdAt).toDateString()}
                                  </span>
                                  {isLoggedIn && (
                                    <button
                                      type='button'
                                      onClick={() =>
                                        dispatch({
                                          _tag: 'DeleteComment',
                                          id: comment.id,
                                        })
                                      }
                                      className='ml-auto text-gray-400 hover:text-red-500'
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ),
                      ),
                    )}
                  </div>
                </div>
              </>
            )
          },
        ),
      )}
    </div>
  )
}

export const ArticleViewMemo = memoStrategy(ArticleView, PropsEq.equals)
