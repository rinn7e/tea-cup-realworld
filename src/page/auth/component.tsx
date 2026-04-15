import { FormItemMemo } from '@rinn7e/tea-cup-form/lib/component'
import React from 'react'

import { Link } from '@/component/link'
import type { Route } from '@/type'

import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: (msg: Msg) => void
}

export const AuthView: React.FC<Props> = ({ model, dispatch }) => {
  const title = model.isRegister ? 'Sign up' : 'Sign in'
  const linkText = model.isRegister ? 'Have an account?' : 'Need an account?'
  const loginRoute: Route = { page: { _tag: 'LoginPage' } }
  const registerRoute: Route = { page: { _tag: 'RegisterPage' } }
  const route = model.isRegister ? loginRoute : registerRoute

  return (
    <div className='flex min-h-[calc(100vh-8rem)] items-start justify-center px-4 pt-16'>
      <div className='w-full max-w-md'>
        <h1 className='text-center text-3xl font-bold text-gray-900'>
          {title}
        </h1>
        <p className='mt-2 text-center text-sm'>
          <Link route={route} className='text-green-600 hover:underline'>
            {linkText}
          </Link>
        </p>

        {model.errors && (
          <ul className='mt-4 space-y-1 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700'>
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
          className='mt-6'
          onSubmit={(e) => {
            e.preventDefault()
            dispatch({ _tag: 'Submit' })
          }}
        >
          <fieldset className='space-y-0'>
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
            <button
              className='w-full rounded bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60'
              type='submit'
              disabled={model.submitting}
            >
              {title}
            </button>
          </fieldset>
        </form>
      </div>
    </div>
  )
}
