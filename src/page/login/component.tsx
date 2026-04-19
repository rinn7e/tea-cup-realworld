import * as RD from '@devexperts/remote-data-ts'
import { FormItemMemo } from '@rinn7e/tea-cup-form/lib/component'
import { pipe } from 'fp-ts/lib/function'
import React from 'react'

import { Link } from '@/component/link'
import type { Route } from '@/type'
import { memoStrategy } from '@/util/memo-strategy'

import { Props, PropsEq } from './type'

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

        {pipe(
          model.submitRd,
          RD.fold(
            () => null,
            () => null,
            (err) => (
              <ul className='flex flex-col gap-[4px] rounded border border-red-200 bg-red-50 p-[12px] text-sm text-red-700'>
                <li>{err.actualErr}</li>
              </ul>
            ),
            () => null,
          ),
        )}

        <form
          className='flex flex-col gap-[24px]'
          autoComplete='off'
          onSubmit={(e) => {
            e.preventDefault()
            dispatch({ _tag: 'Submit' })
          }}
        >
          <fieldset className='flex flex-col gap-[0px]'>
            <FormItemMemo
              field='email'
              model={model.form}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
            />
            <FormItemMemo
              field='password'
              model={model.form}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
            />
            <div className='pt-[16px]'>
              <button
                className='w-full rounded bg-green-600 px-[16px] py-[10px] text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60'
                type='submit'
                disabled={RD.isPending(model.submitRd)}
              >
                Sign in
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  )
}

export const LoginPageMemo = memoStrategy(LoginPageComponent, PropsEq.equals)
