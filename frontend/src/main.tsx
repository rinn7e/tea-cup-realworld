import { devTools } from '@rinn7e/tea-cup-prelude'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ProgramWithNav } from 'react-tea-cup'
import { Dispatcher, Sub } from 'tea-cup-fp'

import { App } from './component'
import './index.css'
import type { Model, Msg } from './type'
import { preInit, preUpdate } from './update'

// Helper
// ---------------------------------------------

const preLoadingView = () => {
  return (
    <div className='initial-loader-wrap'>
      <div className='initial-loader'></div>
    </div>
  )
}

const preView = (dispatch: Dispatcher<Msg>, model: Model | null) =>
  model ? <App model={model} dispatch={dispatch} /> : preLoadingView()

// App
// ---------------------------------------------

const container = document.getElementById('root')

if (container) {
  const root = createRoot(container)
  root.render(
    <StrictMode>
      <ProgramWithNav<Model | null, Msg>
        onUrlChange={(location) => ({ _tag: 'UrlChange', location })}
        init={preInit}
        update={preUpdate}
        view={preView}
        subscriptions={() => Sub.none()}
        {...devTools<Model | null, Msg>().getProgramProps()}
      />
    </StrictMode>,
  )
}
