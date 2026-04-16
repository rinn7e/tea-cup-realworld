import { devTools } from '@rinn7e/tea-cup-prelude'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ProgramWithNav } from 'react-tea-cup'
import { Sub } from 'tea-cup-fp'

import { App } from './component'
import './index.css'
import type { Model, Msg } from './type'
import { init, update } from './update'

const container = document.getElementById('root')

if (container) {
  const root = createRoot(container)
  root.render(
    <StrictMode>
      <ProgramWithNav<Model, Msg>
        onUrlChange={(location) => ({ _tag: 'UrlChange', location })}
        init={init}
        update={update}
        view={(dispatch, model) => <App model={model} dispatch={dispatch} />}
        subscriptions={() => Sub.none()}
        {...devTools<Model, Msg>().getProgramProps()}
      />
    </StrictMode>,
  )
}
