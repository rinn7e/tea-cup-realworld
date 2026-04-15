import * as RD from '@devexperts/remote-data-ts'
import { attemptTE } from '@rinn7e/tea-cup-prelude'
import * as O from 'fp-ts/lib/Option'
import type { Option } from 'fp-ts/lib/Option'
import { Cmd } from 'tea-cup-fp'

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
  token: Option<string> = O.none,
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
        getArticle(slug),
        (result): Msg => ({ _tag: 'GetArticleResponse', result }),
      ),
      attemptTE(
        getComments(slug, O.toUndefined(token)),
        (result): Msg => ({ _tag: 'GetCommentsResponse', result }),
      ),
    ]),
  ]
}

export const update =
  (token: Option<string>) =>
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
        if (token._tag === 'Some') {
          return [
            model,
            attemptTE(
              favoriteArticle(model.slug, token.value),
              (result): Msg => ({ _tag: 'FavoriteArticleResponse', result }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'UnfavoriteArticle':
        if (token._tag === 'Some') {
          return [
            model,
            attemptTE(
              unfavoriteArticle(model.slug, token.value),
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
        if (token._tag === 'Some') {
          return [
            model,
            attemptTE(
              followUser(msg.username, token.value),
              (result): Msg => ({ _tag: 'FollowAuthorResponse', result }),
            ),
          ]
        }
        return [model, Cmd.none()]
      case 'UnfollowAuthor':
        if (token._tag === 'Some') {
          return [
            model,
            attemptTE(
              unfollowUser(msg.username, token.value),
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
        if (token._tag === 'Some') {
          return [
            model,
            attemptTE(
              deleteArticle(model.slug, token.value),
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
        if (token._tag === 'Some' && model.commentInput.trim() !== '') {
          return [
            { ...model, commentInput: '' },
            attemptTE(
              createComment(model.slug, model.commentInput, token.value),
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
        if (token._tag === 'Some') {
          return [
            model,
            attemptTE(
              deleteComment(model.slug, msg.id, token.value),
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
