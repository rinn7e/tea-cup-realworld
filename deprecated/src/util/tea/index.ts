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

import { identity } from 'fp-ts/lib/function'
import { DevTools } from 'react-tea-cup'
import { Cmd, type PromiseSupplier, type Result, Task } from 'tea-cup-fp'

// TEA utils functions
// ---------------------------------

// create tea-cup DevTools
export const devTools = <Model, Msg>() =>
  new DevTools<Model, Msg>()
    .setVerbose(true) // verbose mode : will show logs for updates
    .asGlobal() // as a global var (on window)

export const resultToNoAction =
  <Msg>(noAction: Msg) =>
  (r: Result<Error, void>): Msg => {
    if (r.tag === 'Err') {
      console.warn('resultToNoAction error:', r.err.toString())
    }
    return noAction
  }

export const cmdFromPromise = <A, Msg>(
  promiseSupplier: PromiseSupplier<A>,
  f: (r: Result<Error, A>) => Msg,
) => Task.attempt(Task.fromPromise(promiseSupplier), f)

export const doNothing = <M, msg>(model: M): [M, Cmd<msg>] => {
  return [model, Cmd.none()]
}

// Trigger a msg in Cmd (currently useful for processing queue)
export const msgCmd = <msg>(msg: msg): Cmd<msg> =>
  Task.perform(Task.succeed(msg), identity)

export const noMsg = (): { _tag: 'None' } => ({ _tag: 'None' })

export const cmdSucceed = (r: () => void): Cmd<{ _tag: 'None' }> =>
  Task.perform<void, { _tag: 'None' }>(Task.succeedLazy(r), noMsg)

// batchCommand : Cmd msg -> ( model, Cmd msg ) -> ( model, Cmd msg )
// batchCommand cmd =
//     Tuple.mapSecond (\c -> Cmd.batch [ c, cmd ])
export const batchCmd =
  <msg, model>(newCmd: Cmd<msg>) =>
  ([model, cmd]: [model, Cmd<msg>]): [model, Cmd<msg>] => {
    return [model, Cmd.batch([cmd, newCmd])]
  }

// extraCommand : (model -> Cmd msg) -> ( model, Cmd msg ) -> ( model, Cmd msg )
// extraCommand newCmd ( model, cmd ) =
//     ( model, Cmd.batch [ cmd, newCmd model ] )
export const extraCmd =
  <msg, model>(mkNewCmd: (m: model) => Cmd<msg>) =>
  ([model, cmd]: [model, Cmd<msg>]): [model, Cmd<msg>] => {
    return [model, Cmd.batch([cmd, mkNewCmd(model)])]
  }

// updateAndCommand : (model -> ( model, Cmd msg )) -> ( model, Cmd msg ) -> ( model, Cmd msg )
// updateAndCommand func ( model, cmd ) =
//     func model
//         |> Tuple.mapSecond (\c -> Cmd.batch [ cmd, c ])
export const updateAndCmd =
  <msg, model>(func: (m: model) => [model, Cmd<msg>]) =>
  ([model, cmd]: [model, Cmd<msg>]): [model, Cmd<msg>] => {
    const [newModel, newCmd] = func(model)
    return [newModel, Cmd.batch([cmd, newCmd])]
  }
