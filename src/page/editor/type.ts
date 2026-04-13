import type { ArticleResponse, Errors } from '../../api/type';
import type { Result } from 'tea-cup-fp';

export type Model = {
  slug: string | null;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  tagInput: string;
  submitting: boolean;
  errors: Errors | null;
};

export type Msg =
  | { _tag: 'SetTitle'; value: string }
  | { _tag: 'SetDescription'; value: string }
  | { _tag: 'SetBody'; value: string }
  | { _tag: 'SetTagInput'; value: string }
  | { _tag: 'AddTag' }
  | { _tag: 'RemoveTag'; tag: string }
  | { _tag: 'Submit' }
  | { _tag: 'SubmitResponse'; result: Result<Error | Errors, ArticleResponse> }
  | { _tag: 'GetArticleResponse'; result: Result<Error, ArticleResponse> };
