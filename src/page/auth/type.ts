import * as Form from '@rinn7e/tea-cup-form'
import { EqAlways, NullableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import type { Dispatcher, Result } from 'tea-cup-fp'

import { HttpErrorStringEq } from '@/api/type'
import type { HttpErrorString, UserResponse } from '@/api/type'

export type Model = {
  isRegister: boolean
  loginForm: Form.Model
  signupForm: Form.Model
  errors: HttpErrorString | null
  submitting: boolean
}

export const ModelEq = EqClass.struct<Model>({
  isRegister: B.Eq,
  loginForm: Form.ModelEq,
  signupForm: Form.ModelEq,
  errors: NullableEq(HttpErrorStringEq),
  submitting: B.Eq,
})

export type Msg =
  | { _tag: 'FormMsg'; subMsg: Form.Msg }
  | { _tag: 'Submit' }
  | { _tag: 'SubmitResponse'; result: Result<HttpErrorString, UserResponse> }

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  dispatch: EqAlways,
})
