import React from 'react';
import type { Dispatcher } from 'tea-cup-fp';
import * as RD from '@devexperts/remote-data-ts';
import type { Model, Msg } from './type';
import type { ArticlesResponse, TagsResponse } from '../../api/type';

interface Props {
  model: Model;
  dispatch: Dispatcher<Msg>;
}

export const HomeView: React.FC<Props> = ({ model }) => {
  return (
    <div className="home-page">
      <div className="banner bg-brand-primary text-white py-8 mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-2 shadow-sm font-sans">conduit</h1>
          <p className="text-xl font-light">A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-3/4 px-4">
            <div className="feed-toggle mb-4">
              <ul className="flex border-b">
                <li className="mr-1">
                  <a className="bg-white inline-block py-2 px-4 text-brand-primary border-b-2 border-brand-primary font-medium" href="">Global Feed</a>
                </li>
              </ul>
            </div>

            {pipe<RD.RemoteData<Error, ArticlesResponse>, React.ReactNode>(
              model.articles,
              RD.fold(
                () => <div>Loading articles...</div>,
                () => <div>Loading articles...</div>,
                (err: Error) => <div className="text-red-500">Error loading articles: {err.message}</div>,
                (data: ArticlesResponse) => (
                  <div className="article-list">
                    {data.articles.length === 0 ? (
                      <div className="py-4">No articles are here... yet.</div>
                    ) : (
                      data.articles.map((article) => (
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
                            <h1 className="text-2xl font-bold mb-1">{article.title}</h1>
                            <p className="text-gray-400 font-light mb-4">{article.description}</p>
                            <span className="text-gray-400 text-xs font-light">Read more...</span>
                            <ul className="tag-list float-right flex space-x-1">
                              {article.tagList.map(tag => (
                                <li key={tag} className="tag-default tag-pill tag-outline">
                                  {tag}
                                </li>
                              ))}
                            </ul>
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                )
              )
            )}
          </div>

          <div className="w-full md:w-1/4 px-4">
            <div className="sidebar bg-gray-100 p-4 rounded">
              <p className="font-medium mb-3">Popular Tags</p>
              <div className="tag-list flex flex-wrap">
                {pipe<RD.RemoteData<Error, TagsResponse>, React.ReactNode>(
                  model.tags,
                  RD.fold(
                    () => <div>Loading tags...</div>,
                    () => <div>Loading tags...</div>,
                    () => <div>Error loading tags</div>,
                    (data: TagsResponse) => (
                      <>
                        {data.tags.map(tag => (
                          <a key={tag} href="" className="tag-pill">
                            {tag}
                          </a>
                        ))}
                      </>
                    )
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function pipe<A, B>(a: A, f: (a: A) => B): B {
  return f(a);
}
