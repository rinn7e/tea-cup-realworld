
/*
 * MIT License
 *
 * Copyright (c) 2025 Moremi Vannak
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import * as Form from '@rinn7e/tea-cup-form'
import { pipe } from 'fp-ts/lib/function'

import type { Model, Msg } from './type'
import { Cmd } from 'tea-cup-fp'


const preprocessFormMsgHandler =
  (newForm: Form.Model) =>
    (model: Model): Model => {
      const _validationResult = Form.runValidationForAll(
        newForm.forms,
        Form.noExtraValidation,
      )
      return {
        ...model,
        // currentPasswordError: '',
        form: newForm,
        // passwordDontMatch:
        //   validationResult._tag === 'Right' ? false : model.passwordDontMatch,
        // buttonState:
        //   validationResult._tag === 'Right'
        //     ? { _tag: 'Enabled', onClick: () => null }
        //     : { _tag: 'Disabled' },
      }
    }

// Given a Form.Msg, update the form model, and run preprocessing
export const formMsgHandler =
  (subMsg: Form.Msg) =>
    (model: Model): Model => {
      return pipe(model.form, Form.update(subMsg), (newForm) =>
        preprocessFormMsgHandler(newForm)(model),
      )
    }

export const submitHandler = (model: Model): [Model, Cmd<Msg>] => {
  // convert form data to data type accepts by the api call

  // call the api

  // create api response handler
  // - do redirection if success
  // - display error if not success
  return [model, Cmd.none<Msg>()]
}