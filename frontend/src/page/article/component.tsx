import * as RD from '@devexperts/remote-data-ts'
import { cn } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Pencil, Trash2, UserMinus, UserPlus } from 'lucide-react'
import React from 'react'
import ReactMarkdown from 'react-markdown'

import type {
  ApiError,
  ArticleResponse,
  CommentsResponse,
  HttpError,
} from '@/api/type'
import { DotLoading } from '@/component/dot-loading'
import { ErrorMessages } from '@/component/error-messages'
import { favButtonView } from '@/component/fav-button'
import { IndeterminateProgressBar } from '@/component/indeterminate-progress-bar'
import { Link } from '@/component/link'
import { assetPath } from '@/util'
import { memoStrategy } from '@/util/memo-strategy'

import { Props, PropsEq } from './type'

const ArticlePageComponent = ({ model, user, dispatch }: Props) => {
  return (
    <div className='article-page flex min-h-full flex-col'>
      {pipe(
        model.article,
        RD.fold(
          () => <IndeterminateProgressBar />,
          () => <IndeterminateProgressBar />,
          (err: HttpError<ApiError>) => (
            <div className='mx-auto max-w-[1152px] px-[16px] py-[24px]'>
              <ErrorMessages error={err} />
            </div>
          ),

          (data: ArticleResponse) => {
            const isLoggedIn = O.isSome(user)
            const isAuthor =
              isLoggedIn && user.value.username === data.article.author.username
            const author = data.article.author

            const articleMeta = (isLight: boolean) => (
              <div className='article-meta flex flex-wrap items-center gap-[12px]'>
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
                    src={assetPath(author.image || '/default-avatar.svg')}
                    className='h-[36px] w-[36px] rounded-full object-cover'
                    alt=''
                  />
                </Link>
                <div className='flex flex-col'>
                  <Link
                    route={{
                      page: {
                        _tag: 'ProfilePage',
                        username: author.username,
                        favorites: false,
                      },
                    }}
                    className={cn(
                      'author block text-sm font-medium hover:underline',
                      isLight ? 'text-green-400' : 'text-green-600',
                    )}
                  >
                    {author.username}
                  </Link>
                  <span className='date text-xs text-gray-400'>
                    {new Date(data.article.createdAt).toDateString()}
                  </span>
                </div>
                <div className='flex flex-wrap items-center gap-[8px]'>
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
                        className={cn(
                          'flex items-center gap-[4px] rounded border px-[12px] py-[4px] text-xs transition-colors',
                          isLight
                            ? 'border-gray-400 text-gray-300 hover:border-white hover:text-white'
                            : 'border-gray-300 text-gray-600 hover:border-gray-500',
                        )}
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
                        className={cn(
                          'flex items-center gap-[4px] rounded border px-[12px] py-[4px] text-xs transition-colors',
                          isLight
                            ? 'border-gray-400 text-gray-300 hover:border-white hover:text-white'
                            : 'border-gray-300 text-gray-600 hover:border-gray-500',
                        )}
                      >
                        <UserPlus size={13} /> Follow {author.username}
                      </button>
                    ))}
                  {favButtonView({
                    variant: 'detail',
                    isLight,
                    favorited: data.article.favorited,
                    favoritesCount: data.article.favoritesCount,
                    onClick: () =>
                      isLoggedIn &&
                      dispatch({
                        _tag: data.article.favorited
                          ? 'UnfavoriteArticle'
                          : 'FavoriteArticle',
                      }),
                  })}
                  {isAuthor && (
                    <>
                      <Link
                        route={{
                          page: {
                            _tag: 'EditorPage',
                            slug: O.some(data.article.slug),
                          },
                        }}
                        className={cn(
                          'flex items-center gap-[4px] rounded border px-[12px] py-[4px] text-xs transition-colors',
                          isLight
                            ? 'border-gray-400 text-gray-300 hover:border-white hover:text-white'
                            : 'border-gray-300 text-gray-600 hover:border-gray-500',
                        )}
                      >
                        <Pencil size={13} /> Edit Article
                      </Link>
                      <button
                        type='button'
                        onClick={() => dispatch({ _tag: 'DeleteArticle' })}
                        className={cn(
                          'flex items-center gap-[4px] rounded border px-[12px] py-[4px] text-xs transition-colors',
                          isLight
                            ? 'border-red-500 text-red-400 hover:bg-red-900'
                            : 'border-red-500 text-red-600 hover:bg-red-50',
                        )}
                      >
                        <Trash2 size={13} /> Delete Article
                      </button>
                    </>
                  )}
                </div>
              </div>
            )

            return (
              <div className='flex min-h-full flex-col'>
                {/* Article Header */}
                <div className='bg-gray-900 py-[40px] text-white shadow-inner'>
                  <div className='mx-auto flex max-w-[1152px] flex-col gap-[16px] px-[16px]'>
                    <h1 className='text-3xl leading-tight font-bold lg:text-4xl'>
                      {data.article.title}
                    </h1>
                    {articleMeta(true)}
                  </div>
                </div>

                {/* Article Body */}
                <div className='mx-auto flex w-full max-w-[1152px] flex-col gap-[32px] px-[16px] py-[32px]'>
                  <div className='flex flex-col gap-[16px]'>
                    <div className='article-content prose prose-gray prose-img:rounded-lg max-w-none'>
                      <ReactMarkdown>{data.article.body ?? ''}</ReactMarkdown>
                    </div>
                    <ul className='tag-list flex flex-wrap gap-[4px]'>
                      {data.article.tagList.map((tag) => (
                        <li
                          key={tag}
                          className='tag-default tag-pill rounded-full border border-gray-300 px-[8px] py-[2px] text-xs text-gray-400'
                        >
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <hr className='border-gray-200' />

                  <div className='flex flex-col items-center gap-[32px]'>
                    {articleMeta(false)}

                    <div className='flex w-full max-w-[700px] flex-col gap-[24px]'>
                      {isLoggedIn && (
                        <form
                          className='comment-form flex flex-col overflow-hidden rounded border border-gray-200'
                          onSubmit={(e) => {
                            e.preventDefault()
                            dispatch({ _tag: 'SubmitComment' })
                          }}
                        >
                          <textarea
                            className='min-h-[100px] w-full resize-none p-[12px] text-sm text-gray-800 outline-none'
                            rows={3}
                            placeholder='Write a comment...'
                            value={model.newCommentInput}
                            onChange={(e) =>
                              dispatch({
                                _tag: 'SetCommentInput',
                                value: e.target.value,
                              })
                            }
                          />

                          {model.newCommentError && (
                            <ErrorMessages error={model.newCommentError} />
                          )}

                          <div className='flex items-center justify-between border-t border-gray-100 bg-gray-50 px-[12px] py-[8px]'>
                            {pipe(
                              user,
                              O.fold(
                                () => null,
                                (u) => (
                                  <img
                                    src={assetPath(
                                      u.image || '/default-avatar.svg',
                                    )}
                                    className='comment-author-img h-[20px] w-[20px] rounded-full object-cover'
                                    alt=''
                                  />
                                ),
                              ),
                            )}
                            <button
                              type='submit'
                              className='rounded bg-green-600 px-[12px] py-[4px] text-xs text-white transition-colors hover:bg-green-700'
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
                            <div className='py-[12px]'>
                              <DotLoading className='text-2xl text-green-600' />
                            </div>
                          ),
                          () => (
                            <div className='py-[12px]'>
                              <DotLoading className='text-2xl text-green-600' />
                            </div>
                          ),
                          (err: HttpError<ApiError>) => (
                            <div className='py-[12px]'>
                              <ErrorMessages error={err} />
                            </div>
                          ),
                          (commentsData: CommentsResponse) => (
                            <div className='flex flex-col gap-[16px]'>
                              {commentsData.comments.map((comment) => (
                                <div
                                  key={comment.id}
                                  className='card overflow-hidden rounded border border-gray-200'
                                >
                                  <div className='card-block p-[16px]'>
                                    <p className='text-sm whitespace-pre-wrap text-gray-800'>
                                      {comment.body}
                                    </p>
                                  </div>
                                  <div className='card-footer flex items-center gap-[8px] border-t border-gray-100 bg-gray-50 px-[16px] py-[8px] text-xs'>
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
                                        src={assetPath(
                                          comment.author.image ||
                                            '/default-avatar.svg',
                                        )}
                                        className='comment-author-img h-[20px] w-[20px] rounded-full object-cover'
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
                                      {new Date(
                                        comment.createdAt,
                                      ).toDateString()}
                                    </span>
                                    {isLoggedIn &&
                                      user.value.username ===
                                        comment.author.username && (
                                        <span className='mod-options ml-auto'>
                                          <button
                                            type='button'
                                            onClick={() =>
                                              dispatch({
                                                _tag: 'DeleteComment',
                                                id: comment.id,
                                              })
                                            }
                                            className='text-gray-400 transition-colors hover:text-red-500'
                                          >
                                            <i className='ion-trash-a'>
                                              <Trash2 size={12} />
                                            </i>
                                          </button>
                                        </span>
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
                </div>
              </div>
            )
          },
        ),
      )}
    </div>
  )
}

export const ArticlePageMemo = memoStrategy(
  ArticlePageComponent,
  PropsEq.equals,
)
