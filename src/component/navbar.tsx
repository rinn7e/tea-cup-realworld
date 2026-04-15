import { Cog6ToothIcon, PencilSquareIcon } from '@heroicons/react/24/outline'
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

  return (
    <nav className='navbar navbar-light flex items-center justify-between border-b px-4 py-2'>
      <div className='container mx-auto flex items-center justify-between'>
        <Link
          className='text-brand-primary font-sans text-2xl font-bold'
          route={{ page: homePage() }}
        >
          conduit
        </Link>
        <ul className='flex space-x-4 text-gray-500'>
          <li>
            <Link className='hover:text-gray-800' route={{ page: homePage() }}>
              Home
            </Link>
          </li>
          {pipe(user, (optUser: Option<User>) =>
            optUser._tag === 'Some' ? (
              <>
                <li>
                  <Link
                    className='flex items-center gap-1 hover:text-gray-800'
                    route={{ page: { _tag: 'EditorPage', slug: O.none } }}
                  >
                    <PencilSquareIcon className='h-4 w-4' />
                    <span>New Article</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className='flex items-center gap-1 hover:text-gray-800'
                    route={{ page: { _tag: 'SettingsPage' } }}
                  >
                    <Cog6ToothIcon className='h-4 w-4' />
                    <span>Settings</span>
                  </Link>
                </li>
                <li>
                  <Link
                    className='flex items-center gap-1 hover:text-gray-800'
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
                      className='h-6 w-6 rounded-full'
                      alt=''
                    />
                    <span>{optUser.value.username}</span>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    className='hover:text-gray-800'
                    route={{ page: { _tag: 'LoginPage' } }}
                  >
                    Sign in
                  </Link>
                </li>
                <li>
                  <Link
                    className='hover:text-gray-800'
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
