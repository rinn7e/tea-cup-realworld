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
import { Cmd } from 'tea-cup-fp'

import { client, cmdFromPromise } from '@/util'
import * as Api from '@/generated/api'
import type { Model, Msg } from './type'
import { emailField, passwordField, usernameField } from './update'

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

const formToEndpointBody = (forms: Form.Forms): Api.NewUserRequest => {
  // return Form.valueTextType(Form.lookupForm(renameContactField, forms))
  return {
    user: {
      username: Form.valueTextType(Form.lookupForm(usernameField, forms)),
      email: Form.valueTextType(Form.lookupForm(emailField, forms)),
      password: Form.valueTextType(Form.lookupForm(passwordField, forms)),
    },
  }
}

export const submitHandler = (model: Model): [Model, Cmd<Msg>] => {
  // convert form data to data type accepts by the api call

  // call the api

  // create api response handler
  // - do redirection if success
  // - display error if not success
  // return [model, Cmd.none<Msg>()]
  return [
    model,
    cmdFromPromise(
      async () => {
        const body: Api.NewUserRequest = formToEndpointBody(model.form.forms)
        // TOOD: somehow the api doesn't throw error if the name already exist.
        const result = await Api.createUser({ client: client(), body })
        //       {
        //   "user": {
        //     "username": "test",
        //     "email": "test@test.com",
        //     "bio": "",
        //     "image": "https://raw.githubusercontent.com/gothinkster/node-express-realworld-example-app/refs/heads/master/src/assets/images/smiley-cyrus.jpeg",
        //     "token": "token_7d736e0265cba87bdc3a42cf6e6590cb"
        //   }
        // }
        console.log('what', result)
        return null
      },
      () => ({ _tag: 'None' }),
    ),
  ]
}
