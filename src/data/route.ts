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

export type HomePage = {
  _tag: 'HomePage'
}

export type LoginPage = {
  _tag: 'LoginPage'
}

export type SignupPage = {
  _tag: 'SignupPage'
}

export type SettingPage = {
  _tag: 'SettingPage'
}

export type CreateArticlePage = {
  _tag: 'CreateArticlePage'
}

export type ArticlePage = {
  _tag: 'ArticlePage'
}

export type ProfilePage = {
  _tag: 'ProfilePage'
}
export type NotFoundPage = {
  _tag: 'NotFoundPage'
}

export type AppPage =
  | HomePage
  | LoginPage
  | SignupPage
  | SettingPage
  | CreateArticlePage
  | ArticlePage
  | ProfilePage
  | NotFoundPage

export const homePage = () => ({ _tag: 'HomePage' }) satisfies HomePage
export const loginPage = () => ({ _tag: 'LoginPage' }) satisfies LoginPage
export const signupPage = () => ({ _tag: 'SignupPage' }) satisfies SignupPage
export const settingPage = () => ({ _tag: 'SettingPage' }) satisfies SettingPage
export const createArticlePage = () =>
  ({ _tag: 'CreateArticlePage' }) satisfies CreateArticlePage
export const articlePage = () => ({ _tag: 'ArticlePage' }) satisfies ArticlePage
export const profilePage = () => ({ _tag: 'ProfilePage' }) satisfies ProfilePage
export const notFoundPage = () =>
  ({ _tag: 'NotFoundPage' }) satisfies NotFoundPage

export const route = (page: AppPage): AppRoute => ({ page })

export type AppRoute = {
  page: AppPage
  // Other params that shared across page lives here
  // ...
}

export type AppRouteUpdater = ((current: AppRoute) => AppRoute) | null

export const parseAppRoute = (url: string, _href: string): AppRoute => {
  if (url === '/' || url === '') {
    return route(homePage())
  } else if (url.split('/')[1] === 'article') {
    return route(articlePage())
  } else if (url === '/login') {
    return route(loginPage())
  } else if (url === '/signup') {
    return route(signupPage())
  } else {
    return route(notFoundPage())
  }
}

export const toUrlString = (r: AppRoute): string => {
  const route = (() => {
    switch (r.page._tag) {
      case 'HomePage': {
        return '/'
      }
      case 'LoginPage': {
        return '/login'
      }
      case 'SignupPage': {
        return '/signup'
      }
      case 'SettingPage': {
        return '/setting'
      }
      case 'CreateArticlePage': {
        return '/create-article'
      }
      case 'ArticlePage': {
        return '/article'
      }
      case 'ProfilePage': {
        return '/profile'
      }
      case 'NotFoundPage': {
        return ''
      }
    }
  })()

  return route
}
