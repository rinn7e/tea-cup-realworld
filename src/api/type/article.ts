import { Decode, Decoder } from 'tea-cup-fp'

import { map10 } from '@/util/tea/decode'
import { authorDecoder, type Author } from './author'

// Article
// -----------------------------------------------------

export type Article = {
  slug: string
  title: string
  description: string
  body: string
  tagList: string[]
  createdAt: string
  updatedAt: string
  favorited: boolean
  favoritesCount: number
  author: Author
}

export const articleDecoder: Decoder<Article> = map10(
  (
    slug: string,
    title: string,
    description: string,
    body: string,
    tagList: string[],
    createdAt: string,
    updatedAt: string,
    favorited: boolean,
    favoritesCount: number,
    author: Article['author'],
  ) => ({
    slug,
    title,
    description,
    body,
    tagList,
    createdAt,
    updatedAt,
    favorited,
    favoritesCount,
    author,
  }),
  Decode.field('slug', Decode.str),
  Decode.field('title', Decode.str),
  Decode.field('description', Decode.str),
  Decode.field('body', Decode.str),
  Decode.field('tagList', Decode.array(Decode.str)),
  Decode.field('createdAt', Decode.str),
  Decode.field('updatedAt', Decode.str),
  Decode.field('favorited', Decode.bool),
  Decode.field('favoritesCount', Decode.num),
  Decode.field('author', authorDecoder),
)

// ArticleGroup
// -----------------------------------------------------

export type ArticleGroup = {
  articles: Article[]
  articlesCount: number
}

export const articleListDecoder: Decoder<ArticleGroup> = Decode.map2(
  (articles: Article[], articlesCount: number) => ({
    articles,
    articlesCount,
  }),
  Decode.field('articles', Decode.array(articleDecoder)),
  Decode.field('articlesCount', Decode.num),
)
