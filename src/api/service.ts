import * as TE from 'fp-ts/lib/TaskEither';
import type {
  ArticleResponse,
  ArticlesResponse,
  CommentsResponse,
  ProfileResponse,
  TagsResponse,
  UserResponse,
} from './type';

const API_BASE = 'http://localhost:3000/api';

export const getArticles = (params: { tag?: string, author?: string, favorited?: string, offset?: number, limit?: number } = {}): TE.TaskEither<Error, ArticlesResponse> => {
  const query = new URLSearchParams();
  if (params.tag) query.set('tag', params.tag);
  if (params.author) query.set('author', params.author);
  if (params.favorited) query.set('favorited', params.favorited);
  if (params.offset) query.set('offset', String(params.offset));
  if (params.limit) query.set('limit', String(params.limit));

  const queryString = query.toString();
  return TE.tryCatch(
    () => fetch(`${API_BASE}/articles${queryString ? '?' + queryString : ''}`).then(res => res.json()),
    reason => new Error(String(reason))
  );
};

export const getArticle = (slug: string): TE.TaskEither<Error, ArticleResponse> => {
  return TE.tryCatch(
    () => fetch(`${API_BASE}/articles/${slug}`).then(res => res.json()),
    reason => new Error(String(reason))
  );
};

export const getComments = (slug: string): TE.TaskEither<Error, CommentsResponse> => {
  return TE.tryCatch(
    () => fetch(`${API_BASE}/articles/${slug}/comments`).then(res => res.json()),
    reason => new Error(String(reason))
  );
};

export const login = (user: any): TE.TaskEither<Error, UserResponse> => {
  return TE.tryCatch(
    () => fetch(`${API_BASE}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user })
    }).then(res => res.json()),
    reason => new Error(String(reason))
  );
};

export const register = (user: any): TE.TaskEither<Error, UserResponse> => {
  return TE.tryCatch(
    () => fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user })
    }).then(res => res.json()),
    reason => new Error(String(reason))
  );
};

export const updateUser = (user: any, token: string): TE.TaskEither<Error, UserResponse> => {
  return TE.tryCatch(
    () => fetch(`${API_BASE}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ user })
    }).then(res => res.json()),
    reason => new Error(String(reason))
  );
};

export const getProfile = (username: string, token?: string): TE.TaskEither<Error, ProfileResponse> => {
  return TE.tryCatch(
    () => fetch(`${API_BASE}/profiles/${username}`, {
      headers: token ? { 'Authorization': `Token ${token}` } : {}
    }).then(res => res.json()),
    reason => new Error(String(reason))
  );
};

export const createArticle = (article: any, token: string): TE.TaskEither<Error, ArticleResponse> => {
  return TE.tryCatch(
    () => fetch(`${API_BASE}/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ article })
    }).then(res => res.json()),
    reason => new Error(String(reason))
  );
};

export const updateArticle = (slug: string, article: any, token: string): TE.TaskEither<Error, ArticleResponse> => {
  return TE.tryCatch(
    () => fetch(`${API_BASE}/articles/${slug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${token}`
      },
      body: JSON.stringify({ article })
    }).then(res => res.json()),
    reason => new Error(String(reason))
  );
};

export const followUser = (username: string, token: string): TE.TaskEither<Error, ProfileResponse> => {
  return TE.tryCatch(
    () => fetch(`${API_BASE}/profiles/${username}/follow`, {
      method: 'POST',
      headers: { 'Authorization': `Token ${token}` }
    }).then(res => res.json()),
    reason => new Error(String(reason))
  );
};

export const unfollowUser = (username: string, token: string): TE.TaskEither<Error, ProfileResponse> => {
  return TE.tryCatch(
    () => fetch(`${API_BASE}/profiles/${username}/follow`, {
      method: 'DELETE',
      headers: { 'Authorization': `Token ${token}` }
    }).then(res => res.json()),
    reason => new Error(String(reason))
  );
};

export const favoriteArticle = (slug: string, token: string): TE.TaskEither<Error, ArticleResponse> => {
  return TE.tryCatch(
    () => fetch(`${API_BASE}/articles/${slug}/favorite`, {
      method: 'POST',
      headers: { 'Authorization': `Token ${token}` }
    }).then(res => res.json()),
    reason => new Error(String(reason))
  );
};

export const unfavoriteArticle = (slug: string, token: string): TE.TaskEither<Error, ArticleResponse> => {
  return TE.tryCatch(
    () => fetch(`${API_BASE}/articles/${slug}/favorite`, {
      method: 'DELETE',
      headers: { 'Authorization': `Token ${token}` }
    }).then(res => res.json()),
    reason => new Error(String(reason))
  );
};

export const getTags = (): TE.TaskEither<Error, TagsResponse> => {
  return TE.tryCatch(
    () => fetch(`${API_BASE}/tags`).then(res => res.json()),
    reason => new Error(String(reason))
  );
};
