import * as t from 'io-ts'

import { ProfileJson } from './profile'
import type { Profile } from './profile'

export type Article = {
  slug: string
  title: string
  description: string
  body?: string
  tagList: string[]
  createdAt: string
  updatedAt: string
  favorited: boolean
  favoritesCount: number
  author: Profile
}

export const ArticleJson: t.Type<Article> = t.intersection([
  t.type({
    slug: t.string,
    title: t.string,
    description: t.string,
    tagList: t.array(t.string),
    createdAt: t.string,
    updatedAt: t.string,
    favorited: t.boolean,
    favoritesCount: t.number,
    author: ProfileJson,
  }),
  t.partial({
    body: t.string,
  }),
])

export type ArticleResponse = {
  article: Article
}

export const ArticleResponseJson: t.Type<ArticleResponse> = t.type({
  article: ArticleJson,
})

export type ArticlesResponse = {
  articles: Article[]
  articlesCount: number
}

export const ArticlesResponseJson: t.Type<ArticlesResponse> = t.type({
  articles: t.array(ArticleJson),
  articlesCount: t.number,
})

export type NewArticleRequest = {
  article: {
    title: string
    description: string
    body: string
    tagList?: string[]
  }
}

export type UpdateArticleRequest = {
  article: {
    title?: string
    description?: string
    body?: string
  }
}
