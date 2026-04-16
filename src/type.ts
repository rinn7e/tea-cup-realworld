import type { Option } from 'fp-ts/lib/Option'

import type { User } from './api/type'
import type * as DebugPanel from './component/debug-panel/type'
import type { AppRoute } from './data/route'
import type * as Article from './page/article/type'
import type * as Auth from './page/auth/type'
import type * as Editor from './page/editor/type'
import type * as Home from './page/home/type'
import type * as Profile from './page/profile/type'
import type * as Settings from './page/settings/type'

export type Route = AppRoute

export type Shared = {
  user: Option<User>
  token: Option<string>
}

export type PageModel =
  | { _tag: 'Home'; model: Home.Model }
  | { _tag: 'Article'; model: Article.Model }
  | { _tag: 'Auth'; model: Auth.Model }
  | { _tag: 'Settings'; model: Settings.Model }
  | { _tag: 'Profile'; model: Profile.Model }
  | { _tag: 'Editor'; model: Editor.Model }
  | { _tag: 'NotFound' }
  | { _tag: 'Loading' }

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
  page: PageModel
  isInternal: boolean
  debugPanel: DebugPanel.Model
  navbarMobileOpen: Animate<null>
}

export type Msg =
  | { _tag: 'UrlChange'; location: Location }
  | { _tag: 'ChangeRoute'; route: Route }
  | { _tag: 'SetUser'; user: Option<User> }
  | { _tag: 'HomeMsg'; msg: Home.Msg }
  | { _tag: 'ArticleMsg'; msg: Article.Msg }
  | { _tag: 'AuthMsg'; msg: Auth.Msg }
  | { _tag: 'SettingsMsg'; msg: Settings.Msg }
  | { _tag: 'ProfileMsg'; msg: Profile.Msg }
  | { _tag: 'EditorMsg'; msg: Editor.Msg }
  | { _tag: 'DebugPanelMsg'; msg: DebugPanel.Msg }
  | { _tag: 'ToggleNavbarMobile'; open: boolean }
  | { _tag: 'SetNavbarMobileState'; state: AnimateState }
  | { _tag: 'None' }
