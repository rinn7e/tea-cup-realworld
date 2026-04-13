import React from 'react';
import ReactMarkdown from 'react-markdown';
import * as RD from '@devexperts/remote-data-ts';
import type { Model, Msg } from './type';
import type { ArticleResponse, CommentsResponse } from '../../api/type';

import { Link } from '../../component/Link';
import { pipe } from 'fp-ts/lib/function';

interface Props {
  model: Model;
  dispatch: (msg: Msg) => void;
}

export const ArticleView: React.FC<Props> = ({ model }) => {
  return (
    <div className="article-page">
      {pipe(
        model.article,
        RD.fold(
          () => <div className="p-8 text-center">Loading article...</div>,
          () => <div className="p-8 text-center">Loading article...</div>,
          (err: Error) => <div className="p-8 text-center text-red-500">Error loading article: {err.message}</div>,
          (data: ArticleResponse) => (
            <>
              <div className="banner bg-[#333] text-white py-8 mb-8">
                <div className="container mx-auto px-4">
                  <h1 className="text-4xl font-bold mb-6">{data.article.title}</h1>
                  <div className="article-meta flex items-center">
                    <Link route={{ page: { _tag: 'ProfilePage', username: data.article.author.username, favorites: false } }}>
                      <img src={data.article.author.image || 'https://api.realworld.io/images/smiley-cyrus.jpeg'} className="w-8 h-8 rounded-full" alt="" />
                    </Link>
                    <div className="info ml-2">
                      <Link
                        route={{ page: { _tag: 'ProfilePage', username: data.article.author.username, favorites: false } }}
                        className="text-white block font-medium hover:underline"
                      >
                        {data.article.author.username}
                      </Link>
                      <span className="text-gray-400 text-xs">{new Date(data.article.createdAt).toDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="container mx-auto px-4">
                <div className="article-content mb-12 prose max-w-none">
                  <ReactMarkdown>{data.article.body}</ReactMarkdown>
                </div>

                <hr className="my-12 border-gray-200" />

                <div className="article-actions flex justify-center mb-12">
                   {/* Meta again for the bottom */}
                </div>

                <div className="flex flex-wrap justify-center">
                  <div className="w-full md:w-3/5">
                    {pipe(
                      model.comments,
                      RD.fold(
                        () => <div className="text-center">Loading comments...</div>,
                        () => <div className="text-center">Loading comments...</div>,
                        (err: Error) => <div className="text-center text-red-500">Error loading comments: {err.message}</div>,
                        (commentsData: CommentsResponse) => (
                          <div className="comments-list space-y-4">
                            {commentsData.comments.map((comment) => (
                              <div key={comment.id} className="card border rounded border-gray-200">
                                <div className="card-block p-4">
                                  <p className="card-text text-gray-700">{comment.body}</p>
                                </div>
                                <div className="card-footer bg-gray-50 p-3 flex items-center text-xs text-gray-400 border-t border-gray-200">
                                  <Link route={{ page: { _tag: 'ProfilePage', username: comment.author.username, favorites: false } }} className="comment-author">
                                    <img src={comment.author.image || 'https://api.realworld.io/images/smiley-cyrus.jpeg'} className="w-5 h-5 rounded-full mr-2" alt="" />
                                  </Link>
                                  <Link
                                    route={{ page: { _tag: 'ProfilePage', username: comment.author.username, favorites: false } }}
                                    className="hover:underline font-medium text-brand-primary mr-2"
                                  >
                                    {comment.author.username}
                                  </Link>
                                  <span>{new Date(comment.createdAt).toDateString()}</span>
                                </div>
                              </div>
                            ))}
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
