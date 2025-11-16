/*
 * MIT License
 *
 * Copyright (c) 2025 Moremi Vannak
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import { Link } from '@/component/link'
import { loginPage, registerPage, route } from '@/data/route'
import type { Props } from '@/type'

export const nav = (props: Props) => {
  const { dispatch } = props
  return (
    <nav className='navbar navbar-light'>
      <div className='container'>
        <a className='navbar-brand' href='/'>
          conduit
        </a>
        <ul className='nav navbar-nav pull-xs-right'>
          <li className='nav-item'>
            {/* <!-- Add "active" className when you're on that page" --> */}
            <a className='nav-link active' href='/'>
              Home
            </a>
          </li>
          <li className='nav-item'>
            {/* <a
              className='nav-link'
              // href='/login'
              onClick={() => dispatch({ _tag: 'ChangePage', page: loginPage() })}
            >
              Sign in
            </a> */}
            <Link
              className='nav-link'
              dispatch={dispatch}
              route={route(loginPage())}
            >
              Sign in
            </Link>
          </li>
          <li className='nav-item'>
            {/* <a
              className='nav-link'
              // href='/register'
              onClick={() => dispatch({ _tag: 'ChangePage', page: registerPage() })}
            >
              Sign up
            </a> */}
            <Link
              className='nav-link'
              dispatch={dispatch}
              route={route(registerPage())}
            >
              Sign up
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export const navAuth = () => {
  return (
    <nav className='navbar navbar-light'>
      <div className='container'>
        <a className='navbar-brand' href='/'>
          conduit
        </a>
        <ul className='nav navbar-nav pull-xs-right'>
          <li className='nav-item'>
            {/* <!-- Add "active" className when you're on that page" --> */}
            <a className='nav-link active' href='/'>
              Home
            </a>
          </li>
          <li className='nav-item'>
            <a className='nav-link' href='/editor'>
              {' '}
              <i className='ion-compose'></i>&nbsp;New Article{' '}
            </a>
          </li>
          <li className='nav-item'>
            <a className='nav-link' href='/settings'>
              {' '}
              <i className='ion-gear-a'></i>&nbsp;Settings{' '}
            </a>
          </li>
          <li className='nav-item'>
            <a className='nav-link' href='/profile/eric-simons'>
              <img src='' className='user-pic' />
              Eric Simons
            </a>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export const footer = () => {
  return (
    <footer>
      <div className='container'>
        <a href='/' className='logo-font'>
          conduit
        </a>
        <span className='attribution'>
          An interactive learning project from{' '}
          <a href='https://thinkster.io'>Thinkster</a>. Code &amp; design
          licensed under MIT.
        </span>
      </div>
    </footer>
  )
}
