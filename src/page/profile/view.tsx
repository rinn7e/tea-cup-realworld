import React from 'react';
import * as RD from '@devexperts/remote-data-ts';
import type { Model, Msg } from './type';
import type { ProfileResponse, ArticlesResponse } from '../../api/type';

interface Props {
  model: Model;
  dispatch: (msg: Msg) => void;
  isCurrentUser: boolean;
}

export const ProfileView: React.FC<Props> = ({ model, dispatch, isCurrentUser }) => {
  return (
    <div className="profile-page">
      {pipe<RD.RemoteData<Error, ProfileResponse>, React.ReactNode>(
        model.profile,
        RD.fold(
          () => <div className="p-8 text-center">Loading profile...</div>,
          () => <div className="p-8 text-center">Loading profile...</div>,
          (err) => <div className="p-8 text-center text-red-500">Error loading profile: {err.message}</div>,
          (data) => (
            <>
              <div className="user-info bg-gray-100 py-8 mb-8 text-center">
                <div className="container mx-auto px-4">
                  <img src={data.profile.image || 'https://api.realworld.io/images/smiley-cyrus.jpeg'} className="w-24 h-24 rounded-full mx-auto mb-4" alt="" />
                  <h4 className="text-2xl font-bold mb-2">{data.profile.username}</h4>
                  <p className="text-gray-400 font-light mb-4">{data.profile.bio}</p>
                  
                  <div className="flex justify-end container mx-auto px-4">
                    {isCurrentUser ? (
                      <a href="/settings" className="btn btn-sm border border-gray-400 text-gray-400 px-2 py-1 rounded hover:bg-gray-200 transition-colors text-sm">
                        <i className="ion-gear-a"></i> Edit Profile Settings
                      </a>
                    ) : (
                      <button 
                        className={`btn btn-sm border px-2 py-1 rounded transition-colors text-sm ${data.profile.following ? 'bg-gray-400 text-white' : 'border-gray-400 text-gray-400 hover:bg-gray-200'}`}
                        onClick={() => dispatch({ _tag: data.profile.following ? 'Unfollow' : 'Follow' })}
                      >
                        <i className="ion-plus-round"></i> {data.profile.following ? `Unfollow ${data.profile.username}` : `Follow ${data.profile.username}`}
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

                    {pipe<RD.RemoteData<Error, ArticlesResponse>, React.ReactNode>(
                      model.articles,
                      RD.fold(
                        () => <div>Loading articles...</div>,
                        () => <div>Loading articles...</div>,
                        () => <div className="text-red-500">Error loading articles</div>,
                        (articlesData) => (
                          <div className="article-list">
                            {articlesData.articles.length === 0 ? (
                              <div className="py-4">No articles are here... yet.</div>
                            ) : (
                              articlesData.articles.map((article) => (
                                <div key={article.slug} className="article-preview py-6 border-t first:border-t-0">
                                  <div className="article-meta flex items-center mb-4">
                                    <a href={`/profile/${article.author.username}`}>
                                      <img src={article.author.image || 'https://api.realworld.io/images/smiley-cyrus.jpeg'} className="w-8 h-8 rounded-full" alt="" />
                                    </a>
                                    <div className="info ml-2 flex-grow">
                                      <a href={`/profile/${article.author.username}`} className="text-brand-primary font-medium block hover:underline">
                                        {article.author.username}
                                      </a>
                                      <span className="text-gray-400 text-xs">{new Date(article.createdAt).toDateString()}</span>
                                    </div>
                                    <button className="btn btn-sm outline-brand-primary border border-brand-primary text-brand-primary px-2 py-1 rounded hover:bg-brand-primary hover:text-white transition-colors text-sm">
                                      <i className="ion-heart"></i> {article.favoritesCount}
                                    </button>
                                  </div>
                                  <a href={`/article/${article.slug}`} className="preview-link">
                                    <h1 className="text-xl font-bold mb-1">{article.title}</h1>
                                    <p className="text-gray-400 font-light mb-4">{article.description}</p>
                                    <span className="text-gray-400 text-xs font-light">Read more...</span>
                                  </a>
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

function pipe<A, B>(a: A, f: (a: A) => B): B {
  return f(a);
}
