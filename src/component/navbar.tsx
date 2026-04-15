import * as O from 'fp-ts/lib/Option'
import type { Option } from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
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

  return (
    <nav className='navbar navbar-light'>
      <div className='container'>
        <Link className='navbar-brand' route={{ page: homePage() }}>
          conduit
        </Link>
        <ul className='nav navbar-nav pull-xs-right'>
          <li className='nav-item'>
            <Link
              className={`nav-link${isHome ? ' active' : ''}`}
              route={{ page: homePage() }}
            >
              Home
            </Link>
          </li>
          {pipe(user, (optUser: Option<User>) =>
            optUser._tag === 'Some' ? (
              <>
                <li className='nav-item'>
                  <Link
                    className={`nav-link${isEditor ? ' active' : ''}`}
                    route={{ page: { _tag: 'EditorPage', slug: O.none } }}
                  >
                    <i className='ion-compose' />
                    &nbsp;New Article
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className={`nav-link${isSettings ? ' active' : ''}`}
                    route={{ page: { _tag: 'SettingsPage' } }}
                  >
                    <i className='ion-gear-a' />
                    &nbsp;Settings
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className={`nav-link${isProfile ? ' active' : ''}`}
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
                        'https://api.realworld.io/images/smiley-cyrus.jpeg'
                      }
                      className='user-pic'
                      alt=''
                    />{' '}
                    {optUser.value.username}
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className='nav-item'>
                  <Link
                    className='nav-link'
                    route={{ page: { _tag: 'LoginPage' } }}
                  >
                    Sign in
                  </Link>
                </li>
                <li className='nav-item'>
                  <Link
                    className='nav-link'
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
    </nav>
  )
}
