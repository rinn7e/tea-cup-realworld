import type { Option } from 'fp-ts/lib/Option'

import type { User } from './api/type'
import type * as DebugPanel from './component/debug-panel'
import type { AppRoute } from './data/route'
import type * as ArticlePage from './page/article/type'
import type * as AuthPage from './page/auth/type'
import type * as EditorPage from './page/editor/type'
import type * as HomePage from './page/home/type'
import type * as ProfilePage from './page/profile/type'
import type * as SettingsPage from './page/settings/type'

export type Route = AppRoute

export type Shared = {
  user: Option<User>
  token: Option<string>
}

export type PageModel =
  | { _tag: 'HomePageModel'; model: HomePage.Model }
  | { _tag: 'ArticlePageModel'; model: ArticlePage.Model }
  | { _tag: 'AuthPageModel'; model: AuthPage.Model }
  | { _tag: 'SettingsPageModel'; model: SettingsPage.Model }
  | { _tag: 'ProfilePageModel'; model: ProfilePage.Model }
  | { _tag: 'EditorPageModel'; model: EditorPage.Model }
  | { _tag: 'NotFoundPageModel' }

export type AnimateState =
  | { _tag: 'AnimateIn' }
  | { _tag: 'Visible' }
  | { _tag: 'AnimateOut' }
  | { _tag: 'Invisible' }

export type Animate<A> = {
  internal: A
  state: AnimateState
}

export type Model = {
  route: Route
  shared: Shared
  pageModel: PageModel
  isInternal: boolean
  debugPanel: DebugPanel.Model
  navbarMobileOpen: Animate<null>
}

export type Msg =
  | { _tag: 'NoOp' }
  | { _tag: 'Init'; location: Location; user: Option<User> }
  | { _tag: 'UrlChange'; location: Location }
  | { _tag: 'ChangeRoute'; route: Route }
  | { _tag: 'SetUser'; user: Option<User> }
  | { _tag: 'HomePageMsg'; subMsg: HomePage.Msg }
  | { _tag: 'ArticlePageMsg'; subMsg: ArticlePage.Msg }
  | { _tag: 'AuthPageMsg'; subMsg: AuthPage.Msg }
  | { _tag: 'SettingsPageMsg'; subMsg: SettingsPage.Msg }
  | { _tag: 'ProfilePageMsg'; subMsg: ProfilePage.Msg }
  | { _tag: 'EditorPageMsg'; subMsg: EditorPage.Msg }
  | { _tag: 'DebugPanelMsg'; subMsg: DebugPanel.Msg }
  | { _tag: 'ToggleNavbarMobile'; open: boolean }
  | { _tag: 'SetNavbarMobileState'; state: AnimateState }
