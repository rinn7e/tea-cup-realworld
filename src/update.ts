import {
  delayCmd,
  msgCmd,
  taskFromTE,
  updateAndCmd,
} from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { newUrl } from 'react-tea-cup'
import { Cmd, Task } from 'tea-cup-fp'

import { getCurrentUser } from './api'
import type { User } from './api/type'
import * as DebugPanel from './component/debug-panel'
import { AppRouteEq, homePage, parseAppRoute, toUrlString } from './data/route'
import * as ArticlePage from './page/article/update'
import * as LoginPage from './page/login/update'
import * as RegisterPage from './page/register/update'
import * as EditorPage from './page/editor/update'
import * as HomePage from './page/home/update'
import * as ProfilePage from './page/profile/update'
import * as SettingsPage from './page/settings/update'
import type { Model, Msg, Route } from './type'
import { getToken, removeToken, saveToken } from './util/storage'

// Initialization
// ---------------------------------------------

export const preInit = (location: Location): [Model | null, Cmd<Msg>] => {
  return [null, initializeCmd(location)]
}

export const preUpdate = (
  msg: Msg,
  model: Model | null,
): [Model | null, Cmd<Msg>] => {
  if (model === null) {
    if (msg._tag === 'Init') {
      return init(msg.location, msg.user)
    }
    return [null, Cmd.none()]
  }

  return update(msg, model)
}

// Init, Update
// ---------------------------------------------

export const init = (
  location: Location,
  user: O.Option<User>,
): [Model, Cmd<Msg>] => {
  const route = parseAppRoute('', location.href)
  const token = pipe(
    user,
    O.map((u) => u.token),
  )
  const model: Model = {
    route,
    shared: {
      user,
      token,
    },
    pageModel: { _tag: 'NotFoundPageModel' },
    isInternal: false,
    debugPanel: DebugPanel.init(),
    navbarMobileOpen: { internal: null, state: { _tag: 'Invisible' } },
  }

  return navigate(route, true)(model)
}

export const initializeCmd = (location: Location): Cmd<Msg> => {
  const storedToken = getToken()
  if (storedToken) {
    return Task.attempt(
      taskFromTE(getCurrentUser(storedToken)),
      (res): Msg => ({
        _tag: 'Init',
        location,
        user: res.tag === 'Ok' ? O.some(res.value.user) : O.none,
      }),
    )
  }
  return msgCmd({ _tag: 'Init', location, user: O.none })
}

const _getUserCmd = (storedToken: string): Cmd<Msg> =>
  Task.attempt(taskFromTE(getCurrentUser(storedToken)), (res) => {
    const msg: Msg = {
      _tag: 'SetUser',
      user: res.tag === 'Ok' ? O.some(res.value.user) : O.none,
    }
    return msg
  })

const navigate =
  (newRoute: Route, isInternal: boolean) =>
  (model: Model): [Model, Cmd<Msg>] => {
    const urlCmd = isInternal
      ? Task.perform(
          newUrl(toUrlString(newRoute)),
          (): Msg => ({ _tag: 'NoOp' }),
        )
      : Cmd.none<Msg>()

    switch (newRoute.page._tag) {
      case 'HomePage': {
        const [homeModel, homeCmd] = HomePage.init(model.shared)
        return [
          {
            ...model,
            isInternal,
            route: newRoute,
            pageModel: { _tag: 'HomePageModel', model: homeModel },
            navbarMobileOpen: { internal: null, state: { _tag: 'Invisible' } },
          },
          Cmd.batch([
            urlCmd,
            homeCmd.map((msg) => ({ _tag: 'HomePageMsg', subMsg: msg })),
          ]),
        ]
      }
      case 'ArticlePage': {
        const [articleModel, articleCmd] = ArticlePage.init(
          newRoute.page.slug,
          model.shared,
        )
        return [
          {
            ...model,
            isInternal,
            route: newRoute,
            pageModel: { _tag: 'ArticlePageModel', model: articleModel },
            navbarMobileOpen: { internal: null, state: { _tag: 'Invisible' } },
          },
          Cmd.batch([
            urlCmd,
            articleCmd.map((msg) => ({ _tag: 'ArticlePageMsg', subMsg: msg })),
          ]),
        ]
      }
      case 'LoginPage': {
        const [loginModel, loginCmd] = LoginPage.init(model.shared)
        return [
          {
            ...model,
            isInternal,
            route: newRoute,
            pageModel: { _tag: 'LoginPageModel', model: loginModel },
            navbarMobileOpen: { internal: null, state: { _tag: 'Invisible' } },
          },
          Cmd.batch([
            urlCmd,
            loginCmd.map((msg) => ({ _tag: 'LoginPageMsg', subMsg: msg })),
          ]),
        ]
      }
      case 'RegisterPage': {
        const [registerModel, registerCmd] = RegisterPage.init(model.shared)
        return [
          {
            ...model,
            isInternal,
            route: newRoute,
            pageModel: { _tag: 'RegisterPageModel', model: registerModel },
            navbarMobileOpen: { internal: null, state: { _tag: 'Invisible' } },
          },
          Cmd.batch([
            urlCmd,
            registerCmd.map((msg) => ({ _tag: 'RegisterPageMsg', subMsg: msg })),
          ]),
        ]
      }
      case 'SettingsPage': {
        const [settingsModel, settingsCmd] = SettingsPage.init(model.shared)
        return [
          {
            ...model,
            isInternal,
            route: newRoute,
            pageModel: { _tag: 'SettingsPageModel', model: settingsModel },
            navbarMobileOpen: {
              internal: null,
              state: { _tag: 'Invisible' },
            },
          },
          Cmd.batch([
            urlCmd,
            settingsCmd.map((msg) => ({
              _tag: 'SettingsPageMsg',
              subMsg: msg,
            })),
          ]),
        ]
      }
      case 'ProfilePage': {
        const [profileModel, profileCmd] = ProfilePage.init(
          newRoute.page.username,
          newRoute.page.favorites,
          model.shared,
        )
        return [
          {
            ...model,
            isInternal,
            route: newRoute,
            pageModel: { _tag: 'ProfilePageModel', model: profileModel },
            navbarMobileOpen: { internal: null, state: { _tag: 'Invisible' } },
          },
          Cmd.batch([
            urlCmd,
            profileCmd.map((msg) => ({ _tag: 'ProfilePageMsg', subMsg: msg })),
          ]),
        ]
      }
      case 'EditorPage': {
        const [editorModel, editorCmd] = EditorPage.init(
          newRoute.page.slug,
          model.shared,
        )
        return [
          {
            ...model,
            isInternal,
            route: newRoute,
            pageModel: { _tag: 'EditorPageModel', model: editorModel },
            navbarMobileOpen: {
              internal: null,
              state: { _tag: 'Invisible' },
            },
          },
          Cmd.batch([
            urlCmd,
            editorCmd.map((msg) => ({ _tag: 'EditorPageMsg', subMsg: msg })),
          ]),
        ]
      }
      default:
        return [
          {
            ...model,
            isInternal,
            route: newRoute,
            pageModel: { _tag: 'NotFoundPageModel' },
            navbarMobileOpen: { internal: null, state: { _tag: 'Invisible' } },
          },
          urlCmd,
        ]
    }
  }

const execChangeRoute =
  (newRoute: Route, isInternal: boolean) =>
  (model: Model): [Model, Cmd<Msg>] => {
    if (!AppRouteEq.equals(model.route, newRoute)) {
      return navigate(newRoute, isInternal)(model)
    } else {
      if (isInternal) {
        return navigate(newRoute, isInternal)(model)
      } else {
        return [model, Cmd.none()]
      }
    }
  }

const changeRouteHandler =
  (newRoute: Route, isInternal: boolean) =>
  (model: Model): [Model, Cmd<Msg>] => {
    return execChangeRoute(newRoute, isInternal)(model)
  }

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'NoOp':
      return [model, Cmd.none()]
    case 'Init':
      // Handled by preUpdate
      return [model, Cmd.none()]
    case 'UrlChange': {
      if (model.isInternal) {
        return [
          {
            ...model,
            isInternal: false,
            navbarMobileOpen: { internal: null, state: { _tag: 'Invisible' } },
          },
          Cmd.none(),
        ]
      } else {
        const route = parseAppRoute('', msg.location.href)
        return changeRouteHandler(route, false)(model)
      }
    }
    case 'ChangeRoute': {
      return changeRouteHandler(msg.route, true)(model)
    }

    case 'SetUser': {
      const token =
        msg.user._tag === 'Some' ? O.some(msg.user.value.token) : O.none
      if (msg.user._tag === 'Some') {
        saveToken(msg.user.value.token)
      } else {
        removeToken()
      }
      return [
        { ...model, shared: { ...model.shared, user: msg.user, token } },
        Cmd.none(),
      ]
    }
    case 'HomePageMsg':
      if (model.pageModel._tag === 'HomePageModel') {
        const [homeModel, homeCmd] = HomePage.update(model.shared)(
          msg.subMsg,
          model.pageModel.model,
        )
        return [
          { ...model, pageModel: { _tag: 'HomePageModel', model: homeModel } },
          homeCmd.map((msg) => ({ _tag: 'HomePageMsg', subMsg: msg })),
        ]
      }
      return [model, Cmd.none()]
    case 'ArticlePageMsg':
      if (model.pageModel._tag === 'ArticlePageModel') {
        const [articleModel, articleCmd] = ArticlePage.update(model.shared)(
          msg.subMsg,
          model.pageModel.model,
        )
        return pipe(
          [
            {
              ...model,
              pageModel: {
                _tag: 'ArticlePageModel',
                model: articleModel,
              } as const,
            },
            articleCmd.map(
              (m) => ({ _tag: 'ArticlePageMsg' as const, subMsg: m }) as Msg,
            ),
          ] as [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (
              msg.subMsg._tag === 'DeleteArticleResponse' &&
              msg.subMsg.result.tag === 'Ok'
            ) {
              return changeRouteHandler({ page: homePage() }, true)(m)
            }
            return [m, Cmd.none()]
          }),
        )
      }
      return [model, Cmd.none()]
    case 'LoginPageMsg': {
      if (model.pageModel._tag === 'LoginPageModel') {
        const [loginModel, loginCmd] = LoginPage.update(model.shared)(
          msg.subMsg,
          model.pageModel.model,
        )

        return pipe(
          [
            {
              ...model,
              pageModel: { _tag: 'LoginPageModel', model: loginModel } as const,
            },
            loginCmd.map(
              (m) => ({ _tag: 'LoginPageMsg' as const, subMsg: m }) as Msg,
            ),
          ] as [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (
              msg.subMsg._tag === 'SubmitResponse' &&
              msg.subMsg.result.tag === 'Ok'
            ) {
              const user = msg.subMsg.result.value.user
              saveToken(user.token)
              return changeRouteHandler(
                { page: homePage() },
                true,
              )({ ...m, shared: { ...m.shared, user: O.some(user) } })
            } else {
              return [m, Cmd.none()]
            }
          }),
        )
      } else {
        return [model, Cmd.none()]
      }
    }
    case 'RegisterPageMsg': {
      if (model.pageModel._tag === 'RegisterPageModel') {
        const [registerModel, registerCmd] = RegisterPage.update(model.shared)(
          msg.subMsg,
          model.pageModel.model,
        )

        return pipe(
          [
            {
              ...model,
              pageModel: {
                _tag: 'RegisterPageModel',
                model: registerModel,
              } as const,
            },
            registerCmd.map(
              (m) => ({ _tag: 'RegisterPageMsg' as const, subMsg: m }) as Msg,
            ),
          ] as [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (
              msg.subMsg._tag === 'SubmitResponse' &&
              msg.subMsg.result.tag === 'Ok'
            ) {
              const user = msg.subMsg.result.value.user
              saveToken(user.token)
              return changeRouteHandler(
                { page: homePage() },
                true,
              )({ ...m, shared: { ...m.shared, user: O.some(user) } })
            } else {
              return [m, Cmd.none()]
            }
          }),
        )
      } else {
        return [model, Cmd.none()]
      }
    }
    case 'SettingsPageMsg': {
      if (model.pageModel._tag === 'SettingsPageModel') {
        const [settingsModel, settingsCmd] = SettingsPage.update(model.shared)(
          msg.subMsg,
          model.pageModel.model,
        )

        return pipe(
          [
            {
              ...model,
              pageModel: {
                _tag: 'SettingsPageModel',
                model: settingsModel,
              } as const,
            },
            settingsCmd.map(
              (m) => ({ _tag: 'SettingsPageMsg' as const, subMsg: m }) as Msg,
            ),
          ] as [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (msg.subMsg._tag === 'Logout') {
              removeToken()
              return changeRouteHandler(
                { page: homePage() },
                true,
              )({ ...m, shared: { ...m.shared, user: O.none, token: O.none } })
            } else if (
              msg.subMsg._tag === 'SubmitResponse' &&
              msg.subMsg.result.tag === 'Ok'
            ) {
              const user = msg.subMsg.result.value.user
              saveToken(user.token)
              return [
                {
                  ...m,
                  shared: {
                    ...m.shared,
                    user: O.some(user),
                    token: O.some(user.token),
                  },
                },
                Cmd.none(),
              ]
            } else {
              return [m, Cmd.none()]
            }
          }),
        )
      } else {
        return [model, Cmd.none()]
      }
    }
    case 'ProfilePageMsg':
      if (model.pageModel._tag === 'ProfilePageModel') {
        const username =
          model.pageModel.model.profile._tag === 'RemoteSuccess'
            ? model.pageModel.model.profile.value.profile.username
            : model.route.page._tag === 'ProfilePage'
              ? model.route.page.username
              : ''
        const [profileModel, profileCmd] = ProfilePage.update(
          username,
          model.shared,
        )(msg.subMsg, model.pageModel.model)
        return [
          {
            ...model,
            pageModel: { _tag: 'ProfilePageModel', model: profileModel },
          },
          profileCmd.map((m) => ({ _tag: 'ProfilePageMsg', subMsg: m })),
        ]
      }
      return [model, Cmd.none()]
    case 'EditorPageMsg': {
      if (model.pageModel._tag === 'EditorPageModel') {
        const [editorModel, editorCmd] = EditorPage.update(model.shared)(
          msg.subMsg,
          model.pageModel.model,
        )

        return pipe(
          [
            {
              ...model,
              pageModel: {
                _tag: 'EditorPageModel',
                model: editorModel,
              } as const,
            },
            editorCmd.map(
              (m) => ({ _tag: 'EditorPageMsg' as const, subMsg: m }) as Msg,
            ),
          ] as [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (
              msg.subMsg._tag === 'SubmitResponse' &&
              msg.subMsg.result.tag === 'Ok'
            ) {
              const slug = msg.subMsg.result.value.article.slug
              return changeRouteHandler(
                { page: { _tag: 'ArticlePage', slug } },
                true,
              )(m)
            } else {
              return [m, Cmd.none()]
            }
          }),
        )
      } else {
        return [model, Cmd.none()]
      }
    }
    case 'DebugPanelMsg':
      return [
        {
          ...model,
          debugPanel: DebugPanel.update(msg.subMsg, model.debugPanel),
        },
        Cmd.none(),
      ]
    case 'ToggleNavbarMobile': {
      if (msg.open) {
        return [
          {
            ...model,
            navbarMobileOpen: { internal: null, state: { _tag: 'AnimateIn' } },
          },
          delayCmd(150, {
            _tag: 'SetNavbarMobileState',
            state: { _tag: 'Visible' },
          }),
        ]
      } else {
        return [
          {
            ...model,
            navbarMobileOpen: {
              ...model.navbarMobileOpen,
              state: { _tag: 'AnimateOut' },
            },
          },
          delayCmd(150, {
            _tag: 'SetNavbarMobileState',
            state: { _tag: 'Invisible' },
          }),
        ]
      }
    }
    case 'SetNavbarMobileState':
      return [
        {
          ...model,
          navbarMobileOpen: { ...model.navbarMobileOpen, state: msg.state },
        },
        Cmd.none(),
      ]
  }
}
