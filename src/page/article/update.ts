import * as RD from '@devexperts/remote-data-ts'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import type { Option } from 'fp-ts/lib/Option'
import { Cmd } from 'tea-cup-fp'

import type { Shared } from '@/type'

import {
  createComment,
  deleteArticle,
  deleteComment,
  favoriteArticle,
  followUser,
  getArticle,
  getComments,
  unfavoriteArticle,
  unfollowUser,
} from '@/api'

import type { Model, Msg } from './type'

export const init = (
  slug: string,
  shared: Shared,
): [Model, Cmd<Msg>] => {
  const model: Model = {
    slug,
    article: RD.pending,
    comments: RD.pending,
    commentInput: '',
  }

  return [
    model,
    Cmd.batch<Msg>([
      attemptTE(
        getArticle(shared.token, slug),
        (result): Msg => ({ _tag: 'GetArticleResponse', result }),
      ),
      attemptTE(
        getComments(shared.token, slug),
        (result): Msg => ({ _tag: 'GetCommentsResponse', result }),
      ),
    ]),
  ]
}

export const update =
  (shared: Shared) =>
  (msg: Msg, model: Model): [Model, Cmd<Msg>] => {
    switch (msg._tag) {
      case 'GetArticleResponse':
        if (msg.result.tag === 'Ok') {
          return [
            { ...model, article: RD.success(msg.result.value) },
            Cmd.none(),
          ]
        } else {
          return [{ ...model, article: RD.failure(msg.result.err) }, Cmd.none()]
        }
      case 'GetCommentsResponse':
        if (msg.result.tag === 'Ok') {
          return [
            { ...model, comments: RD.success(msg.result.value) },
            Cmd.none(),
          ]
        } else {
          return [
            { ...model, comments: RD.failure(msg.result.err) },
            Cmd.none(),
          ]
        }
      case 'FavoriteArticle':
        if (shared.token._tag === 'Some') {
          return [
            model,
            attemptTE(
              favoriteArticle(shared.token.value, model.slug),
              (result): Msg => ({ _tag: 'FavoriteArticleResponse', result }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'UnfavoriteArticle':
        if (shared.token._tag === 'Some') {
          return [
            model,
            attemptTE(
              unfavoriteArticle(shared.token.value, model.slug),
              (result): Msg => ({ _tag: 'FavoriteArticleResponse', result }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'FavoriteArticleResponse':
        if (msg.result.tag === 'Ok') {
          return [
            { ...model, article: RD.success(msg.result.value) },
            Cmd.none(),
          ]
        }
        return [model, Cmd.none()]
      case 'FollowAuthor':
        if (shared.token._tag === 'Some') {
          return [
            model,
            attemptTE(
              followUser(shared.token.value, msg.username),
              (result): Msg => ({ _tag: 'FollowAuthorResponse', result }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'UnfollowAuthor':
        if (shared.token._tag === 'Some') {
          return [
            model,
            attemptTE(
              unfollowUser(shared.token.value, msg.username),
              (result): Msg => ({ _tag: 'UnfollowAuthorResponse', result }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'FollowAuthorResponse':
      case 'UnfollowAuthorResponse':
        if (msg.result.tag === 'Ok' && model.article._tag === 'RemoteSuccess') {
          return [
            {
              ...model,
              article: RD.success({
                article: {
                  ...model.article.value.article,
                  author: msg.result.value.profile,
                },
              }),
            },
            Cmd.none(),
          ]
        }
        return [model, Cmd.none()]
      case 'DeleteArticle':
        if (shared.token._tag === 'Some') {
          return [
            model,
            attemptTE(
              deleteArticle(shared.token.value, model.slug),
              (result): Msg => ({ _tag: 'DeleteArticleResponse', result }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'DeleteArticleResponse':
        return [model, Cmd.none()]
      case 'SetCommentInput':
        return [{ ...model, commentInput: msg.value }, Cmd.none()]
      case 'SubmitComment':
        if (shared.token._tag === 'Some' && model.commentInput.trim() !== '') {
          return [
            { ...model, commentInput: '' },
            attemptTE(
              createComment(shared.token.value, model.slug, model.commentInput),
              (result): Msg => ({ _tag: 'SubmitCommentResponse', result }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'SubmitCommentResponse':
        if (msg.result.tag === 'Ok') {
          if (model.comments._tag === 'RemoteSuccess') {
            return [
              {
                ...model,
                comments: RD.success({
                  comments: [
                    msg.result.value.comment,
                    ...model.comments.value.comments,
                  ],
                }),
              },
              Cmd.none(),
            ]
          }
        }
        return [model, Cmd.none()]
      case 'DeleteComment':
        if (shared.token._tag === 'Some') {
          return [
            model,
            attemptTE(
              deleteComment(shared.token.value, model.slug, msg.id),
              (result): Msg => ({
                _tag: 'DeleteCommentResponse',
                id: msg.id,
                result,
              }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'DeleteCommentResponse':
        if (
          msg.result.tag === 'Ok' &&
          model.comments._tag === 'RemoteSuccess'
        ) {
          return [
            {
              ...model,
              comments: RD.success({
                comments: model.comments.value.comments.filter(
                  (c) => c.id !== msg.id,
                ),
              }),
            },
            Cmd.none(),
          ]
        }
        return [model, Cmd.none()]
    }
  }
