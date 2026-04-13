import React from 'react';
import type { Dispatcher } from 'tea-cup-fp';
import type { Model, Msg } from '../type';
import type { Option } from 'fp-ts/lib/Option';

interface Props {
  model: Model;
  dispatch: Dispatcher<Msg>;
}

export const Navbar: React.FC<Props> = ({ model }) => {
  const user = model.shared.user;

  return (
    <nav className="navbar navbar-light px-4 py-2 flex items-center justify-between border-b">
      <div className="container mx-auto flex items-center justify-between">
        <a className="text-brand-primary text-2xl font-bold font-sans" href="/">
          conduit
        </a>
        <ul className="flex space-x-4 text-gray-500">
          <li>
            <a className="hover:text-gray-800" href="/">Home</a>
          </li>
          {pipe(
            user,
            (optUser: Option<any>) => 
              optUser._tag === 'Some' 
                ? (
                  <>
                    <li>
                      <a className="hover:text-gray-800" href="/editor">New Article</a>
                    </li>
                    <li>
                      <a className="hover:text-gray-800" href="/settings">Settings</a>
                    </li>
                    <li>
                      <a className="hover:text-gray-800" href={`/profile/${optUser.value.username}`}>{optUser.value.username}</a>
                    </li>
                  </>
                )
                : (
                  <>
                    <li>
                      <a className="hover:text-gray-800" href="/login">Sign in</a>
                    </li>
                    <li>
                      <a className="hover:text-gray-800" href="/register">Sign up</a>
                    </li>
                  </>
                )
          )}
        </ul>
      </div>
    </nav>
  );
};

function pipe<A, B>(a: A, f: (a: A) => B): B {
  return f(a);
}
