import * as Form from '@rinn7e/tea-cup-form'
import type { Result } from 'tea-cup-fp'

import type { ArticleResponse, Errors, HttpErrorString } from '@/api/type'

export type Model = {
  slug: string | null
  form: Form.Model
  tagList: string[]
  errors: HttpErrorString | null
  submitting: boolean
}

export type Msg =
  | { _tag: 'FormMsg'; msg: Form.Msg }
  | { _tag: 'Submit' }
  | { _tag: 'SubmitResponse'; result: Result<HttpErrorString, ArticleResponse> }
  | {
      _tag: 'GetArticleResponse'
      result: Result<HttpErrorString, ArticleResponse>
    }
  | { _tag: 'AddTag' }
  | { _tag: 'RemoveTag'; tag: string }
