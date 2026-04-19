import * as RD from '@devexperts/remote-data-ts'
import { FormItemMemo } from '@rinn7e/tea-cup-form/lib/component'
import { cn } from '@rinn7e/tea-cup-prelude'
import { Loader2 } from 'lucide-react'
import React from 'react'

import { Link } from '@/component/link'
import type { Route } from '@/type'
import { memoStrategy } from '@/util/memo-strategy'

import { Props, PropsEq, loginEmailField, loginPasswordField } from './type'

function LoginPageComponent({ model, dispatch }: Props) {
  const signupRoute: Route = { page: { _tag: 'SignupPage' } }

  return (
    <div className='flex min-h-full items-start justify-center px-[16px] pt-[64px] pb-[32px]'>
      <div className='flex w-full max-w-[448px] flex-col gap-[24px]'>
        <div className='flex flex-col gap-[8px]'>
          <h1 className='text-center text-3xl font-bold text-gray-900'>
            Sign in
          </h1>
          <p className='text-center text-sm'>
            <Link
              route={signupRoute}
              className='text-green-600 hover:underline'
            >
              Need an account?
            </Link>
          </p>
        </div>

        {RD.isFailure(model.requestRd) && (
          <ul className='flex flex-col gap-[4px] rounded border border-red-200 bg-red-50 p-[12px] text-sm text-red-700'>
            <li>{model.requestRd.error.actualErr}</li>
          </ul>
        )}

        <form
          className='flex flex-col gap-[24px]'
          autoComplete='off'
          onSubmit={(e) => {
            e.preventDefault()
            if (RD.isPending(model.requestRd) || !model.isFormValid) {
              return
            }
            dispatch({ _tag: 'Submit' })
          }}
        >
          <fieldset
            className='flex flex-col gap-[0px]'
            disabled={RD.isPending(model.requestRd)}
          >
            <FormItemMemo
              field={loginEmailField}
              model={model.form}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
            />
            <FormItemMemo
              field={loginPasswordField}
              model={model.form}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
            />
          </fieldset>
          <div className='pt-[16px]'>
            <button
              className={cn(
                'relative flex w-full items-center justify-center rounded bg-green-600 px-[16px] py-[10px] text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60',
                RD.isPending(model.requestRd) && 'pointer-events-none',
              )}
              type='submit'
              disabled={!model.isFormValid}
            >
              <span
                className={cn(RD.isPending(model.requestRd) && 'opacity-0')}
              >
                Sign in
              </span>
              {RD.isPending(model.requestRd) && (
                <div className='absolute inset-0 flex items-center justify-center'>
                  <Loader2 className='h-4 w-4 animate-spin' />
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export const LoginPageMemo = memoStrategy(LoginPageComponent, PropsEq.equals)
