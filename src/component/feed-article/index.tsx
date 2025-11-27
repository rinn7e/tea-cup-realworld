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

export const feedArticleView = (
  article: Api.GetArticlesResponse['articles'][0],
) => {
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
