import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ProgramWithNav } from 'react-tea-cup'
import { Sub } from 'tea-cup-fp'
import './index.css'
import type { Model, Msg } from './type'
import { init, update } from './update'
import { View } from './view'

const container = document.getElementById('root')

if (container) {
  const root = createRoot(container)
  root.render(
    <StrictMode>
      <ProgramWithNav<Model, Msg>
        onUrlChange={(location) => ({ _tag: 'UrlChange', location })}
        init={init}
        update={update}
        view={(dispatch, model) => (
          model ? <View model={model} dispatch={dispatch} /> : null
        )}
        subscriptions={() => Sub.none()}
      />
    </StrictMode>
  )
}
