import React from 'react';
import type { Model } from '../type';
import * as O from 'fp-ts/lib/Option';
import { pipe } from 'fp-ts/lib/function';
import type { Option } from 'fp-ts/lib/Option';
import type { User } from '../api/type';
import { Link } from './Link';
import { PencilSquareIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { homePage } from '../data/route';

interface Props {
  model: Model;
}

export const Navbar: React.FC<Props> = ({ model }) => {
  const user = model.shared.user;

  return (
    <nav className="navbar navbar-light px-4 py-2 flex items-center justify-between border-b">
      <div className="container mx-auto flex items-center justify-between">
        <Link
          className="text-brand-primary text-2xl font-bold font-sans"
          route={{ page: homePage() }}
        >
          conduit
        </Link>
        <ul className="flex space-x-4 text-gray-500">
          <li>
            <Link
              className="hover:text-gray-800"
              route={{ page: homePage() }}
            >
              Home
            </Link>
          </li>
          {pipe(
            user,
            (optUser: Option<User>) =>
              optUser._tag === 'Some'
                ? (
                  <>
                    <li>
                      <Link
                        className="hover:text-gray-800 flex items-center gap-1"
                        route={{ page: { _tag: 'EditorPage', slug: O.none } }}
                      >
                        <PencilSquareIcon className="w-4 h-4" />
                        <span>New Article</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="hover:text-gray-800 flex items-center gap-1"
                        route={{ page: { _tag: 'SettingsPage' } }}
                      >
                        <Cog6ToothIcon className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="hover:text-gray-800 flex items-center gap-1"
                        route={{ page: { _tag: 'ProfilePage', username: optUser.value.username, favorites: false } }}
                      >
                        <img src={optUser.value.image || 'https://api.realworld.io/images/smiley-cyrus.jpeg'} className="w-6 h-6 rounded-full" alt="" />
                        <span>{optUser.value.username}</span>
                      </Link>
                    </li>
                  </>
                )
                : (
                  <>
                    <li>
                      <Link
                        className="hover:text-gray-800"
                        route={{ page: { _tag: 'LoginPage' } }}
                      >
                        Sign in
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="hover:text-gray-800"
                        route={{ page: { _tag: 'RegisterPage' } }}
                      >
                        Sign up
                      </Link>
                    </li>
                  </>
                )
          )}
        </ul>
      </div>
    </nav>
  );
};
