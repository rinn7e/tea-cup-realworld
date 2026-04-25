import * as RD from '@devexperts/remote-data-ts'
import * as Form from '@rinn7e/tea-cup-form'
import { EqAlways, NullableEq } from '@rinn7e/tea-cup-prelude'
import * as EqClass from 'fp-ts/lib/Eq'
import * as B from 'fp-ts/lib/boolean'
import * as S from 'fp-ts/lib/string'
import type { Dispatcher, Result } from 'tea-cup-fp'

import { HttpErrorStringEq } from '@/api/type'
import type { ArticleResponse, HttpErrorString } from '@/api/type'

export const editorTitleField = 'title'
export const editorDescriptionField = 'description'
export const editorBodyField = 'body'
export const editorTagInputField = 'tagInput'

export type Model = {
  slug: string | null
  form: Form.Model
  requestRd: RD.RemoteData<HttpErrorString, null>
  isFormValid: boolean
}

export const ModelEq = EqClass.struct<Model>({
  slug: NullableEq(S.Eq),
  form: Form.ModelEq,
  requestRd: RD.getEq(HttpErrorStringEq, EqAlways),
  isFormValid: B.Eq,
})

export type Msg =
  | { _tag: 'FormMsg'; subMsg: Form.Msg }
  | { _tag: 'Submit' }
  | { _tag: 'SubmitResponse'; result: Result<HttpErrorString, ArticleResponse> }
  | {
      _tag: 'GetArticleResponse'
      result: Result<HttpErrorString, ArticleResponse>
    }

export type Props = {
  model: Model
  dispatch: Dispatcher<Msg>
}

export const PropsEq: EqClass.Eq<Props> = EqClass.struct({
  model: ModelEq,
  dispatch: EqAlways,
})
