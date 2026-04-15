import { FormItemMemo } from '@rinn7e/tea-cup-form/lib/component'
import React from 'react'

import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: (msg: Msg) => void
}

export const SettingsView: React.FC<Props> = ({ model, dispatch }) => {
  return (
    <div className='settings-page'>
      <div className='container page'>
        <div className='row'>
          <div className='col-md-6 offset-md-3 col-xs-12'>
            <h1 className='text-xs-center'>Your Settings</h1>

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
                <FormItemMemo
                  field='image'
                  model={model.form}
                  dispatch={(msg) => dispatch({ _tag: 'FormMsg', msg })}
                />
                <FormItemMemo
                  field='username'
                  model={model.form}
                  dispatch={(msg) => dispatch({ _tag: 'FormMsg', msg })}
                />
                <FormItemMemo
                  field='bio'
                  model={model.form}
                  dispatch={(msg) => dispatch({ _tag: 'FormMsg', msg })}
                />
                <FormItemMemo
                  field='email'
                  model={model.form}
                  dispatch={(msg) => dispatch({ _tag: 'FormMsg', msg })}
                />
                <FormItemMemo
                  field='password'
                  model={model.form}
                  dispatch={(msg) => dispatch({ _tag: 'FormMsg', msg })}
                />
                <button
                  className='btn btn-lg btn-primary pull-xs-right'
                  type='submit'
                  disabled={model.submitting}
                >
                  Update Settings
                </button>
              </fieldset>
            </form>

            <hr />

            <button
              type='button'
              className='btn btn-outline-danger'
              onClick={() => dispatch({ _tag: 'Logout' })}
            >
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
