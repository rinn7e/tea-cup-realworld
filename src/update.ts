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
import * as DebugPanel from './component/debug-panel/type'
import { AppRouteEq, homePage, parseAppRoute, toUrlString } from './data/route'
import * as Article from './page/article/update'
import * as Auth from './page/auth/update'
import * as Editor from './page/editor/update'
import * as Home from './page/home/update'
import * as Profile from './page/profile/update'
import * as Settings from './page/settings/update'
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
    page: { _tag: 'NotFound' },
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
          (): Msg => ({ _tag: 'None' }),
        )
      : Cmd.none<Msg>()

    switch (newRoute.page._tag) {
      case 'HomePage': {
        const [homeModel, homeCmd] = Home.init(model.shared)
        return [
          {
            ...model,
            isInternal,
            route: newRoute,
            page: { _tag: 'Home', model: homeModel },
            navbarMobileOpen: { internal: null, state: { _tag: 'Invisible' } },
          },
          Cmd.batch([
            urlCmd,
            homeCmd.map((msg) => ({ _tag: 'HomeMsg', subMsg: msg })),
          ]),
        ]
      }
      case 'ArticlePage': {
        const [articleModel, articleCmd] = Article.init(
          newRoute.page.slug,
          model.shared,
        )
        return [
          {
            ...model,
            isInternal,
            route: newRoute,
            page: { _tag: 'Article', model: articleModel },
            navbarMobileOpen: { internal: null, state: { _tag: 'Invisible' } },
          },
          Cmd.batch([
            urlCmd,
            articleCmd.map((msg) => ({ _tag: 'ArticleMsg', subMsg: msg })),
          ]),
        ]
      }
      case 'LoginPage': {
        const [authModel, authCmd] = Auth.init(false, model.shared)
        return [
          {
            ...model,
            isInternal,
            route: newRoute,
            page: { _tag: 'Auth', model: authModel },
            navbarMobileOpen: { internal: null, state: { _tag: 'Invisible' } },
          },
          Cmd.batch([
            urlCmd,
            authCmd.map((msg) => ({ _tag: 'AuthMsg', subMsg: msg })),
          ]),
        ]
      }
      case 'RegisterPage': {
        const [authModel, authCmd] = Auth.init(true, model.shared)
        return [
          {
            ...model,
            isInternal,
            route: newRoute,
            page: { _tag: 'Auth', model: authModel },
            navbarMobileOpen: { internal: null, state: { _tag: 'Invisible' } },
          },
          Cmd.batch([
            urlCmd,
            authCmd.map((msg) => ({ _tag: 'AuthMsg', subMsg: msg })),
          ]),
        ]
      }
      case 'SettingsPage': {
        const [settingsModel, settingsCmd] = Settings.init(model.shared)
        return [
          {
            ...model,
            isInternal,
            route: newRoute,
            page: { _tag: 'Settings', model: settingsModel },
            navbarMobileOpen: {
              internal: null,
              state: { _tag: 'Invisible' },
            },
          },
          Cmd.batch([
            urlCmd,
            settingsCmd.map((msg) => ({ _tag: 'SettingsMsg', subMsg: msg })),
          ]),
        ]
      }
      case 'ProfilePage': {
        const [profileModel, profileCmd] = Profile.init(
          newRoute.page.username,
          newRoute.page.favorites,
          model.shared,
        )
        return [
          {
            ...model,
            isInternal,
            route: newRoute,
            page: { _tag: 'Profile', model: profileModel },
            navbarMobileOpen: { internal: null, state: { _tag: 'Invisible' } },
          },
          Cmd.batch([
            urlCmd,
            profileCmd.map((msg) => ({ _tag: 'ProfileMsg', subMsg: msg })),
          ]),
        ]
      }
      case 'EditorPage': {
        const [editorModel, editorCmd] = Editor.init(
          newRoute.page.slug,
          model.shared,
        )
        return [
          {
            ...model,
            isInternal,
            route: newRoute,
            page: { _tag: 'Editor', model: editorModel },
            navbarMobileOpen: {
              internal: null,
              state: { _tag: 'Invisible' },
            },
          },
          Cmd.batch([
            urlCmd,
            editorCmd.map((msg) => ({ _tag: 'EditorMsg', subMsg: msg })),
          ]),
        ]
      }
      default:
        return [
          {
            ...model,
            isInternal,
            route: newRoute,
            page: { _tag: 'NotFound' },
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
    case 'Init':
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
    case 'None':
      return [model, Cmd.none()]
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
    case 'HomeMsg':
      if (model.page._tag === 'Home') {
        const [homeModel, homeCmd] = Home.update(model.shared)(
          msg.subMsg,
          model.page.model,
        )
        return [
          { ...model, page: { _tag: 'Home', model: homeModel } },
          homeCmd.map((msg) => ({ _tag: 'HomeMsg', subMsg: msg })),
        ]
      }
      return [model, Cmd.none()]
    case 'ArticleMsg':
      if (model.page._tag === 'Article') {
        const [articleModel, articleCmd] = Article.update(model.shared)(
          msg.subMsg,
          model.page.model,
        )
        return pipe(
          [
            {
              ...model,
              page: { _tag: 'Article', model: articleModel } as const,
            },
            articleCmd.map(
              (m) => ({ _tag: 'ArticleMsg' as const, subMsg: m }) as Msg,
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
    case 'AuthMsg': {
      if (model.page._tag === 'Auth') {
        const [authModel, authCmd] = Auth.update(model.shared)(
          msg.subMsg,
          model.page.model,
        )

        return pipe(
          [
            { ...model, page: { _tag: 'Auth', model: authModel } as const },
            authCmd.map(
              (m) => ({ _tag: 'AuthMsg' as const, subMsg: m }) as Msg,
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
    case 'SettingsMsg': {
      if (model.page._tag === 'Settings') {
        const [settingsModel, settingsCmd] = Settings.update(model.shared)(
          msg.subMsg,
          model.page.model,
        )

        return pipe(
          [
            {
              ...model,
              page: { _tag: 'Settings', model: settingsModel } as const,
            },
            settingsCmd.map(
              (m) => ({ _tag: 'SettingsMsg' as const, subMsg: m }) as Msg,
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
    case 'ProfileMsg':
      if (model.page._tag === 'Profile') {
        const username =
          model.page.model.profile._tag === 'RemoteSuccess'
            ? model.page.model.profile.value.profile.username
            : model.route.page._tag === 'ProfilePage'
              ? model.route.page.username
              : ''
        const [profileModel, profileCmd] = Profile.update(
          username,
          model.shared,
        )(msg.subMsg, model.page.model)
        return [
          { ...model, page: { _tag: 'Profile', model: profileModel } },
          profileCmd.map((m) => ({ _tag: 'ProfileMsg', subMsg: m })),
        ]
      }
      return [model, Cmd.none()]
    case 'EditorMsg': {
      if (model.page._tag === 'Editor') {
        const [editorModel, editorCmd] = Editor.update(model.shared)(
          msg.subMsg,
          model.page.model,
        )

        return pipe(
          [
            { ...model, page: { _tag: 'Editor', model: editorModel } as const },
            editorCmd.map(
              (m) => ({ _tag: 'EditorMsg' as const, subMsg: m }) as Msg,
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
