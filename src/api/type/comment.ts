import * as t from 'io-ts'

import { ProfileJson } from './profile'
import type { Profile } from './profile'

export type Comment = {
  id: number
  createdAt: string
  updatedAt: string
  body: string
  author: Profile
}

export const CommentJson: t.Type<Comment> = t.type({
  id: t.number,
  createdAt: t.string,
  updatedAt: t.string,
  body: t.string,
  author: ProfileJson,
})

export type CommentResponse = {
  comment: Comment
}

export const CommentResponseJson: t.Type<CommentResponse> = t.type({
  comment: CommentJson,
})

export type CommentsResponse = {
  comments: Comment[]
}

export const CommentsResponseJson: t.Type<CommentsResponse> = t.type({
  comments: t.array(CommentJson),
})
