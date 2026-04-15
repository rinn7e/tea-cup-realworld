import * as Form from '@rinn7e/tea-cup-form'
import type { Result } from 'tea-cup-fp'

import type { Errors, HttpErrorString, UserResponse } from '@/api/type'

export type Model = {
  isRegister: boolean
  loginForm: Form.Model
  signupForm: Form.Model
  errors: HttpErrorString | null
  submitting: boolean
}

export type Msg =
  | { _tag: 'FormMsg'; msg: Form.Msg }
  | { _tag: 'Submit' }
  | { _tag: 'SubmitResponse'; result: Result<HttpErrorString, UserResponse> }
