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
import * as Profile from './page/profile/component'
import * as Settings from './page/settings/component'
import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const View: React.FC<Props> = ({ model, dispatch }) => {
  const isNavOpen = model.navbarMobileOpen.state._tag !== 'Invisible'

  return (
    <SetGlobalMsgContext value={dispatch}>
      <div
        className={cn(
          'flex flex-col min-h-dvh',
          isNavOpen && 'h-dvh overflow-hidden',
        )}
      >
        <Navbar model={model} dispatch={dispatch} />
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
        <Home.HomeViewMemo
          model={model.page.model}
          dispatch={(msg) => dispatch({ _tag: 'HomeMsg', msg })}
        />
      )
    case 'Article':
      return (
        <Article.ArticleViewMemo
          model={model.page.model}
          token={model.shared.token}
          dispatch={(msg) => dispatch({ _tag: 'ArticleMsg', msg })}
        />
      )
    case 'Auth':
      return (
        <Auth.AuthViewMemo
          model={model.page.model}
          dispatch={(msg) => dispatch({ _tag: 'AuthMsg', msg })}
        />
      )
    case 'Settings':
      return (
        <Settings.SettingsViewMemo
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
        <Profile.ProfileViewMemo
          model={model.page.model}
          dispatch={(msg) => dispatch({ _tag: 'ProfileMsg', msg })}
          isCurrentUser={isCurrentUser}
        />
      )
    }
    case 'Editor':
      return (
        <Editor.EditorViewMemo
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
      return <div className='p-[16px]'>404 - Not Found</div>
    default:
      return <div className='p-[16px]'>Unknown page</div>
  }
}
