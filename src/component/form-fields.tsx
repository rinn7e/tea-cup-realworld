import {
  CustomTextInputProps,
  autocompleteToString,
  textInputVariantToString,
} from '@rinn7e/tea-cup-form'
import { cn } from '@rinn7e/tea-cup-prelude'
import * as E from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { Eye, EyeOff } from 'lucide-react'
import React from 'react'

export type ExtraTextInputProps = {
  // Note: good way to add custom keyboard shortcut, but not needed at the moment
  // onKeyDown?: O.Option<(e: React.KeyboardEvent) => void>
  isSmall?: boolean
}

export const standardInputUi =
  (extra: ExtraTextInputProps = {}) =>
  (props: CustomTextInputProps) => {
    const isSmall = extra.isSmall ?? false
    const isError = E.isLeft(props.validationResult) && props.showValidation
    const sizeClass = isSmall ? 'py-[8px] text-sm' : 'py-[12px] text-base'
    const validationClass = isError
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 focus:border-green-500 focus:ring-green-500'
    const inputClass = cn(
      'w-full rounded border px-[12px] bg-white outline-none focus:ring-1 transition-colors',
      validationClass,
      sizeClass,
    )

    const variant = props.variant

    const content = props.isTextarea ? (
      <textarea
        name={props.key}
        autoComplete={autocompleteToString(props.autocomplete)}
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
        // onKeyDown={(e) => {
        //   if (O.isSome(onKeyDown)) {
        //     onKeyDown.value(e)
        //   }
        // }}
      />
    ) : (
      <div className='relative flex items-center'>
        <input
          name={props.key}
          autoComplete={autocompleteToString(props.autocomplete)}
          className={cn(inputClass, variant._tag === 'Password' && 'pr-[40px]')}
          type={textInputVariantToString(variant)}
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
          // onKeyDown={(e) => {
          //   if (O.isSome(onKeyDown)) {
          //     onKeyDown.value(e)
          //   }
          // }}
        />
        {variant._tag === 'Password' && (
          <button
            type='button'
            className='absolute right-[6px] flex items-center justify-center p-2 text-gray-500 transition-colors hover:text-gray-700'
            onClick={(e) =>
              props.dispatch({
                _tag: 'SetRevealPassword',
                key: props.key,
                reveal: !variant.reveal,
                event: e,
              })
            }
          >
            {variant.reveal ? <EyeOff size={20} /> : <Eye size={20} />}
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
