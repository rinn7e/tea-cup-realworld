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
    const sizeClass = isLarge ? 'form-control-lg' : ''
    const validationClass = isError ? 'is-invalid' : ''
    const inputClass = `form-control ${sizeClass} ${validationClass}`.trim()

    if (isTextarea) {
      return (
        <fieldset className='form-group'>
          <textarea
            className={inputClass}
            rows={8}
            placeholder={props.placeholder}
            value={props.currentValue}
            onChange={(e) =>
              props.dispatch({
                _tag: 'UpdateForm',
                key: props.key,
                event: e as any,
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
                (err) => <div className='error-messages'>{err}</div>,
                () => null,
              ),
            )}
        </fieldset>
      )
    }

    return (
      <fieldset className='form-group'>
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
              event: e as any,
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
              (err) => <div className='error-messages'>{err}</div>,
              () => null,
            ),
          )}
      </fieldset>
    )
  }
