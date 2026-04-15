import { FormItemMemo } from '@rinn7e/tea-cup-form/lib/component'
import { X } from 'lucide-react'
import React from 'react'

import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: (msg: Msg) => void
}

export const EditorView: React.FC<Props> = ({ model, dispatch }) => {
  return (
    <div className='mx-auto max-w-3xl px-4 py-8'>
      {model.errors && (
        <ul className='mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700 space-y-1'>
          {Object.entries(model.errors.errors).map(([field, messages]) => (
            <li key={field}>
              {field} {(messages as string[]).join(', ')}
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          dispatch({ _tag: 'Submit' })
        }}
      >
        <fieldset className='space-y-0'>
          <FormItemMemo
            field='title'
            model={model.form}
            dispatch={(msg) => dispatch({ _tag: 'FormMsg', msg })}
          />
          <FormItemMemo
            field='description'
            model={model.form}
            dispatch={(msg) => dispatch({ _tag: 'FormMsg', msg })}
          />
          <FormItemMemo
            field='body'
            model={model.form}
            dispatch={(msg) => dispatch({ _tag: 'FormMsg', msg })}
          />

          <div className='mb-4'>
            <FormItemMemo
              field='tagInput'
              model={model.form}
              dispatch={(msg) => dispatch({ _tag: 'FormMsg', msg })}
            />
            <div className='flex flex-wrap gap-1'>
              {model.tagList.map((tag) => (
                <span
                  key={tag}
                  className='inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800'
                >
                  <button
                    type='button'
                    className='cursor-pointer hover:text-green-600'
                    onClick={() => dispatch({ _tag: 'RemoveTag', tag })}
                  >
                    <X size={12} />
                  </button>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className='flex justify-end'>
            <button
              className='rounded bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-60'
              type='submit'
              disabled={model.submitting}
            >
              Publish Article
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  )
}
