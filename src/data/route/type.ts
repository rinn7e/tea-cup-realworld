import { type Option } from 'fp-ts/lib/Option'

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
