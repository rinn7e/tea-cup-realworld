import { CustomTextInputProps } from '@rinn7e/tea-cup-form'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import React from 'react'

export const standardInputUi =
  (
    isTextarea: boolean,
    onKeyDown: O.Option<(e: React.KeyboardEvent) => void> = O.none,
    isLarge: boolean = true,
  ) =>
  (props: CustomTextInputProps) => {
    const isError = E.isLeft(props.validationResult) && props.showValidation
    const sizeClass = isLarge ? 'py-3 text-base' : 'py-2 text-sm'
    const validationClass = isError ? 'border-red-500' : 'border-gray-300'
    const inputClass =
      `w-full rounded border ${validationClass} ${sizeClass} px-3 bg-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors`.trim()

    if (isTextarea) {
      return (
        <div className='mb-4'>
          <textarea
            className={inputClass}
            rows={8}
            placeholder={props.placeholder}
            value={props.currentValue}
            onChange={(e) =>
              props.dispatch({
                _tag: 'UpdateForm',
                key: props.key,
                event: e as unknown as React.ChangeEvent<HTMLInputElement>,
              })
            }
            onFocus={() =>
              props.dispatch({
                _tag: 'HandleFocus',
                key: props.key,
                isFocus: true,
              })
            }
            onBlur={() =>
              props.dispatch({
                _tag: 'HandleFocus',
                key: props.key,
                isFocus: false,
              })
            }
            onKeyDown={(e) => {
              if (O.isSome(onKeyDown)) {
                onKeyDown.value(e)
              }
            }}
          />
          {props.showValidation &&
            pipe(
              props.validationResult,
              E.fold(
                (err) => <div className='mt-1 text-xs text-red-600'>{err}</div>,
                () => null,
              ),
            )}
        </div>
      )
    }

    return (
      <div className='mb-4'>
        <input
          className={inputClass}
          type={
            props.isPassword._tag === 'Some'
              ? props.isPassword.value.revealPassword
                ? 'text'
                : 'password'
              : 'text'
          }
          placeholder={props.placeholder}
          value={props.currentValue}
          onInput={(e) =>
            props.dispatch({
              _tag: 'UpdateForm',
              key: props.key,
              event: e as unknown as React.ChangeEvent<HTMLInputElement>,
            })
          }
          onFocus={() =>
            props.dispatch({
              _tag: 'HandleFocus',
              key: props.key,
              isFocus: true,
            })
          }
          onBlur={() =>
            props.dispatch({
              _tag: 'HandleFocus',
              key: props.key,
              isFocus: false,
            })
          }
          onKeyDown={(e) => {
            if (O.isSome(onKeyDown)) {
              onKeyDown.value(e)
            }
          }}
        />
        {props.showValidation &&
          pipe(
            props.validationResult,
            E.fold(
              (err) => <div className='mt-1 text-xs text-red-600'>{err}</div>,
              () => null,
            ),
          )}
      </div>
    )
  }
