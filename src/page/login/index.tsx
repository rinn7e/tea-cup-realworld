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

import { useState } from 'react'
import { FormItemMemo } from '@rinn7e/tea-cup-form'
import * as Form from '@rinn7e/tea-cup-form'
import {
  currentPassword,
  defaultChangePasswordFormConfig,
  newPassword,
  repeatNewPassword,
} from './type'

// export const LoginPage = () => {
//   return (
//     <div className='auth-page'>
//       <div className='container page'>
//         <div className='row'>
//           <div className='col-md-6 offset-md-3 col-xs-12'>
//             <h1 className='text-xs-center'>Sign in</h1>
//             <p className='text-xs-center'>
//               <a href='/register'>Need an account?</a>
//             </p>

//             <ul className='error-messages'>
//               <li>That email is already taken</li>
//             </ul>

//             <form>
//               <fieldset className='form-group'>
//                 <input
//                   className='form-control form-control-lg'
//                   type='text'
//                   placeholder='Email'
//                 />
//               </fieldset>
//               <fieldset className='form-group'>
//                 <input
//                   className='form-control form-control-lg'
//                   type='password'
//                   placeholder='Password'
//                 />
//               </fieldset>
//               <button className='btn btn-lg btn-primary pull-xs-right'>
//                 Sign in
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

export const LoginPage = () => {
  const [currentPasswordError, setCurrentPasswordError] =
    useState<boolean>(false)
  const [passwordDontMatch, setPasswordDontMatch] = useState<boolean>(false)
  const formDispatch = () => {}
  const model = {
    form: Form.init(new Map(defaultChangePasswordFormConfig)),
  }
  const isTablet = false

  return (
    <form
      onSubmit={() => {}}
      className='flex flex-col gap-y-[12px] lg:max-w-[440px] lg:mx-auto w-full h-full lg:mt-[16px]'
    >
      <div
        data-tooltip-id='jj-current-password-error'
        aria-invalid={Boolean(currentPasswordError)}
        className='group'
      >
        <FormItemMemo
          field={currentPassword}
          dispatch={formDispatch}
          model={model.form}
        />
      </div>

      <FormItemMemo
        field={newPassword}
        dispatch={formDispatch}
        model={model.form}
      />

      <div
        data-tooltip-id='jj-repeat-new-password-error'
        aria-invalid={passwordDontMatch}
        className='group'
      >
        <FormItemMemo
          field={repeatNewPassword}
          dispatch={formDispatch}
          model={model.form}
        />
      </div>

      <div className='flex justify-center gap-[12px] mt-auto lg:mt-[32px]'>
        {!isTablet && (
          <button className='flex-1' type='button' onClick={() => {}}>
            Cancel
          </button>
        )}

        <button className='flex-1' type='button' onClick={() => {}}>
          Submit
        </button>
      </div>
    </form>
  )
}
