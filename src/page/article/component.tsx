import * as RD from '@devexperts/remote-data-ts'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Heart, Pencil, Trash2, UserPlus } from 'lucide-react'
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
    <div>
      {pipe(
        model.article,
        RD.fold(
          () => <div className='py-6 text-center text-sm text-gray-500'>Loading article...</div>,
          () => <div className='py-6 text-center text-sm text-gray-500'>Loading article...</div>,
          (err: Error) => (
            <div className='py-6 text-center text-sm text-red-500'>
              Error loading article: {err.message}
            </div>
          ),
          (data: ArticleResponse) => (
            <>
              <div className='bg-gray-900 py-10 text-white'>
                <div className='mx-auto max-w-6xl px-4'>
                  <h1 className='text-3xl font-bold'>{data.article.title}</h1>
                  <div className='mt-4 flex flex-wrap items-center gap-3'>
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
                          '/default-avatar.svg'
                        }
                        className='h-9 w-9 rounded-full object-cover'
                        alt=''
                      />
                    </Link>
                    <div>
                      <Link
                        route={{
                          page: {
                            _tag: 'ProfilePage',
                            username: data.article.author.username,
                            favorites: false,
                          },
                        }}
                        className='block text-sm font-medium text-green-400 hover:underline'
                      >
                        {data.article.author.username}
                      </Link>
                      <span className='text-xs text-gray-400'>
                        {new Date(data.article.createdAt).toDateString()}
                      </span>
                    </div>
                    <div className='flex flex-wrap items-center gap-2'>
                      <button
                        type='button'
                        className='flex items-center gap-1 rounded border border-gray-400 px-3 py-1 text-xs text-gray-300 hover:border-white hover:text-white'
                      >
                        <UserPlus size={13} /> Follow {data.article.author.username}
                      </button>
                      <button
                        type='button'
                        className='flex items-center gap-1 rounded border border-green-500 px-3 py-1 text-xs text-green-400 hover:bg-green-900'
                      >
                        <Heart size={13} /> Favorite Post{' '}
                        <span>({data.article.favoritesCount})</span>
                      </button>
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
                        className='flex items-center gap-1 rounded border border-red-500 px-3 py-1 text-xs text-red-400 hover:bg-red-900'
                      >
                        <Trash2 size={13} /> Delete Article
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className='mx-auto max-w-6xl px-4 py-8'>
                <div className='prose prose-gray max-w-none'>
                  <ReactMarkdown>{data.article.body}</ReactMarkdown>
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
                        username: data.article.author.username,
                        favorites: false,
                      },
                    }}
                  >
                    <img
                      src={
                        data.article.author.image ||
                        '/default-avatar.svg'
                      }
                      className='h-9 w-9 rounded-full object-cover'
                      alt=''
                    />
                  </Link>
                  <div>
                    <Link
                      route={{
                        page: {
                          _tag: 'ProfilePage',
                          username: data.article.author.username,
                          favorites: false,
                        },
                      }}
                      className='block text-sm font-medium text-green-600 hover:underline'
                    >
                      {data.article.author.username}
                    </Link>
                    <span className='text-xs text-gray-400'>
                      {new Date(data.article.createdAt).toDateString()}
                    </span>
                  </div>
                  <div className='flex flex-wrap items-center gap-2'>
                    <button
                      type='button'
                      className='flex items-center gap-1 rounded border border-gray-300 px-3 py-1 text-xs text-gray-600 hover:border-gray-500'
                    >
                      <UserPlus size={13} /> Follow {data.article.author.username}
                    </button>
                    <button
                      type='button'
                      className='flex items-center gap-1 rounded border border-green-500 px-3 py-1 text-xs text-green-600 hover:bg-green-50'
                    >
                      <Heart size={13} /> Favorite Post{' '}
                      <span>({data.article.favoritesCount})</span>
                    </button>
                  </div>
                </div>

                <div className='mx-auto mt-8 max-w-2xl'>
                  {pipe(
                    model.comments,
                    RD.fold(
                      () => <div className='text-sm text-gray-500'>Loading comments...</div>,
                      () => <div className='text-sm text-gray-500'>Loading comments...</div>,
                      (err: Error) => (
                        <div className='text-sm text-red-500'>
                          Error loading comments: {err.message}
                        </div>
                      ),
                      (commentsData: CommentsResponse) => (
                        <div className='space-y-4'>
                          {commentsData.comments.map((comment) => (
                            <div key={comment.id} className='rounded-lg border border-gray-200'>
                              <div className='p-4'>
                                <p className='text-sm text-gray-800'>{comment.body}</p>
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
          ),
        ),
      )}
    </div>
  )
}
