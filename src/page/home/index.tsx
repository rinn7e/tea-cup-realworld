/*
 * MIT License
 *
 * Copyright (c) 2025 Moremi Vannak
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import * as A from 'fp-ts/lib/Array'
import { pipe } from 'fp-ts/lib/function'

import * as Api from '@/generated/api'
import type { Model } from '@/type'

export const HomePage = ({ model }: { model: Model }) => {
  return (
    <div className='home-page'>
      <div className='banner'>
        <div className='container'>
          <h1 className='logo-font'>conduit</h1>
          <p>
            <a
              className='logo-font j:text-white!'
              href='https://github.com/vankeisb/react-tea-cup'
              target='_blank'
            >
              (react-tea-cup)
            </a>
          </p>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className='container page'>
        <div className='row'>
          <div className='col-md-9'>
            <div className='feed-toggle'>
              <ul className='nav nav-pills outline-active'>
                <li className='nav-item'>
                  <a className='nav-link' href=''>
                    Your Feed
                  </a>
                </li>
                <li className='nav-item'>
                  <a className='nav-link active' href=''>
                    Global Feed
                  </a>
                </li>
              </ul>
            </div>

            {/* <div className='article-preview'>
              <div className='article-meta'>
                <a href='/profile/eric-simons'>
                  <img src='http://i.imgur.com/Qr71crq.jpg' />
                </a>
                <div className='info'>
                  <a href='/profile/eric-simons' className='author'>
                    Eric Simons
                  </a>
                  <span className='date'>January 20th</span>
                </div>
                <button className='btn btn-outline-primary btn-sm pull-xs-right'>
                  <i className='ion-heart'></i> 29
                </button>
              </div>
              <a
                href='/article/how-to-build-webapps-that-scale'
                className='preview-link'
              >
                <h1>How to build webapps that scale</h1>
                <p>This is the description for the post.</p>
                <span>Read more...</span>
                <ul className='tag-list'>
                  <li className='tag-default tag-pill tag-outline'>
                    realworld
                  </li>
                  <li className='tag-default tag-pill tag-outline'>
                    implementations
                  </li>
                </ul>
              </a>
            </div>

            <div className='article-preview'>
              <div className='article-meta'>
                <a href='/profile/albert-pai'>
                  <img src='http://i.imgur.com/N4VcUeJ.jpg' />
                </a>
                <div className='info'>
                  <a href='/profile/albert-pai' className='author'>
                    Albert Pai
                  </a>
                  <span className='date'>January 20th</span>
                </div>
                <button className='btn btn-outline-primary btn-sm pull-xs-right'>
                  <i className='ion-heart'></i> 32
                </button>
              </div>
              <a href='/article/the-song-you' className='preview-link'>
                <h1>
                  The song you won't ever stop singing. No matter how hard you
                  try.
                </h1>
                <p>This is the description for the post.</p>
                <span>Read more...</span>
                <ul className='tag-list'>
                  <li className='tag-default tag-pill tag-outline'>
                    realworld
                  </li>
                  <li className='tag-default tag-pill tag-outline'>
                    implementations
                  </li>
                </ul>
              </a>
            </div> */}

            {model.articlesResponse._tag === 'RemoteSuccess' &&
            model.articlesResponse.value
              ? pipe(model.articlesResponse.value.articles, A.map(articleView))
              : null}

            <ul className='pagination'>
              <li className='page-item active'>
                <a className='page-link' href=''>
                  1
                </a>
              </li>
              <li className='page-item'>
                <a className='page-link' href=''>
                  2
                </a>
              </li>
            </ul>
          </div>

          <div className='col-md-3'>
            <div className='sidebar'>
              <p>Popular Tags</p>

              <div className='tag-list'>
                <a href='' className='tag-pill tag-default'>
                  programming
                </a>
                <a href='' className='tag-pill tag-default'>
                  javascript
                </a>
                <a href='' className='tag-pill tag-default'>
                  emberjs
                </a>
                <a href='' className='tag-pill tag-default'>
                  angularjs
                </a>
                <a href='' className='tag-pill tag-default'>
                  react
                </a>
                <a href='' className='tag-pill tag-default'>
                  mean
                </a>
                <a href='' className='tag-pill tag-default'>
                  node
                </a>
                <a href='' className='tag-pill tag-default'>
                  rails
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const articleView = (article: Api.GetArticlesResponse['articles'][0]) => {
  return (
    <div key={article.slug} className='article-preview'>
      {articleTopPanelView(article)}
      <a href='/article/the-song-you' className='preview-link'>
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
        <ul className='tag-list'>{pipe(article.tagList, A.map(tagView))}</ul>
      </a>
    </div>
  )
}

const articleTopPanelView = (
  article: Api.GetArticlesResponse['articles'][0],
) => {
  return (
    <div className='article-meta'>
      <a href={`/profile/{article.author.username}`}>
        <img src={article.author.image} />
      </a>
      <div className='info'>
        <a href='/profile/albert-pai' className='author'>
          {article.author.username}
        </a>
        <span className='date'>{article.createdAt}</span>
      </div>
      <button className='btn btn-outline-primary btn-sm pull-xs-right'>
        <i className='ion-heart'></i> {article.favoritesCount}
      </button>
    </div>
  )
}

const tagView = (tag: string) => {
  return (
    <li key={tag} className='tag-default tag-pill tag-outline'>
      {tag}
    </li>
  )
}
