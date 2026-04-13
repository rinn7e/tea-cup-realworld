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

import { bannerView } from '@/component/banner'
import { feedArticleView } from '@/component/feed-article'
import { feedTabListView } from '@/component/feed-tab-list'
import { paginButtonListView } from '@/component/pagin-button-list'
import { popularTagPanelView } from '@/component/popular-tag-panel'
import type { Model } from '@/type'

export const HomePage = ({ model }: { model: Model }) => {
  return (
    <div className='home-page'>
      {bannerView()}

      <div className='container page'>
        <div className='row'>
          <div className='col-md-9'>
            {feedTabListView()}

            {model.articlesResponse._tag === 'RemoteSuccess' &&
            model.articlesResponse.value
              ? pipe(
                  model.articlesResponse.value.articles,
                  A.map(feedArticleView),
                )
              : null}

            {paginButtonListView()}
          </div>

          <div className='col-md-3'>{popularTagPanelView()}</div>
        </div>
      </div>
    </div>
  )
}
