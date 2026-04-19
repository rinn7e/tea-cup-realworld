import { FormItemMemo } from '@rinn7e/tea-cup-form/lib/component'
import React from 'react'

import { memoStrategy } from '@/util/memo-strategy'

import { Props, PropsEq } from './type'

function SettingsView({ model, dispatch }: Props) {
  if (model.form._tag === 'None') {
    return (
      <div className='flex min-h-[400px] items-center justify-center pt-[64px]'>
        <div className='text-gray-500'>Loading settings...</div>
      </div>
    )
  }

  const form = model.form.value

  return (
    <div className='flex min-h-full items-start justify-center px-[16px] pt-[64px] pb-[32px]'>
      <div className='flex w-full max-w-[448px] flex-col gap-[24px]'>
        <h1 className='text-center text-3xl font-bold text-gray-900'>
          Your Settings
        </h1>

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
            <FormItemMemo
              field='image'
              model={form}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
            />
            <FormItemMemo
              field='username'
              model={form}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
            />
            <FormItemMemo
              field='bio'
              model={form}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
            />
            <FormItemMemo
              field='email'
              model={form}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
            />
            <FormItemMemo
              field='password'
              model={form}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
            />
            <div className='flex justify-end pt-[16px]'>
              <button
                className='rounded bg-green-600 px-[20px] py-[10px] text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60'
                type='submit'
                disabled={model.submitting}
              >
                Update Settings
              </button>
            </div>
          </fieldset>
        </form>

        <hr className='border-gray-200' />

        <div className='flex flex-col'>
          <button
            type='button'
            className='self-start rounded border border-red-400 px-[16px] py-[8px] text-sm text-red-500 transition-colors hover:bg-red-50'
            onClick={() => dispatch({ _tag: 'Logout' })}
          >
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  )
}

export const SettingsViewMemo = memoStrategy(SettingsView, PropsEq.equals)
