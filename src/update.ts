import { Cmd, Task } from 'tea-cup-fp';
import { newUrl } from 'react-tea-cup';
import { pipe } from 'fp-ts/lib/function';
import * as O from 'fp-ts/lib/Option';
import type { Model, Msg, Route } from './type';
import type { User } from './api/type';
import { parseRoute } from './router';
import * as Home from './page/home/update';
import * as Article from './page/article/update';
import * as Auth from './page/auth/update';
import * as Settings from './page/settings/update';
import * as Profile from './page/profile/update';
import * as Editor from './page/editor/update';

export const init = (location: Location): [Model, Cmd<Msg>] => {
  const route = parseRoute(location);
  const model: Model = {
    route,
    shared: {
      user: O.none,
    },
    page: { _tag: 'Loading' },
  };

  return initPage(model, route);
};

const initPage = (model: Model, route: Route): [Model, Cmd<Msg>] => {
  switch (route._tag) {
    case 'Home': {
      const [homeModel, homeCmd] = Home.init();
      return [
        { ...model, route, page: { _tag: 'Home', model: homeModel } },
        homeCmd.map((msg) => ({ _tag: 'HomeMsg', msg })),
      ];
    }
    case 'Article': {
      const [articleModel, articleCmd] = Article.init(route.slug);
      return [
        { ...model, route, page: { _tag: 'Article', model: articleModel } },
        articleCmd.map((msg) => ({ _tag: 'ArticleMsg', msg })),
      ];
    }
    case 'Login': {
      const [authModel, authCmd] = Auth.init(false);
      return [
        { ...model, route, page: { _tag: 'Auth', model: authModel } },
        authCmd.map((msg) => ({ _tag: 'AuthMsg', msg })),
      ];
    }
    case 'Register': {
      const [authModel, authCmd] = Auth.init(true);
      return [
        { ...model, route, page: { _tag: 'Auth', model: authModel } },
        authCmd.map((msg) => ({ _tag: 'AuthMsg', msg })),
      ];
    }
    case 'Settings': {
      if (model.shared.user._tag === 'Some') {
        const [settingsModel, settingsCmd] = Settings.init(model.shared.user.value);
        return [
          { ...model, route, page: { _tag: 'Settings', model: settingsModel } },
          settingsCmd.map((msg) => ({ _tag: 'SettingsMsg', msg })),
        ];
      }
      return [model, Task.perform(newUrl('/login'), () => ({ _tag: 'None' } as any))];
    }
    case 'Profile': {
      const [profileModel, profileCmd] = Profile.init(route.username, route.favorites, model.shared.user);
      return [
        { ...model, route, page: { _tag: 'Profile', model: profileModel } },
        profileCmd.map((msg) => ({ _tag: 'ProfileMsg', msg })),
      ];
    }
    case 'Editor': {
      if (model.shared.user._tag === 'Some') {
        const [editorModel, editorCmd] = Editor.init(route.slug);
        return [
          { ...model, route, page: { _tag: 'Editor', model: editorModel } },
          editorCmd.map((msg) => ({ _tag: 'EditorMsg', msg })),
        ];
      }
      return [model, Task.perform(newUrl('/login'), () => ({ _tag: 'None' } as any))];
    }
    default:
      return [{ ...model, route, page: { _tag: 'NotFound' } }, Cmd.none()];
  }
};

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'UrlChange': {
      const route = parseRoute(msg.location);
      return initPage(model, route);
    }
    case 'Navigate': {
      return [model, Cmd.none()];
    }
    case 'SetUser': {
      return [{ ...model, shared: { ...model.shared, user: msg.user } }, Cmd.none()];
    }
    case 'HomeMsg':
      if (model.page._tag === 'Home') {
        const [homeModel, homeCmd] = Home.update(msg.msg, model.page.model);
        return [
          { ...model, page: { _tag: 'Home', model: homeModel } },
          homeCmd.map((msg) => ({ _tag: 'HomeMsg', msg })),
        ];
      }
      return [model, Cmd.none()];
    case 'ArticleMsg':
      if (model.page._tag === 'Article') {
        const [articleModel, articleCmd] = Article.update(msg.msg, model.page.model);
        return [
          { ...model, page: { _tag: 'Article', model: articleModel } },
          articleCmd.map((msg) => ({ _tag: 'ArticleMsg', msg })),
        ];
      }
      return [model, Cmd.none()];
    case 'AuthMsg':
      if (model.page._tag === 'Auth') {
        const [authModel, authCmd] = Auth.update(msg.msg, model.page.model);
        const newModel = { ...model, page: { _tag: 'Auth', model: authModel } as const };
        
        // Check for success in SubmitResponse
        if (msg.msg._tag === 'SubmitResponse' && msg.msg.result.tag === 'Ok') {
          const user = msg.msg.result.value.user;
          return [
            {
              ...newModel,
              shared: { ...newModel.shared, user: O.some(user) }
            },
            Cmd.batch([
              authCmd.map((m) => ({ _tag: 'AuthMsg', msg: m })),
              Task.perform(newUrl('/'), () => ({ _tag: 'None' } as any))
            ])
          ];
        }

        return [
          newModel,
          authCmd.map((msg) => ({ _tag: 'AuthMsg', msg })),
        ];
      }
      return [model, Cmd.none()];
    case 'SettingsMsg':
      if (model.page._tag === 'Settings' && model.shared.user._tag === 'Some') {
        const token = model.shared.user.value.token;
        const [settingsModel, settingsCmd] = Settings.update(token)(msg.msg, model.page.model);
        const newModel = { ...model, page: { _tag: 'Settings', model: settingsModel } as const };

        if (msg.msg._tag === 'Logout') {
          return [
            { ...model, shared: { ...model.shared, user: O.none } },
            Task.perform(newUrl('/'), () => ({ _tag: 'None' } as any))
          ];
        }

        if (msg.msg._tag === 'SubmitResponse' && msg.msg.result.tag === 'Ok') {
          const user = msg.msg.result.value.user;
          return [
            { ...newModel, shared: { ...newModel.shared, user: O.some(user) } },
            settingsCmd.map((m) => ({ _tag: 'SettingsMsg', msg: m }))
          ];
        }

        return [
          newModel,
          settingsCmd.map((m) => ({ _tag: 'SettingsMsg', msg: m }))
        ];
      }
      return [model, Cmd.none()];
    case 'ProfileMsg':
      if (model.page._tag === 'Profile') {
        const username = model.page.model.profile._tag === 'RemoteSuccess' ? model.page.model.profile.value.profile.username : (model.route._tag === 'Profile' ? model.route.username : '');
        const token = pipe(model.shared.user, O.map((u: User) => u.token));
        const [profileModel, profileCmd] = Profile.update(username, token)(msg.msg, model.page.model);
        return [
          { ...model, page: { _tag: 'Profile', model: profileModel } },
          profileCmd.map((m) => ({ _tag: 'ProfileMsg', msg: m }))
        ];
      }
      return [model, Cmd.none()];
    case 'EditorMsg':
      if (model.page._tag === 'Editor' && model.shared.user._tag === 'Some') {
        const token = model.shared.user.value.token;
        const [editorModel, editorCmd] = Editor.update(token)(msg.msg, model.page.model);
        const newModel = { ...model, page: { _tag: 'Editor', model: editorModel } as const };

        if (msg.msg._tag === 'SubmitResponse' && msg.msg.result.tag === 'Ok') {
          const slug = msg.msg.result.value.article.slug;
          return [
            newModel,
            Cmd.batch([
              editorCmd.map((m) => ({ _tag: 'EditorMsg', msg: m })),
              Task.perform(newUrl(`/article/${slug}`), () => ({ _tag: 'None' } as any))
            ])
          ];
        }

        return [
          newModel,
          editorCmd.map((m) => ({ _tag: 'EditorMsg', msg: m }))
        ];
      }
      return [model, Cmd.none()];
  }
};
