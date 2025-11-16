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

import type { Dispatcher } from 'tea-cup-fp'

import type { AppPage, AppRoute } from '@/data/route'

export type Model = {
  title: string
  isInternal: boolean
  route: AppRoute
}

export type Props = {
  dispatch: Dispatcher<Msg>
  model: Model
}

export type Msg =
  | { _tag: 'NoOp' }
  | { _tag: 'UrlChange'; location: Location }
  | { _tag: 'Navigate'; route: AppRoute }
  // The same as 'Navigate', but changing route pre-condition lives here
  | { _tag: 'ChangeRoute'; route: AppRoute }
  | { _tag: 'ModifyRoute'; func: (r: AppRoute) => AppRoute }
  | { _tag: 'ChangePage'; page: AppPage }
