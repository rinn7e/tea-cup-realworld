import { FormItemMemo } from '@rinn7e/tea-cup-form/lib/component'
import React from 'react'

import type { Model, Msg } from './type'

interface Props {
  model: Model
  dispatch: (msg: Msg) => void
}

export const EditorView: React.FC<Props> = ({ model, dispatch }) => {
  return (
    <div className='editor-page'>
      <div className='container page'>
        <div className='row'>
          <div className='col-md-10 offset-md-1 col-xs-12'>
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

                <fieldset className='form-group'>
                  <FormItemMemo
                    field='tagInput'
                    model={model.form}
                    dispatch={(msg) => dispatch({ _tag: 'FormMsg', msg })}
                  />
                  <div className='tag-list'>
                    {model.tagList.map((tag) => (
                      <span key={tag} className='tag-default tag-pill'>
                        <i
                          className='ion-close-round'
                          style={{ cursor: 'pointer' }}
                          onClick={() => dispatch({ _tag: 'RemoveTag', tag })}
                        />{' '}
                        {tag}
                      </span>
                    ))}
                  </div>
                </fieldset>

                <button
                  className='btn btn-lg pull-xs-right btn-primary'
                  type='submit'
                  disabled={model.submitting}
                >
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
