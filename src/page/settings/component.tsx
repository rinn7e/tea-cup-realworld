import { cn } from '@rinn7e/tea-cup-prelude'
import { FormItemMemo } from '@rinn7e/tea-cup-form/lib/component'
import React from 'react'

import { memoStrategy } from '@/util/memo-strategy'

import { Props, PropsEq } from './type'

function SettingsView({ model, dispatch }: Props) {
  return (
    <div className='flex min-h-full items-start justify-center px-[16px] pt-[64px] pb-[32px]'>
      <div className='w-full max-w-[448px] flex flex-col gap-[24px]'>
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
            <div className='flex justify-end pt-[16px]'>
              <button
                className='rounded bg-green-600 px-[20px] py-[10px] text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60 transition-colors'
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
            className='rounded border border-red-400 px-[16px] py-[8px] text-sm text-red-500 hover:bg-red-50 transition-colors self-start'
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
