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
import { type JSX } from 'react'

export const textInputView = (
  props: Form.CustomTextInputProps,
): JSX.Element | null => {
  const {
    key,
    // label,
    // isFocus,
    placeholder,
    currentValue,
    // showValidation,
    dispatch,
    // validationResult,
    // validation,
    // isPassword,
  } = props

  const inputType =
    props.isPassword._tag === 'Some' && !props.isPassword.value.revealPassword
      ? 'password'
      : 'text'

  return (
    <fieldset className='form-group'>
      <input
        name={key}
        type={inputType}
        value={currentValue}
        placeholder={placeholder}
        onInput={(event) =>
          dispatch({ _tag: 'UpdateForm', key: props.key, event })
        }
        onFocus={(_) =>
          dispatch({
            _tag: 'HandleFocus',
            key: key,
            isFocus: true,
          })
        }
        onBlur={(_) =>
          dispatch({
            _tag: 'HandleFocus',
            key: key,
            isFocus: false,
          })
        }
        autoComplete={'false'}
        className='form-control form-control-lg'
      />
    </fieldset>
  )
}
