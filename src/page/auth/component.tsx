import { cn } from '@rinn7e/tea-cup-prelude'
import { FormItemMemo } from '@rinn7e/tea-cup-form/lib/component'
import React from 'react'

import { Link } from '@/component/link'
import type { Route } from '@/type'
import { memoStrategy } from '@/util/memo-strategy'

import { Props, PropsEq } from './type'

function AuthView({ model, dispatch }: Props) {
  const title = model.isRegister ? 'Sign up' : 'Sign in'
  const linkText = model.isRegister ? 'Have an account?' : 'Need an account?'
  const loginRoute: Route = { page: { _tag: 'LoginPage' } }
  const registerRoute: Route = { page: { _tag: 'RegisterPage' } }
  const route = model.isRegister ? loginRoute : registerRoute

  return (
    <div className='flex min-h-full items-start justify-center px-[16px] pt-[64px] pb-[32px]'>
      <div className='w-full max-w-[448px] flex flex-col gap-[24px]'>
        <div className='flex flex-col gap-[8px]'>
          <h1 className='text-center text-3xl font-bold text-gray-900'>
            {title}
          </h1>
          <p className='text-center text-sm'>
            <Link route={route} className='text-green-600 hover:underline'>
              {linkText}
            </Link>
          </p>
        </div>

        {model.errors && (
          <ul className='flex flex-col gap-[4px] rounded border border-red-200 bg-red-50 p-[12px] text-sm text-red-700'>
            {Object.entries({ what: [model.errors.actualErr] }).map(
              ([field, messages]) => (
                <li key={field}>
                  {field} {(messages as string[]).join(', ')}
                </li>
              ),
            )}
          </ul>
        )}

        <form
          className='flex flex-col gap-[24px]'
          onSubmit={(e) => {
            e.preventDefault()
            dispatch({ _tag: 'Submit' })
          }}
        >
          <fieldset className='flex flex-col gap-[0px]'>
            {model.isRegister && (
              <FormItemMemo
                field='username'
                model={model.signupForm}
                dispatch={(msg) => dispatch({ _tag: 'FormMsg', msg })}
              />
            )}
            <FormItemMemo
              field='email'
              model={model.isRegister ? model.signupForm : model.loginForm}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', msg })}
            />
            <FormItemMemo
              field='password'
              model={model.isRegister ? model.signupForm : model.loginForm}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', msg })}
            />
            <div className='pt-[16px]'>
              <button
                className='w-full rounded bg-green-600 px-[16px] py-[10px] text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60 transition-colors'
                type='submit'
                disabled={model.submitting}
              >
                {title}
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  )
}

export const AuthViewMemo = memoStrategy(AuthView, PropsEq.equals)
