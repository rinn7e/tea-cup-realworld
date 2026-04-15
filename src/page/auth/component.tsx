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
    <div className='auth-page'>
      <div className='container page'>
        <div className='row'>
          <div className='col-md-6 offset-md-3 col-xs-12'>
            <h1 className='text-xs-center'>{title}</h1>
            <p className='text-xs-center'>
              <Link route={route}>{linkText}</Link>
            </p>

            {model.errors && (
              <ul className='error-messages'>
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
                  className='btn btn-lg btn-primary pull-xs-right'
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
