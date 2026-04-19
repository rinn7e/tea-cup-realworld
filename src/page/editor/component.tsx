import * as RD from '@devexperts/remote-data-ts'
import { FormItemMemo } from '@rinn7e/tea-cup-form/lib/component'
import React from 'react'

import { memoStrategy } from '@/util/memo-strategy'

import {
  Props,
  PropsEq,
  editorBodyField,
  editorDescriptionField,
  editorTagInputField,
  editorTitleField,
} from './type'

function EditorPageComponent({ model, dispatch }: Props) {
  const form = model.form

  return (
    <div className='mx-auto flex w-full max-w-[768px] flex-col gap-[24px] px-[16px] py-[32px]'>
      {RD.isFailure(model.requestRd) && (
        <ul className='flex flex-col gap-[4px] rounded border border-red-200 bg-red-50 p-[12px] text-sm text-red-700'>
          <li>{model.requestRd.error.actualErr}</li>
        </ul>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          dispatch({ _tag: 'Submit' })
        }}
      >
        <fieldset
          className='flex flex-col gap-[0px]'
          disabled={RD.isPending(model.requestRd)}
        >
          <FormItemMemo
            field={editorTitleField}
            model={form}
            dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
          />
          <FormItemMemo
            field={editorDescriptionField}
            model={form}
            dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
          />
          <FormItemMemo
            field={editorBodyField}
            model={form}
            dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
          />

          <FormItemMemo
            field={editorTagInputField}
            model={form}
            dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
          />

          <div className='flex justify-end pt-[24px]'>
            <button
              className='rounded bg-green-600 px-[20px] py-[10px] text-sm font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-60'
              type='submit'
              disabled={RD.isPending(model.requestRd) || !model.isFormValid}
            >
              Publish Article
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  )
}

export const EditorPageMemo = memoStrategy(EditorPageComponent, PropsEq.equals)
