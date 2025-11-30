/*
 * MIT License
 *
 * Copyright (c) 2025 Moremi Vannak
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import * as RD from '@devexperts/remote-data-ts'
import { identity, pipe } from 'fp-ts/lib/function'
import * as O from 'fp-ts/lib/Option'
import * as Tuple from 'fp-ts/lib/Tuple'
import { newUrl } from 'react-tea-cup'
import { Cmd, Task } from 'tea-cup-fp'

import { homePage, parseAppRoute, route, toUrlString, type AppRoute } from '@/data/route'
import * as Api from '@/generated/api'
import * as SignupPage from '@/page/signup/update'
import * as LoginPage from '@/page/login/update'
import { client, cmdFromPromise, fromApi, updateAndCmd } from '@/util'
import type { Model, Msg } from './type'

export const init = (l: Location): [Model, Cmd<Msg>] => {
  // const initRoute = {
  //   // page: { _tag: 'LoginPage' },
  //   page: { _tag: 'HomePage' },
  // } satisfies AppRoute

  const initRoute = parseAppRoute(l.pathname, l.href)

  const [signupPage, signupPageCmd] =
    initRoute.page._tag === 'SignupPage'
      ? pipe(SignupPage.init(), Tuple.mapFst(O.some))
      : [O.none, Cmd.none<SignupPage.Msg>()]

  const [loginPage, loginPageCmd] =
    initRoute.page._tag === 'LoginPage'
      ? pipe(LoginPage.init(), Tuple.mapFst(O.some))
      : [O.none, Cmd.none<LoginPage.Msg>()]

  return pipe(
    [
      {
        title: 'abc',
        isInternal: false,
        route: initRoute,
        articlesResponse: RD.pending,
        // authentication,
        auth: RD.initial,

        // page
        signupPage,
        loginPage,
      },
      Cmd.batch([
        getArticlesCmd(),
        //page
        signupPageCmd.map((subMsg) => ({ _tag: 'SignupPageMsg', subMsg })),
        loginPageCmd.map((subMsg) => ({ _tag: 'LoginPageMsg', subMsg })),
      ]) satisfies Cmd<Msg>,
    ],
    updateAndCmd(getAuthHandler)
  )
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'None':
      return [model, Cmd.none()]
    case 'UrlChange':
      return urlChangeHandler(location, model)
    case 'Navigate':
      return navigate(msg.route)(model)
    case 'ChangeRoute':
      return changeRouteHandler(msg.route)(model)
    case 'ModifyRoute': {
      const newRoute = msg.func(model.route)
      return changeRouteHandler(newRoute)(model)
    }
    case 'ChangePage': {
      const newRoute = { ...model.route, page: msg.page }
      return changeRouteHandler(newRoute)(model)
    }
    case 'GetArticles':
      return [model, getArticlesCmd()]
    case 'GetArticlesResponse': {
      return [
        {
          ...model,
          articlesResponse: RD.fromEither(msg.result),
        },
        Cmd.none(),
      ]
    }

    case 'SetAuth': {
      return [{ ...model, auth: RD.success(msg.value) }, Cmd.none()]
    }
    case 'GetAuth':
      return getAuthHandler(model)
    case 'GetAuthResponse': {
      return [
        {
          ...model,
          auth: RD.fromEither(msg.result),
        },
        Cmd.none(),
      ]
    }

    case 'SignupPageMsg': {
      if (model.signupPage._tag === 'Some') {
        const { model: signupPageModel, cmd: signupPageCmd } = SignupPage.update(
          msg.subMsg,
          model.signupPage.value,
        )
        return pipe(
          [
            { ...model, signupPage: O.some(signupPageModel) },
            signupPageCmd
              ? signupPageCmd.map((subMsg) => ({ _tag: 'SignupPageMsg', subMsg }))
              : Cmd.none()
          ] satisfies [Model, Cmd<Msg>],
          // globalMsg
          //   ? updateAndCmd((m) => update(resource)(globalMsg, m))
          //   : identity,
        )
      } else return [model, Cmd.none()]
    }
    case 'LoginPageMsg': {
      if (model.loginPage._tag === 'Some') {
        const [loginPageModel, loginPageCmd, auth] = LoginPage.update(
          msg.subMsg,
          model.loginPage.value,
        )
        return pipe([
          {
            ...model,
            loginPage: O.some(loginPageModel),
          },
          loginPageCmd.map((subMsg) => ({ _tag: 'LoginPageMsg', subMsg }))
        ] satisfies [Model, Cmd<Msg>],
          // Update auth and write token to localStorage
          updateAndCmd(updateAuthHandler(auth)),
          // Navigate to home page if auth is completed
          auth
            ? updateAndCmd(changeRouteHandler(route(homePage())))
            : identity,
        )
      } else return [model, Cmd.none()]
    }
  }
}

const updateAuthHandler = (auth: Api.GetCurrentUserResponse | null) => (model: Model): [Model, Cmd<Msg>] => {
  if (auth) {
    localStorage.setItem("jwtToken", auth.user.token);
    return [{ ...model, auth: RD.success(auth) }, Cmd.none()]
  } else return [model, Cmd.none()]

}

const urlChangeHandler = (
  location: Location,
  model: Model,
): [Model, Cmd<Msg>] => {
  if (model.isInternal) {
    // Do nothing when the URL change originates from within the app
    return [{ ...model, isInternal: false }, Cmd.none()]
  } else {
    // Otherwise, parse the new URL and update the route.
    // const newRoute = parseAppRoute(location.pathname, location.href)
    // return reInitBaseOnNewRoute(
    //   resource,
    //   model.networkStatus,
    //   newRoute,
    //   false,
    //   model,
    // )
    // TODO
    const newRoute = parseAppRoute(location.pathname, location.href)
    return [{ ...model, route: newRoute }, Cmd.none()]
  }
}

const navigate =
  (newRoute: AppRoute) =>
    (model: Model): [Model, Cmd<Msg>] => {
      const [newModel, cmd] = reInitBaseOnNewRoute(newRoute, model)
      const url = toUrlString(newRoute)
      return [
        {
          ...newModel,
          route: newRoute,
          isInternal: true,
        },
        Cmd.batch([Task.perform(newUrl(url), () => ({ _tag: 'None' })), cmd]),
      ]
    }

export const reInitBaseOnNewRoute = (
  route: AppRoute,
  model: Model,
): [Model, Cmd<Msg>] => {
  const [loginPage, loginPageCmd] =
    route.page._tag === 'LoginPage'
      ? pipe(LoginPage.reInit(), Tuple.mapFst(O.some))
      : [O.none, Cmd.none<LoginPage.Msg>()]

  const [signupPage, signupPageCmd] =
    route.page._tag === 'SignupPage'
      ? pipe(SignupPage.reInit(), Tuple.mapFst(O.some))
      : [O.none, Cmd.none<SignupPage.Msg>()]

  return [
    {
      ...model,
      route: route,
      // update component state base on route
      loginPage,
      signupPage,
    },
    Cmd.batch([
      // sub-components
      loginPageCmd.map<Msg>((subMsg) => ({ _tag: 'LoginPageMsg', subMsg })),
      signupPageCmd.map<Msg>((subMsg) => ({ _tag: 'SignupPageMsg', subMsg })),
    ]),
  ]
}

const changeRouteHandler =
  (newRoute: AppRoute) =>
    (model: Model): [Model, Cmd<Msg>] => {
      // Run pre condition here
      return navigate(newRoute)(model)
    }

const getArticlesCmd = (): Cmd<Msg> => {
  return cmdFromPromise(
    async () => {
      const result = await Api.getArticles({ client: client() })
      return fromApi(result)
    },
    (r) => {
      if (r.tag === 'Ok')
        return { _tag: 'GetArticlesResponse', result: r.value }
      else return { _tag: 'None' }
    },
  )
}

const getAuthHandler = (model: Model): [Model, Cmd<Msg>] => {
  const token = localStorage.getItem("jwtToken");
  if (token)
    return [
      model,
      cmdFromPromise(
        async () => {
          const result = await Api.getCurrentUser({ client: client(token) })
          return fromApi(result)
        },
        (r) => {
          if (r.tag === 'Ok')
            return { _tag: 'GetAuthResponse', result: r.value }
          else return { _tag: 'None' }
        },
      )
    ]
  else return [model, Cmd.none()]
}