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

import { type CustomTextInputProps } from '@rinn7e/tea-cup-form'
import { cl, tooltip } from '@/util'

export interface InputFieldProps {
  tooltip?: string
}

export const inputField = (initProps: InputFieldProps = {}) => {
  return (props: CustomTextInputProps) => {
    const isPassword =
      props.isPassword._tag === 'Some' && !props.isPassword.value.revealPassword

    const passwordTooltip = isPassword ? 'Show password' : 'Hide password'
    const icon = isPassword ? 'icon-eye-crossed' : 'icon-eye'

    return (
      <div className='flex flex-col gap-y-[8px]'>
        {props.label !== '' ? (
          <label
            htmlFor={`input:${props?.key}`}
            className={cl('text-[12px] text-jj-dark-700', 'lg:text-[14px] ')}
          >
            {props?.label}
          </label>
        ) : null}

        <div className='relative'>
          <input
            name={props?.key}
            id={`input:${props?.key}`}
            className='border border-jj-dark-10 rounded-[4px] px-[12px] py-[8px] w-full group-aria-[invalid=true]:!border-jj-red-200'
            type={isPassword ? 'password' : 'text'}
            value={props.currentValue}
            placeholder={props?.placeholder}
            onInput={(event) =>
              props.dispatch({ _tag: 'UpdateForm', key: props.key, event })
            }
            onFocus={(_) =>
              props.dispatch({
                _tag: 'HandleFocus',
                key: props.key,
                isFocus: true,
              })
            }
            onBlur={(_) =>
              props.dispatch({
                _tag: 'HandleFocus',
                key: props.key,
                isFocus: false,
              })
            }
            autoComplete={
              props.isPassword._tag === 'Some' &&
              props.isPassword.value.disableAutocomplete
                ? 'new-password'
                : 'true'
            }
          />

          {props.isPassword._tag === 'Some' && (
            <button
              type='button'
              onClick={(e) =>
                props.dispatch({
                  _tag: 'RevealPassword',
                  revealed: isPassword,
                  key: props.key,
                  event: e,
                })
              }
              className='absolute top-1/2 -translate-y-1/2 right-[12px] text-jj-dark-100'
            >
              {tooltip({
                content: () => passwordTooltip,
                positioning: { placement: 'top' },
                children: () => (
                  <span className={cl('icon text-[16px]', icon)}></span>
                ),
              })}
            </button>
          )}

          {initProps.tooltip && props.isPassword._tag === 'None' && (
            <label
              htmlFor={`input:${props.key}`}
              className='absolute top-1/2 -translate-y-1/2 right-[12px]'
            >
              {tooltip({
                content: () => initProps.tooltip,
                positioning: { placement: 'top' },
                children: () => <div>Question icon</div>,
              })}
            </label>
          )}
        </div>
      </div>
    )
  }
}
