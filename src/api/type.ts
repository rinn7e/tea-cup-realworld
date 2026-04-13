export type User = {
  email: string;
  token: string;
  username: string;
  bio: string | null;
  image: string | null;
};

export type Profile = {
  username: string;
  bio: string | null;
  image: string | null;
  following: boolean;
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Profile;
};

export type Comment = {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: Profile;
};

export type ArticleResponse = {
  article: Article;
};

export type ArticlesResponse = {
  articles: Article[];
  articlesCount: number;
};

export type ProfileResponse = {
  profile: Profile;
};

export type UserResponse = {
  user: User;
};

export type TagsResponse = {
  tags: string[];
};

export type CommentResponse = {
  comment: Comment;
};

export type CommentsResponse = {
  comments: Comment[];
};

export type Errors = {
  errors: Record<string, string[]>;
};
