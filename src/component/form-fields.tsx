import { CustomTextInputProps } from '@rinn7e/tea-cup-form'
import { cn } from '@rinn7e/tea-cup-prelude'
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
    const sizeClass = isLarge ? 'py-[12px] text-base' : 'py-[8px] text-sm'
    const validationClass = isError ? 'border-red-500' : 'border-gray-300'
    const inputClass = cn(
      'w-full rounded border px-[12px] bg-white outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-colors',
      validationClass,
      sizeClass,
    )

    const content = isTextarea ? (
      <textarea
        className={cn(inputClass, 'resize-none')}
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
    ) : (
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
    )

    return (
      <div className='flex flex-col gap-[4px] pb-[16px]'>
        {content}
        {props.showValidation &&
          pipe(
            props.validationResult,
            E.fold(
              (err) => <div className='text-xs text-red-600 px-[4px]'>{err}</div>,
              () => null,
            ),
          )}
      </div>
    )
  }
