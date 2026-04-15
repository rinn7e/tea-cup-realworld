import { taskFromTE, updateAndCmd } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { newUrl } from 'react-tea-cup'
import { Cmd, Task } from 'tea-cup-fp'

import { getCurrentUser } from './api'
import type { User } from './api/type'
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
  const model: Model = {
    route,
    shared: {
      user: O.none,
    },
    page: { _tag: 'Loading' },
    isInternal: false,
    debugPanel: DebugPanel.init(),
  }

  const [initialModel, initialCmd] = changeRouteHandler(route, false)(model)

  const token = getToken()
  if (token) {
    const userCmd = Task.attempt(taskFromTE(getCurrentUser(token)), (res) => {
      const msg: Msg = {
        _tag: 'SetUser',
        user: res.tag === 'Ok' ? O.some(res.value.user) : O.none,
      }
      return msg
    })
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
        const [homeModel, homeCmd] = Home.init()
        return [
          {
            ...model,
            isInternal,
            route: newRoute,
            page: { _tag: 'Home', model: homeModel },
          },
          Cmd.batch([urlCmd, homeCmd.map((msg) => ({ _tag: 'HomeMsg', msg }))]),
        ]
      }
      case 'ArticlePage': {
        const [articleModel, articleCmd] = Article.init(newRoute.page.slug)
        return [
          {
            ...model,
            isInternal,
            route: newRoute,
            page: { _tag: 'Article', model: articleModel },
          },
          Cmd.batch([
            urlCmd,
            articleCmd.map((msg) => ({ _tag: 'ArticleMsg', msg })),
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
          },
          Cmd.batch([urlCmd, authCmd.map((msg) => ({ _tag: 'AuthMsg', msg }))]),
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
          },
          Cmd.batch([urlCmd, authCmd.map((msg) => ({ _tag: 'AuthMsg', msg }))]),
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
            },
            Cmd.batch([
              urlCmd,
              settingsCmd.map((msg) => ({ _tag: 'SettingsMsg', msg })),
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
          },
          Cmd.batch([
            urlCmd,
            profileCmd.map((msg) => ({ _tag: 'ProfileMsg', msg })),
          ]),
        ]
      }
      case 'EditorPage': {
        if (model.shared.user._tag === 'Some') {
          const [editorModel, editorCmd] = Editor.init(newRoute.page.slug)
          return [
            {
              ...model,
              isInternal,
              route: newRoute,
              page: { _tag: 'Editor', model: editorModel },
            },
            Cmd.batch([
              urlCmd,
              editorCmd.map((msg) => ({ _tag: 'EditorMsg', msg })),
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
          { ...model, isInternal, route: newRoute, page: { _tag: 'NotFound' } },
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
        return [{ ...model, isInternal: false }, Cmd.none()]
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
      if (msg.user._tag === 'Some') {
        saveToken(msg.user.value.token)
      } else {
        removeToken()
      }
      return [
        { ...model, shared: { ...model.shared, user: msg.user } },
        Cmd.none(),
      ]
    }
    case 'HomeMsg':
      if (model.page._tag === 'Home') {
        const [homeModel, homeCmd] = Home.update(msg.msg, model.page.model)
        return [
          { ...model, page: { _tag: 'Home', model: homeModel } },
          homeCmd.map((msg) => ({ _tag: 'HomeMsg', msg })),
        ]
      }
      return [model, Cmd.none()]
    case 'ArticleMsg':
      if (model.page._tag === 'Article') {
        const [articleModel, articleCmd] = Article.update(
          msg.msg,
          model.page.model,
        )
        return [
          { ...model, page: { _tag: 'Article', model: articleModel } },
          articleCmd.map((msg) => ({ _tag: 'ArticleMsg', msg })),
        ]
      }
      return [model, Cmd.none()]
    case 'AuthMsg': {
      if (model.page._tag === 'Auth') {
        const [authModel, authCmd] = Auth.update(msg.msg, model.page.model)

        return pipe(
          [
            { ...model, page: { _tag: 'Auth', model: authModel } as const },
            authCmd.map((m) => ({ _tag: 'AuthMsg' as const, msg: m }) as Msg),
          ] as [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (
              msg.msg._tag === 'SubmitResponse' &&
              msg.msg.result.tag === 'Ok'
            ) {
              const user = msg.msg.result.value.user
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
      if (model.page._tag === 'Settings' && model.shared.user._tag === 'Some') {
        const token = model.shared.user.value.token
        const [settingsModel, settingsCmd] = Settings.update(token)(
          msg.msg,
          model.page.model,
        )

        return pipe(
          [
            {
              ...model,
              page: { _tag: 'Settings', model: settingsModel } as const,
            },
            settingsCmd.map(
              (m) => ({ _tag: 'SettingsMsg' as const, msg: m }) as Msg,
            ),
          ] as [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (msg.msg._tag === 'Logout') {
              removeToken()
              return changeRouteHandler(
                { page: homePage() },
                true,
              )({ ...m, shared: { ...m.shared, user: O.none } })
            } else if (
              msg.msg._tag === 'SubmitResponse' &&
              msg.msg.result.tag === 'Ok'
            ) {
              const user = msg.msg.result.value.user
              saveToken(user.token)
              return [
                { ...m, shared: { ...m.shared, user: O.some(user) } },
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
        const token = pipe(
          model.shared.user,
          O.map((u: User) => u.token),
        )
        const [profileModel, profileCmd] = Profile.update(username, token)(
          msg.msg,
          model.page.model,
        )
        return [
          { ...model, page: { _tag: 'Profile', model: profileModel } },
          profileCmd.map((m) => ({ _tag: 'ProfileMsg', msg: m })),
        ]
      }
      return [model, Cmd.none()]
    case 'EditorMsg': {
      if (model.page._tag === 'Editor' && model.shared.user._tag === 'Some') {
        const token = model.shared.user.value.token
        const [editorModel, editorCmd] = Editor.update(token)(
          msg.msg,
          model.page.model,
        )

        return pipe(
          [
            { ...model, page: { _tag: 'Editor', model: editorModel } as const },
            editorCmd.map(
              (m) => ({ _tag: 'EditorMsg' as const, msg: m }) as Msg,
            ),
          ] as [Model, Cmd<Msg>],
          updateAndCmd((m) => {
            if (
              msg.msg._tag === 'SubmitResponse' &&
              msg.msg.result.tag === 'Ok'
            ) {
              const slug = msg.msg.result.value.article.slug
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
        { ...model, debugPanel: DebugPanel.update(msg.msg, model.debugPanel) },
        Cmd.none(),
      ]
  }
}
