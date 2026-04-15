import { FormItemMemo } from '@rinn7e/tea-cup-form/lib/component'
import React from 'react'

import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: (msg: Msg) => void
}

export const SettingsView: React.FC<Props> = ({ model, dispatch }) => {
  return (
    <div className='flex min-h-[calc(100vh-8rem)] items-start justify-center pt-16 px-4'>
      <div className='w-full max-w-md'>
        <h1 className='text-3xl font-bold text-center text-gray-900'>Your Settings</h1>

        {model.errors && (
          <ul className='mt-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700 space-y-1'>
            {Object.entries(model.errors.errors).map(([field, messages]) => (
              <li key={field}>
                {field} {(messages as string[]).join(', ')}
              </li>
            ))}
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
            <div className='flex justify-end'>
              <button
                className='rounded bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60'
                type='submit'
                disabled={model.submitting}
              >
                Update Settings
              </button>
            </div>
          </fieldset>
        </form>

        <hr className='my-6 border-gray-200' />

        <button
          type='button'
          className='rounded border border-red-400 px-4 py-2 text-sm text-red-500 hover:bg-red-50'
          onClick={() => dispatch({ _tag: 'Logout' })}
        >
          Or click here to logout.
        </button>
      </div>
    </div>
  )
}
