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

import { pipe } from 'fp-ts/lib/function'
import { useCallback } from 'react'

import { footer, nav } from '@/component/common'
import { SetGlobalMsgContext } from '@/component/global-context'
import { ArticlePage } from '@/page/article'
import { CreateArticlePage } from '@/page/create-article'
import { HomePage } from '@/page/home'
import { LoginPage } from '@/page/login'
import { ProfilePage } from '@/page/profile'
import { RegisterPage } from '@/page/register'
import { SettingPage } from '@/page/setting'
import type { Model, Msg, Props } from './type'

const pageView = (model: Model) => {
  switch (model.route.page._tag) {
    case 'HomePage':
      return <HomePage />
    case 'LoginPage':
      return <LoginPage />
    case 'RegisterPage':
      return <RegisterPage />
    case 'ProfilePage':
      return <ProfilePage />
    case 'SettingPage':
      return <SettingPage />
    case 'CreateArticlePage':
      return <CreateArticlePage />
    case 'ArticlePage':
      return <ArticlePage />
  }
}

export const View = (props: Props) => {
  const { dispatch, model } = props

  // Handlers
  // ----------------------------------

  // Dispatch never changes
  const memoDispatch = useCallback((msg: Msg) => dispatch(msg), [dispatch])

  // Views
  // ----------------------------------

  const view = () => (
    <div className='w-full h-full flex flex-col'>
      {nav(props)}
      {pageView(model)}
      {footer()}
    </div>
  )

  // prettier-ignore
  return pipe(view(), (c) => (
    <SetGlobalMsgContext.Provider value={memoDispatch}>{c}</SetGlobalMsgContext.Provider>
  ))
}
