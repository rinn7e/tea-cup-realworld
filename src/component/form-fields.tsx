import { CustomTextInputProps } from '@rinn7e/tea-cup-form'
import { cn } from '@rinn7e/tea-cup-prelude'
import * as E from 'fp-ts/lib/Either'
import * as O from 'fp-ts/lib/Option'
import { pipe } from 'fp-ts/lib/function'
import { Eye, EyeOff } from 'lucide-react'
import React from 'react'
import { isEmailField } from '@/util/form'

export const standardInputUi =
  (
    isTextarea: boolean,
    onKeyDown: O.Option<(e: React.KeyboardEvent) => void> = O.none,
    isLarge: boolean = true,
  ) =>
  (props: CustomTextInputProps) => {
    const isError = E.isLeft(props.validationResult) && props.showValidation
    const sizeClass = isLarge ? 'py-[12px] text-base' : 'py-[8px] text-sm'
    const validationClass = isError
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
    const inputClass = cn(
      'w-full rounded border px-[12px] bg-white outline-none focus:ring-1 transition-colors',
      validationClass,
      sizeClass,
    )

    const isPassword = O.toNullable(props.isPassword)

    const content = isTextarea ? (
      <textarea
        name={props.key}
        autoComplete='off'
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
      <div className='relative flex items-center'>
        <input
          name={props.key}
          autoComplete='off'
          className={cn(inputClass, isPassword && 'pr-[40px]')}
          type={
            isPassword
              ? isPassword.revealPassword
                ? 'text'
                : 'password'
              : isEmailField(props.key)
                ? 'email'
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
        {isPassword && (
          <button
            type='button'
            className='absolute right-[6px] flex items-center justify-center p-2 text-gray-500 transition-colors hover:text-gray-700'
            onClick={(e) =>
              props.dispatch({
                _tag: 'RevealPassword',
                key: props.key,
                revealed: !isPassword.revealPassword,
                event: e,
              })
            }
          >
            {isPassword.revealPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        )}
      </div>
    )

    return (
      <div className='flex flex-col gap-[4px] pb-[16px]'>
        {content}
        {props.showValidation &&
          pipe(
            props.validationResult,
            E.fold(
              (err) => (
                <div className='px-[4px] text-xs text-red-600'>{err}</div>
              ),
              () => null,
            ),
          )}
      </div>
    )
  }
