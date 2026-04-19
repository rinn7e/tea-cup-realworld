import * as RD from '@devexperts/remote-data-ts'
import { cn } from '@rinn7e/tea-cup-prelude'
import { pipe } from 'fp-ts/lib/function'
import { Settings, UserPlus } from 'lucide-react'
import React from 'react'

import type {
  ArticlesResponse,
  HttpErrorString,
  ProfileResponse,
} from '@/api/type'
import { ArticleShortComponent } from '@/component/article-short/component'
import { IndeterminateProgressBar } from '@/component/indeterminate-progress-bar'
import { Link } from '@/component/link'
import { assetPath } from '@/util'
import { memoStrategy } from '@/util/memo-strategy'

import { Props, PropsEq } from './type'

function ProfilePageComponent({ model, dispatch, isCurrentUser }: Props) {
  return (
    <div className='flex min-h-full flex-col'>
      {pipe(
        model.profile,
        RD.fold(
          () => <IndeterminateProgressBar />,
          () => <IndeterminateProgressBar />,
          (err: HttpErrorString) => (
            <div className='py-[24px] text-center text-sm text-red-500'>
              Error loading profile: {err.actualErr}
            </div>
          ),
          (data: ProfileResponse) => (
            <>
              {/* Header Banner */}
              <div className='border-b border-gray-200 bg-gray-50 py-[40px] text-center shadow-inner'>
                <div className='mx-auto flex max-w-[1152px] flex-col items-center gap-[12px] px-[16px]'>
                  <img
                    src={assetPath(data.profile.image || '/default-avatar.svg')}
                    className='h-[96px] w-[96px] rounded-full border-[4px] border-white object-cover shadow-sm'
                    alt=''
                  />
                  <div className='flex flex-col gap-[4px]'>
                    <h4 className='text-2xl font-bold text-gray-900'>
                      {data.profile.username}
                    </h4>
                    {data.profile.bio && (
                      <p className='max-w-[600px] text-sm text-gray-500'>
                        {data.profile.bio}
                      </p>
                    )}
                  </div>

                  <div className='pt-[4px]'>
                    {isCurrentUser ? (
                      <Link
                        route={{ page: { _tag: 'SettingsPage' } }}
                        className='inline-flex items-center gap-[6px] rounded border border-gray-400 px-[12px] py-[6px] text-sm text-gray-600 transition-colors hover:border-gray-600'
                      >
                        <Settings size={13} /> Edit Profile Settings
                      </Link>
                    ) : (
                      <button
                        type='button'
                        className='inline-flex items-center gap-[6px] rounded border border-gray-400 px-[12px] py-[6px] text-sm text-gray-600 transition-colors hover:border-gray-600'
                        onClick={() =>
                          dispatch({
                            _tag: data.profile.following
                              ? 'Unfollow'
                              : 'Follow',
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
              </div>

              {/* Main Content */}
              <div className='mx-auto flex w-full max-w-[1152px] flex-col gap-[24px] px-[16px] py-[24px]'>
                <div className='flex border-b border-gray-200'>
                  <button
                    type='button'
                    className={cn(
                      'border-b-2 px-[16px] py-[8px] text-sm font-medium transition-colors',
                      !model.showFavorites
                        ? 'border-green-600 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700',
                    )}
                    onClick={() =>
                      dispatch({ _tag: 'ToggleFavorites', show: false })
                    }
                  >
                    My Articles
                  </button>
                  <button
                    type='button'
                    className={cn(
                      'border-b-2 px-[16px] py-[8px] text-sm font-medium transition-colors',
                      model.showFavorites
                        ? 'border-green-600 text-green-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700',
                    )}
                    onClick={() =>
                      dispatch({ _tag: 'ToggleFavorites', show: true })
                    }
                  >
                    Favorited Articles
                  </button>
                </div>

                <div className='flex flex-col'>
                  {pipe(
                    model.articles,
                    RD.fold(
                      () => (
                        <div className='py-[24px] text-sm text-gray-500'>
                          Loading articles...
                        </div>
                      ),
                      () => (
                        <div className='py-[24px] text-sm text-gray-500'>
                          Loading articles...
                        </div>
                      ),
                      (err: HttpErrorString) => (
                        <div className='py-[24px] text-sm text-red-500'>
                          Error loading articles: {err.actualErr}
                        </div>
                      ),
                      (articlesData: ArticlesResponse) =>
                        articlesData.articles.length === 0 ? (
                          <div className='py-[24px] text-sm text-gray-500'>
                            No articles are here... yet.
                          </div>
                        ) : (
                          <div className='flex flex-col'>
                            {articlesData.articles.map((article) => (
                              <ArticleShortComponent
                                key={article.slug}
                                model={article}
                                dispatch={(subMsg) =>
                                  dispatch({
                                    _tag: 'ArticleShortMsg',
                                    slug: article.slug,
                                    subMsg,
                                  })
                                }
                              />
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

export const ProfilePageMemo = memoStrategy(
  ProfilePageComponent,
  PropsEq.equals,
)
