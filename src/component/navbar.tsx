import * as O from 'fp-ts/lib/Option'
import type { Option } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Pencil, Settings } from 'lucide-react'
import React from 'react'

import type { User } from '../api/type'
import { homePage } from '../data/route'
import type { Model } from '../type'
import { Link } from './link'

interface Props {
  model: Model
}

export const Navbar: React.FC<Props> = ({ model }) => {
  const user = model.shared.user
  const pageTag = model.page._tag

  const isHome = pageTag === 'Home'
  const isEditor = pageTag === 'Editor'
  const isSettings = pageTag === 'Settings'
  const isProfile = pageTag === 'Profile'

  const activeCls = 'font-semibold text-green-600'
  const inactiveCls = 'text-gray-500 hover:text-gray-900'

  return (
    <nav className='border-b border-gray-100 bg-white shadow-sm'>
      <div className='mx-auto max-w-6xl px-4'>
        <div className='flex h-14 items-center justify-between'>
          <Link className='text-xl font-bold tracking-tight text-green-600' route={{ page: homePage() }}>
            conduit
          </Link>
          <ul className='flex items-center gap-1'>
            <li>
              <Link
                className={`rounded px-3 py-1.5 text-sm ${isHome ? activeCls : inactiveCls}`}
                route={{ page: homePage() }}
              >
                Home
              </Link>
            </li>
            {pipe(user, (optUser: Option<User>) =>
              optUser._tag === 'Some' ? (
                <>
                  <li>
                    <Link
                      className={`flex items-center gap-1 rounded px-3 py-1.5 text-sm ${isEditor ? activeCls : inactiveCls}`}
                      route={{ page: { _tag: 'EditorPage', slug: O.none } }}
                    >
                      <Pencil size={14} />
                      New Article
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`flex items-center gap-1 rounded px-3 py-1.5 text-sm ${isSettings ? activeCls : inactiveCls}`}
                      route={{ page: { _tag: 'SettingsPage' } }}
                    >
                      <Settings size={14} />
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm ${isProfile ? activeCls : inactiveCls}`}
                      route={{
                        page: {
                          _tag: 'ProfilePage',
                          username: optUser.value.username,
                          favorites: false,
                        },
                      }}
                    >
                      <img
                        src={
                          optUser.value.image ||
                          '/default-avatar.svg'
                        }
                        className='h-7 w-7 rounded-full object-cover'
                        alt=''
                      />
                      {optUser.value.username}
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link
                      className={`rounded px-3 py-1.5 text-sm ${inactiveCls}`}
                      route={{ page: { _tag: 'LoginPage' } }}
                    >
                      Sign in
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`rounded px-3 py-1.5 text-sm ${inactiveCls}`}
                      route={{ page: { _tag: 'RegisterPage' } }}
                    >
                      Sign up
                    </Link>
                  </li>
                </>
              ),
            )}
          </ul>
        </div>
      </div>
    </nav>
  )
}
