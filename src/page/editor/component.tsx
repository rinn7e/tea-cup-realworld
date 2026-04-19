import * as RD from '@devexperts/remote-data-ts'
import { FormItemMemo } from '@rinn7e/tea-cup-form/lib/component'
import { pipe } from 'fp-ts/lib/function'
import { X } from 'lucide-react'
import React from 'react'

import { memoStrategy } from '@/util/memo-strategy'

import { Props, PropsEq } from './type'

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
            field='title'
            model={form}
            dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
          />
          <FormItemMemo
            field='description'
            model={form}
            dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
          />
          <FormItemMemo
            field='body'
            model={form}
            dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
          />

          <div className='flex flex-col gap-[8px]'>
            <FormItemMemo
              field='tagInput'
              model={form}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', subMsg: msg })}
            />
            <div className='flex flex-wrap gap-[4px] px-[12px]'>
              {model.tagList.map((tag) => (
                <span
                  key={tag}
                  className='inline-flex items-center gap-[4px] rounded-full bg-green-100 px-[8px] py-[2px] text-xs text-green-800'
                >
                  <button
                    type='button'
                    className='cursor-pointer hover:text-green-600 focus:outline-none'
                    onClick={() => dispatch({ _tag: 'RemoveTag', tag })}
                  >
                    <X size={12} />
                  </button>
                  {tag}
                </span>
              ))}
            </div>
          </div>

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
