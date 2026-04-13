import type { Option } from 'fp-ts/lib/Option';
import type { User } from './api/type';
import type * as Home from './page/home/type';
import type * as Article from './page/article/type';
import type * as Auth from './page/auth/type';
import type * as Settings from './page/settings/type';
import type * as Profile from './page/profile/type';
import type * as Editor from './page/editor/type';

export type Route =
  | { _tag: 'Home' }
  | { _tag: 'Login' }
  | { _tag: 'Register' }
  | { _tag: 'Settings' }
  | { _tag: 'Editor'; slug: Option<string> }
  | { _tag: 'Article'; slug: string }
  | { _tag: 'Profile'; username: string; favorites: boolean }
  | { _tag: 'NotFound' };

export type Shared = {
  user: Option<User>;
};

export type PageModel =
  | { _tag: 'Home'; model: Home.Model }
  | { _tag: 'Article'; model: Article.Model }
  | { _tag: 'Auth'; model: Auth.Model }
  | { _tag: 'Settings'; model: Settings.Model }
  | { _tag: 'Profile'; model: Profile.Model }
  | { _tag: 'Editor'; model: Editor.Model }
  | { _tag: 'NotFound' }
  | { _tag: 'Loading' };

export type Model = {
  route: Route;
  shared: Shared;
  page: PageModel;
};

export type Msg =
  | { _tag: 'UrlChange'; location: Location }
  | { _tag: 'Navigate'; route: Route }
  | { _tag: 'SetUser'; user: Option<User> }
  | { _tag: 'HomeMsg'; msg: Home.Msg }
  | { _tag: 'ArticleMsg'; msg: Article.Msg }
  | { _tag: 'AuthMsg'; msg: Auth.Msg }
  | { _tag: 'SettingsMsg'; msg: Settings.Msg }
  | { _tag: 'ProfileMsg'; msg: Profile.Msg }
  | { _tag: 'EditorMsg'; msg: Editor.Msg };
