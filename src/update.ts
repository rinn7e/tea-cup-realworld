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
import { Cmd } from 'tea-cup-fp'

import type { AppRoute } from '@/data/route'
import * as Api from '@/generated/api'
import { client, cmdFromPromise, fromApi } from '@/util'
import type { Model, Msg } from './type'

export const init = (_l: Location): [Model, Cmd<Msg>] => {
  const initRoute = {
    page: { _tag: 'HomePage' },
  } satisfies AppRoute

  return [
    {
      title: 'abc',
      isInternal: false,
      route: initRoute,
      articlesResponse: RD.pending,
    },
    Cmd.batch([getArticlesCmd()]),
  ]
}

export const update = (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
  switch (msg._tag) {
    case 'NoOp':
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
  }
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
    return [model, Cmd.none()]
  }
}

const navigate =
  (newRoute: AppRoute) =>
  (model: Model): [Model, Cmd<Msg>] => {
    return [
      {
        ...model,
        route: newRoute,
        isInternal: true,
      },
      Cmd.batch([
        // TODO
        // Task.perform(newUrl(url), () => ({ _tag: 'None' }))
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
      const result = await Api.getArticles({ client })
      return fromApi(result)
    },
    (r) => {
      if (r.tag === 'Ok')
        return { _tag: 'GetArticlesResponse', result: r.value }
      else return { _tag: 'NoOp' }
    },
  )
}
