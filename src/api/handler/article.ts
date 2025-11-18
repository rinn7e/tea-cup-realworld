import { Http, Task } from 'tea-cup-fp'
import { articleListDecoder, type ArticleGroup } from '../type'
import { api } from '../common'

export const callArticleGroupEndpoint = (): Task<Error, ArticleGroup> => {
  return Http.jsonBody(Http.fetch(api + '/articles'), articleListDecoder)
}
