import React from 'react';
import * as RD from '@devexperts/remote-data-ts';
import type { Model, Msg } from './type';
import type { ProfileResponse, ArticlesResponse } from '../../api/type';
import { Link } from '../../component/Link';
import { pipe } from 'fp-ts/lib/function';
import { Cog6ToothIcon, PlusIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

interface Props {
  model: Model;
  dispatch: (msg: Msg) => void;
  isCurrentUser: boolean;
}

export const ProfileView: React.FC<Props> = ({ model, dispatch, isCurrentUser }) => {
  return (
    <div className="profile-page">
      {pipe(
        model.profile,
        RD.fold(
          () => <div className="p-8 text-center">Loading profile...</div>,
          () => <div className="p-8 text-center">Loading profile...</div>,
          (err: Error) => <div className="p-8 text-center text-red-500">Error loading profile: {err.message}</div>,
          (data: ProfileResponse) => (
            <>
              <div className="user-info bg-gray-100 py-8 mb-8 text-center">
                <div className="container mx-auto px-4">
                  <img src={data.profile.image || 'https://api.realworld.io/images/smiley-cyrus.jpeg'} className="w-24 h-24 rounded-full mx-auto mb-4" alt="" />
                  <h4 className="text-2xl font-bold mb-2">{data.profile.username}</h4>
                  <p className="text-gray-400 font-light mb-4">{data.profile.bio}</p>
                  
                  <div className="flex justify-end container mx-auto px-4">
                    {isCurrentUser ? (
                      <Link
                        route={{ page: { _tag: 'SettingsPage' } }}
                        className="btn btn-sm border border-gray-400 text-gray-400 px-2 py-1 rounded hover:bg-gray-200 transition-colors text-sm flex items-center gap-1"
                      >
                        <Cog6ToothIcon className="w-4 h-4" /> Edit Profile Settings
                      </Link>
                    ) : (
                      <button 
                        className={`btn btn-sm border px-2 py-1 rounded transition-colors text-sm flex items-center gap-1 ${data.profile.following ? 'bg-gray-400 text-white' : 'border-gray-400 text-gray-400 hover:bg-gray-200'}`}
                        onClick={() => dispatch({ _tag: data.profile.following ? 'Unfollow' : 'Follow' })}
                      >
                        <PlusIcon className="w-4 h-4" /> {data.profile.following ? `Unfollow ${data.profile.username}` : `Follow ${data.profile.username}`}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="container mx-auto px-4">
                <div className="flex flex-wrap -mx-4">
                  <div className="w-full md:w-3/4 mx-auto px-4">
                    <div className="articles-toggle mb-4">
                      <ul className="flex border-b">
                        <li className="mr-1">
                          <button 
                            className={`inline-block py-2 px-4 font-medium ${!model.showFavorites ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-400 hover:text-gray-600'}`}
                            onClick={() => dispatch({ _tag: 'ToggleFavorites', show: false })}
                          >
                            My Articles
                          </button>
                        </li>
                        <li className="mr-1">
                          <button 
                            className={`inline-block py-2 px-4 font-medium ${model.showFavorites ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-400 hover:text-gray-600'}`}
                            onClick={() => dispatch({ _tag: 'ToggleFavorites', show: true })}
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
                        (err: Error) => <div className="text-red-500">Error loading articles: {err.message}</div>,
                        (articlesData: ArticlesResponse) => (
                          <div className="article-list">
                            {articlesData.articles.length === 0 ? (
                              <div className="py-4">No articles are here... yet.</div>
                            ) : (
                              articlesData.articles.map((article: any) => (
                                <div key={article.slug} className="article-preview py-6 border-t first:border-t-0">
                                  <div className="article-meta flex items-center mb-4">
                                    <Link route={{ page: { _tag: 'ProfilePage', username: article.author.username, favorites: false } }}>
                                      <img src={article.author.image || 'https://api.realworld.io/images/smiley-cyrus.jpeg'} className="w-8 h-8 rounded-full" alt="" />
                                    </Link>
                                    <div className="info ml-2 flex-grow">
                                      <Link
                                        route={{ page: { _tag: 'ProfilePage', username: article.author.username, favorites: false } }}
                                        className="text-brand-primary font-medium block hover:underline"
                                      >
                                        {article.author.username}
                                      </Link>
                                      <span className="text-gray-400 text-xs">{new Date(article.createdAt).toDateString()}</span>
                                    </div>
                                    <button className="btn btn-sm outline-brand-primary border border-brand-primary text-brand-primary px-2 py-1 rounded hover:bg-brand-primary hover:text-white transition-colors text-sm flex items-center gap-1">
                                      <HeartIconSolid className="w-4 h-4" /> {article.favoritesCount}
                                    </button>
                                  </div>
                                  <Link route={{ page: { _tag: 'ArticlePage', slug: article.slug } }} className="preview-link">
                                    <h1 className="text-xl font-bold mb-1">{article.title}</h1>
                                    <p className="text-gray-400 font-light mb-4">{article.description}</p>
                                    <span className="text-gray-400 text-xs font-light">Read more...</span>
                                  </Link>
                                </div>
                              ))
                            )}
                          </div>
                        )
                      )
                    )}
                  </div>
                </div>
              </div>
            </>
          )
        )
      )}
    </div>
  );
};
