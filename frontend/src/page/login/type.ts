import * as RD from '@devexperts/remote-data-ts'
import * as Form from '@rinn7e/tea-cup-form'
import { EqAlways } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import type { Dispatcher, Result } from 'tea-cup-fp'

import { HttpErrorStringEq } from '@/api/type'
import type { HttpErrorString, UserResponse } from '@/api/type'

export const loginEmailField = 'email'
export const loginPasswordField = 'password'

export type Model = {
  form: Form.Model
  requestRd: RD.RemoteData<HttpErrorString, null>
  isFormValid: boolean
}

export const ModelEq = EqClass.struct<Model>({
  form: Form.ModelEq,
  requestRd: RD.getEq(HttpErrorStringEq, EqAlways),
  isFormValid: B.Eq,
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
