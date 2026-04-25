import {
  Formatter,
  Match,
  Parser,
  Route,
  end,
  format,
  lit,
  parse,
  query,
  str,
  zero,
} from '@rinn7e/fp-ts-routing'
import { booleanFromUndefinedWithDefault } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import * as t from 'io-ts'

import { BASE_URL } from '@/env'

import type { AppPage, AppRoute } from './type'
import {
  articlePage,
  editorPage,
  homePage,
  loginPage,
  notFoundPage,
  profilePage,
  settingsPage,
  signupPage,
} from './type'

export const removeBaseUrl = (href: string): string => {
  const url = new URL(href)
  let pathname = url.pathname
  const base = BASE_URL.replace(/\/$/, '')
  if (base !== '' && pathname.startsWith(base)) {
    pathname = pathname.slice(base.length)
  }
  return (pathname || '/') + url.search
}

export const addBaseUrl = (path: string): string => {
  const base = BASE_URL.replace(/\/$/, '')
  const cleanPath = path.replace(/^\//, '')
  return base + '/' + cleanPath
}

// Parser
// ------------------------------------------------------------------

const homeParams = t.exact(
  t.partial({
    tab: t.union([t.literal('global-feed'), t.literal('user-feed')]),
  }),
)

const homeMatch = query(homeParams).and(end)
const loginMatch = lit('login').and(end)
const signupMatch = lit('signup').and(end)
const settingsMatch = lit('settings').and(end)
const editorMatch: Match<object> = lit('editor').and(end)
const editorSlugMatch: Match<{ slug: string }> = lit('editor')
  .and(str('slug'))
  .and(end)
const articleMatch: Match<{ slug: string }> = lit('article')
  .and(str('slug'))
  .and(end)

const profileParams = t.exact(
  t.partial({
    favorites: t.string,
  }),
)

const profileMatch = lit('profile')
  .and(str('username'))
  .and(query(profileParams))
  .and(end)

const anyStrings = new Match<object>(
  new Parser((r) => O.some([{}, new Route([], r.query)])),
  new Formatter((r) => r),
)

const appRouter: Parser<AppPage> = zero<AppPage>()
  .alt(homeMatch.parser.map(({ tab }) => homePage(tab || 'global-feed')))
  .alt(loginMatch.parser.map(() => loginPage()))
  .alt(signupMatch.parser.map(() => signupPage()))
  .alt(settingsMatch.parser.map(() => settingsPage()))
  .alt(editorMatch.parser.map(() => editorPage(O.none)))
  .alt(editorSlugMatch.parser.map(({ slug }) => editorPage(O.some(slug))))
  .alt(articleMatch.parser.map(({ slug }) => articlePage(slug)))
  .alt(
    profileMatch.parser.map(({ username, favorites }) =>
      profilePage(username, booleanFromUndefinedWithDefault(favorites, false)),
    ),
  )
  .alt(anyStrings.parser.map(() => notFoundPage()))

export const parseAppRoute = (_mainUrl: string, href: string): AppRoute => {
  const pathname = removeBaseUrl(href)
  const page = parse(appRouter, Route.parse(pathname), homePage())
  return { page }
}

// Formatter
// ------------------------------------------------------------------

export const toUrlString = (r: AppRoute): string => {
  const page = r.page
  const getPath = () => {
    switch (page._tag) {
      case 'HomePage':
        return format(homeMatch.formatter, {
          tab: page.tab === 'global-feed' ? undefined : page.tab,
        })
      case 'LoginPage':
        return format(loginMatch.formatter, {})
      case 'SignupPage':
        return format(signupMatch.formatter, {})
      case 'SettingsPage':
        return format(settingsMatch.formatter, {})
      case 'EditorPage':
        return O.isSome(page.slug)
          ? format(editorSlugMatch.formatter, { slug: page.slug.value })
          : format(editorMatch.formatter, {})
      case 'ArticlePage':
        return format(articleMatch.formatter, { slug: page.slug })
      case 'ProfilePage':
        return format(profileMatch.formatter, {
          username: page.username,
          favorites: page.favorites ? 'true' : undefined,
        })
      case 'NotFoundPage':
        return '404'
    }
  }

  const path = getPath()
  return addBaseUrl(path)
}
