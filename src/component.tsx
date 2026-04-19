import { cn } from '@rinn7e/tea-cup-prelude'
import React from 'react'
import type { Dispatcher } from 'tea-cup-fp'

import { DebugPanel } from './component/debug-panel'
import { Footer } from './component/footer'
import { SetGlobalMsgContext } from './component/global-context'
import { Navbar } from './component/navbar'
import * as Article from './page/article/component'
import * as Auth from './page/auth/component'
import * as Editor from './page/editor/component'
import * as Home from './page/home/component'
import { NotFoundView } from './page/not-found'
import * as Profile from './page/profile/component'
import * as Settings from './page/settings/component'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const App: React.FC<Props> = ({ model, dispatch }) => {
  const isNavOpen = model.navbarMobileOpen.state._tag !== 'Invisible'

  return (
    <SetGlobalMsgContext value={dispatch}>
      <div
        className={cn(
          'flex min-h-dvh flex-col',
          isNavOpen && 'h-dvh overflow-hidden',
        )}
      >
        <Navbar model={model} dispatch={dispatch} />
        <main className='flex-grow'>{renderPage(model, dispatch)}</main>
        <Footer />
      </div>
      <DebugPanel
        model={model.debugPanel}
        dispatch={(msg) => dispatch({ _tag: 'DebugPanelMsg', subMsg: msg })}
      />
    </SetGlobalMsgContext>
  )
}

const renderPage = (model: Model, dispatch: Dispatcher<Msg>) => {
  switch (model.page._tag) {
    case 'Home':
      return (
        <Home.HomeViewMemo
          model={model.page.model}
          dispatch={(msg) => dispatch({ _tag: 'HomeMsg', subMsg: msg })}
        />
      )
    case 'Article':
      return (
        <Article.ArticleViewMemo
          model={model.page.model}
          token={model.shared.token}
          dispatch={(msg) => dispatch({ _tag: 'ArticleMsg', subMsg: msg })}
        />
      )
    case 'Auth':
      return (
        <Auth.AuthViewMemo
          model={model.page.model}
          dispatch={(msg) => dispatch({ _tag: 'AuthMsg', subMsg: msg })}
        />
      )
    case 'Settings':
      return (
        <Settings.SettingsViewMemo
          model={model.page.model}
          dispatch={(msg) => dispatch({ _tag: 'SettingsMsg', subMsg: msg })}
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
        <Profile.ProfileViewMemo
          model={model.page.model}
          dispatch={(msg) => dispatch({ _tag: 'ProfileMsg', subMsg: msg })}
          isCurrentUser={isCurrentUser}
        />
      )
    }
    case 'Editor':
      return (
        <Editor.EditorViewMemo
          model={model.page.model}
          dispatch={(msg) => dispatch({ _tag: 'EditorMsg', subMsg: msg })}
        />
      )
    case 'NotFound':
      return <NotFoundView />
  }
}
