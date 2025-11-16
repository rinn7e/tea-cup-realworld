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

import { ProgramWithNav } from 'react-tea-cup'
import { Sub, type Dispatcher } from 'tea-cup-fp'

import type { Model, Msg } from '@/type'
import { init, update } from '@/update'
import { devTools } from '@/util/tea'
import { View } from '@/view'

const subscriptions = (_model: Model): Sub<Msg> => {
  return Sub.batch<Msg>([])
}

// ------------------------------------------------------------
// Main
// ------------------------------------------------------------

const Main = () => {
  return (
    <ProgramWithNav
      onUrlChange={(location) =>
        ({ _tag: 'UrlChange', location }) satisfies Msg
      }
      init={(l) => init(l)}
      view={(dispatch: Dispatcher<Msg>, model: Model) => (
        <View dispatch={dispatch} model={model} />
      )}
      update={update}
      subscriptions={subscriptions}
      flushSyncDefault={false}
      {...devTools<Model, Msg>().getProgramProps()}
    />
  )
}

export default Main
