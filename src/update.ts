import { delayCmd, taskFromTE, updateAndCmd } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { newUrl } from 'react-tea-cup'
import { Cmd, Task } from 'tea-cup-fp'

import { getCurrentUser } from './api'
import * as DebugPanel from './component/debug-panel/type'
import { homePage, loginPage, parseAppRoute, toUrlString } from './data/route'
import * as Article from './page/article/update'
import * as Auth from './page/auth/update'
import * as Editor from './page/editor/update'
import * as Home from './page/home/update'
import * as Profile from './page/profile/update'
import * as Settings from './page/settings/update'
import type { Model, Msg, Route } from './type'
import { getToken, removeToken, saveToken } from './util/storage'

export const init = (location: Location): [Model, Cmd<Msg>] => {
  const route = parseAppRoute('', location.href)
  const storedToken = getToken()
  const model: Model = {
    route,
    shared: {
      user: O.none,
      token: storedToken ? O.some(storedToken) : O.none,
    },
    page: { _tag: 'Loading' },
    isInternal: false,
    debugPanel: DebugPanel.init(),
    navbarMobileOpen: { internal: null, state: { _tag: 'Invisible' } },
  }

  const [initialModel, initialCmd] = navigate(route, true)(model)

  if (storedToken) {
    const userCmd = Task.attempt(
      taskFromTE(getCurrentUser(storedToken)),
      (res) => {
        const msg: Msg = {
          _tag: 'SetUser',
          user: res.tag === 'Ok' ? O.some(res.value.user) : O.none,
        }
        return msg
      },
    )
    return [initialModel, Cmd.batch([initialCmd, userCmd])]
  }

  return [initialModel, initialCmd]
}

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
        const [homeModel, homeCmd] = Home.init(model.shared.token)
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
          model.shared.token,
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
        const [authModel, authCmd] = Auth.init(false)
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
        const [authModel, authCmd] = Auth.init(true)
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
        if (model.shared.user._tag === 'Some') {
          const [settingsModel, settingsCmd] = Settings.init(
            model.shared.user.value,
          )
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
        } else {
          return [
            { ...model, isInternal },
            Task.perform(
              newUrl(toUrlString({ page: loginPage() })),
              (): Msg => ({ _tag: 'None' }),
            ),
          ]
        }
      }
      case 'ProfilePage': {
        const [profileModel, profileCmd] = Profile.init(
          newRoute.page.username,
          newRoute.page.favorites,
          model.shared.user,
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
        if (model.shared.user._tag === 'Some') {
          const [editorModel, editorCmd] = Editor.init(
            newRoute.page.slug,
            model.shared.token,
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
        } else {
          return [
            { ...model, isInternal },
            Task.perform(
              newUrl(toUrlString({ page: loginPage() })),
              (): Msg => ({ _tag: 'None' }),
            ),
          ]
        }
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
    if (model.route.page._tag !== newRoute.page._tag) {
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
        const [homeModel, homeCmd] = Home.update(model.shared.token)(
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
        const [articleModel, articleCmd] = Article.update(model.shared.token)(
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
        const [authModel, authCmd] = Auth.update(msg.subMsg, model.page.model)

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
      if (
        model.page._tag === 'Settings' &&
        model.shared.token._tag === 'Some'
      ) {
        const token = model.shared.token.value
        const [settingsModel, settingsCmd] = Settings.update(token)(
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
          model.shared.token,
        )(msg.subMsg, model.page.model)
        return [
          { ...model, page: { _tag: 'Profile', model: profileModel } },
          profileCmd.map((m) => ({ _tag: 'ProfileMsg', subMsg: m })),
        ]
      }
      return [model, Cmd.none()]
    case 'EditorMsg': {
      if (model.page._tag === 'Editor' && model.shared.token._tag === 'Some') {
        const token = model.shared.token.value
        const [editorModel, editorCmd] = Editor.update(token)(
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
