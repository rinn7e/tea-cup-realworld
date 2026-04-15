import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { DebugPanel } from './component/debug-panel'
import { Footer } from './component/footer'
import { SetGlobalMsgContext } from './component/global-context'
import { Navbar } from './component/navbar'
import * as Article from './page/article/view'
import * as Auth from './page/auth/view'
import * as Editor from './page/editor/view'
import * as Home from './page/home/view'
import * as Profile from './page/profile/view'
import * as Settings from './page/settings/view'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const View: React.FC<Props> = ({ model, dispatch }) => {
  return (
    <SetGlobalMsgContext value={dispatch}>
      <div className='flex min-h-screen flex-col'>
        <Navbar model={model} />
        <main className='flex-grow'>{renderPage(model, dispatch)}</main>
        <Footer />
      </div>
      <DebugPanel
        model={model.debugPanel}
        dispatch={(msg) => dispatch({ _tag: 'DebugPanelMsg', msg })}
      />
    </SetGlobalMsgContext>
  )
}

const renderPage = (model: Model, dispatch: Dispatcher<Msg>) => {
  switch (model.page._tag) {
    case 'Home':
      return (
        <Home.HomeView
          model={model.page.model}
          dispatch={(msg) => dispatch({ _tag: 'HomeMsg', msg })}
        />
      )
    case 'Article':
      return (
        <Article.ArticleView
          model={model.page.model}
          dispatch={(msg) => dispatch({ _tag: 'ArticleMsg', msg })}
        />
      )
    case 'Auth':
      return (
        <Auth.AuthView
          model={model.page.model}
          dispatch={(msg) => dispatch({ _tag: 'AuthMsg', msg })}
        />
      )
    case 'Settings':
      return (
        <Settings.SettingsView
          model={model.page.model}
          dispatch={(msg) => dispatch({ _tag: 'SettingsMsg', msg })}
        />
      )
    case 'Profile': {
      const isCurrentUser =
        model.shared.user._tag === 'Some' &&
        model.shared.user.value.username ===
          (model.page.model.profile._tag === 'RemoteSuccess'
            ? model.page.model.profile.value.profile.username
            : '')

      return (
        <Profile.ProfileView
          model={model.page.model}
          dispatch={(msg) => dispatch({ _tag: 'ProfileMsg', msg })}
          isCurrentUser={isCurrentUser}
        />
      )
    }
    case 'Editor':
      return (
        <Editor.EditorView
          model={model.page.model}
          dispatch={(msg) => dispatch({ _tag: 'EditorMsg', msg })}
        />
      )
    case 'Loading':
      return (
        <div className='flex min-h-[400px] items-center justify-center'>
          Loading...
        </div>
      )
    case 'NotFound':
      return <div className='p-4'>404 - Not Found</div>
    default:
      return <div className='p-4'>Unknown page</div>
  }
}
