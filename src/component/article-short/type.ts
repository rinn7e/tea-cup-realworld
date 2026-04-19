import type { Result } from 'tea-cup-fp'

import type { Article, ArticleResponse, HttpErrorString } from '@/api/type'

export type Model = Article

export type Msg =
  | { _tag: 'Favorite' }
  | { _tag: 'Unfavorite' }
  | {
      _tag: 'FavoriteResponse'
      result: Result<HttpErrorString, ArticleResponse>
    }
  | {
      _tag: 'UnfavoriteResponse'
      result: Result<HttpErrorString, ArticleResponse>
    }
