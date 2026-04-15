import { FormItemMemo } from '@rinn7e/tea-cup-form/lib/component'
import React from 'react'

import { Link } from '../../component/link'
import type { Route } from '../../type'
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
    <div className='auth-page'>
      <div className='container mx-auto px-4 py-8'>
        <div className='flex flex-wrap justify-center'>
          <div className='w-full md:w-1/2 lg:w-1/3'>
            <h1 className='mb-2 text-center text-4xl'>{title}</h1>
            <p className='mb-6 text-center'>
              <Link
                route={route}
                className='text-brand-primary hover:underline'
              >
                {linkText}
              </Link>
            </p>

            {model.errors && (
              <ul className='error-messages mb-4 list-inside list-disc text-red-500'>
                {Object.entries(model.errors.errors).map(
                  ([field, messages]) => (
                    <li key={field}>
                      {field} {(messages as string[]).join(', ')}
                    </li>
                  ),
                )}
              </ul>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault()
                dispatch({ _tag: 'Submit' })
              }}
            >
              <fieldset>
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
                  className='btn btn-lg bg-brand-primary hover:bg-opacity-90 float-right mt-4 rounded px-6 py-3 text-xl font-light text-white transition-colors'
                  type='submit'
                  disabled={model.submitting}
                >
                  {title}
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
