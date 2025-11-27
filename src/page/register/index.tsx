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

import * as Form from '@rinn7e/tea-cup-form'
import { FormItemMemo } from '@rinn7e/tea-cup-form'
import { map } from 'tea-cup-fp'

import { buttonView } from '@/component/button'
import { errorTextView } from '@/component/error-text'
import { headerSubTextView } from '@/component/header-sub-text'
import { headerTextView } from '@/component/header-text'
import type { Msg, Props } from './type'
import { emailField, passwordField, usernameField } from './update'


// -----------------------------------------------------------------
// View
// -----------------------------------------------------------------

export const RegisterPageView = (props: Props) => {
  const {dispatch, model} = props

  const formDispatch = map(
    dispatch,
    (subMsg: Form.Msg) =>
      ({
        _tag: 'FormMsg',
        subMsg,
      } satisfies Msg),
  )

  return (
    <div className='auth-page'>
      <div className='container page'>
        <div className='row'>
          <div className='col-md-6 offset-md-3 col-xs-12'>
            {headerTextView({ label: 'Sign up' })}
            {headerSubTextView({ label: 'Have an account?', href: '/login' })}
            {errorTextView({ label: 'That email is already taken' })}

            <form>
              <FormItemMemo
                field={usernameField}
                dispatch={formDispatch}
                model={model.form}
              />
              <FormItemMemo
                field={emailField}
                dispatch={formDispatch}
                model={model.form}
              />
              <FormItemMemo
                field={passwordField}
                dispatch={formDispatch}
                model={model.form}
              />

              {buttonView({ label: 'Sign up' })}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
