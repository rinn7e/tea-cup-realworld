import * as Form from '@rinn7e/tea-cup-form'
import type { Result } from 'tea-cup-fp'

import type { ArticleResponse, Errors } from '../../api/type'

export type Model = {
  slug: string | null
  form: Form.Model
  tagList: string[]
  errors: Errors | null
  submitting: boolean
}

export type Msg =
  | { _tag: 'FormMsg'; msg: Form.Msg }
  | { _tag: 'Submit' }
  | { _tag: 'SubmitResponse'; result: Result<Error | Errors, ArticleResponse> }
  | {
      _tag: 'GetArticleResponse'
      result: Result<Error | Errors, ArticleResponse>
    }
  | { _tag: 'AddTag' }
  | { _tag: 'RemoveTag'; tag: string }
