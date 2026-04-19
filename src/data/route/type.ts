import * as EqClass from 'fp-ts/lib/Eq'
import * as O from 'fp-ts/lib/Option'
import { type Option } from 'fp-ts/lib/Option'
import * as B from 'fp-ts/lib/boolean'
import * as S from 'fp-ts/lib/string'

export type HomePage = {
  readonly _tag: 'HomePage'
}

export type LoginPage = {
  readonly _tag: 'LoginPage'
}

export type RegisterPage = {
  readonly _tag: 'RegisterPage'
}

export type SettingsPage = {
  readonly _tag: 'SettingsPage'
}

export type EditorPage = {
  readonly _tag: 'EditorPage'
  slug: Option<string>
}

export type ArticlePage = {
  readonly _tag: 'ArticlePage'
  slug: string
}

export type ProfilePage = {
  readonly _tag: 'ProfilePage'
  username: string
  favorites: boolean
}

export type NotFoundPage = {
  readonly _tag: 'NotFoundPage'
}

export type AppPage =
  | HomePage
  | LoginPage
  | RegisterPage
  | SettingsPage
  | EditorPage
  | ArticlePage
  | ProfilePage
  | NotFoundPage

export const HomePageEq: EqClass.Eq<HomePage> = EqClass.struct({
  _tag: S.Eq,
})

export const LoginPageEq: EqClass.Eq<LoginPage> = EqClass.struct({
  _tag: S.Eq,
})

export const RegisterPageEq: EqClass.Eq<RegisterPage> = EqClass.struct({
  _tag: S.Eq,
})

export const SettingsPageEq: EqClass.Eq<SettingsPage> = EqClass.struct({
  _tag: S.Eq,
})

export const EditorPageEq: EqClass.Eq<EditorPage> = EqClass.struct({
  _tag: S.Eq,
  slug: O.getEq(S.Eq),
})

export const ArticlePageEq: EqClass.Eq<ArticlePage> = EqClass.struct({
  _tag: S.Eq,
  slug: S.Eq,
})

export const ProfilePageEq: EqClass.Eq<ProfilePage> = EqClass.struct({
  _tag: S.Eq,
  username: S.Eq,
  favorites: B.Eq,
})

export const NotFoundPageEq: EqClass.Eq<NotFoundPage> = EqClass.struct({
  _tag: S.Eq,
})

export const AppPageEq: EqClass.Eq<AppPage> = {
  equals: (x, y) => {
    if (x._tag === 'HomePage' && y._tag === 'HomePage') {
      return HomePageEq.equals(x, y)
    } else if (x._tag === 'LoginPage' && y._tag === 'LoginPage') {
      return LoginPageEq.equals(x, y)
    } else if (x._tag === 'RegisterPage' && y._tag === 'RegisterPage') {
      return RegisterPageEq.equals(x, y)
    } else if (x._tag === 'SettingsPage' && y._tag === 'SettingsPage') {
      return SettingsPageEq.equals(x, y)
    } else if (x._tag === 'EditorPage' && y._tag === 'EditorPage') {
      return EditorPageEq.equals(x, y)
    } else if (x._tag === 'ArticlePage' && y._tag === 'ArticlePage') {
      return ArticlePageEq.equals(x, y)
    } else if (x._tag === 'ProfilePage' && y._tag === 'ProfilePage') {
      return ProfilePageEq.equals(x, y)
    } else if (x._tag === 'NotFoundPage' && y._tag === 'NotFoundPage') {
      return NotFoundPageEq.equals(x, y)
    } else {
      return false
    }
  },
}

export const AppRouteEq: EqClass.Eq<AppRoute> = EqClass.struct({
  page: AppPageEq,
})

export type AppRoute = {
  page: AppPage
}

export const defaultAppRoute = (): AppRoute => ({
  page: { _tag: 'HomePage' },
})

export const homePage = (): AppPage => ({ _tag: 'HomePage' })
export const loginPage = (): AppPage => ({ _tag: 'LoginPage' })
export const registerPage = (): AppPage => ({ _tag: 'RegisterPage' })
export const settingsPage = (): AppPage => ({ _tag: 'SettingsPage' })
export const editorPage = (slug: Option<string>): AppPage => ({
  _tag: 'EditorPage',
  slug,
})
export const articlePage = (slug: string): AppPage => ({
  _tag: 'ArticlePage',
  slug,
})
export const profilePage = (username: string, favorites: boolean): AppPage => ({
  _tag: 'ProfilePage',
  username,
  favorites,
})
export const notFoundPage = (): AppPage => ({ _tag: 'NotFoundPage' })
