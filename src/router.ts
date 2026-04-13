import type { Route } from './type';
import * as O from 'fp-ts/lib/Option';

export const parseRoute = (location: Location): Route => {
  const path = location.pathname;

  // We'll use hash routing for simplicity if needed, or normal path
  // RealWorld usually uses path routing. 
  // Let's assume path routing.

  const parts = path.split('/').filter(Boolean);

  if (parts.length === 0) {
    return { _tag: 'Home' };
  }

  if (parts[0] === 'login') {
    return { _tag: 'Login' };
  }

  if (parts[0] === 'register') {
    return { _tag: 'Register' };
  }

  if (parts[0] === 'settings') {
    return { _tag: 'Settings' };
  }

  if (parts[0] === 'editor') {
    const slug = parts[1];
    return { _tag: 'Editor', slug: slug ? O.some(slug) : O.none };
  }

  if (parts[0] === 'article') {
    const slug = parts[1];
    if (slug) {
      return { _tag: 'Article', slug };
    }
  }

  if (parts[0] === 'profile') {
    const username = parts[1];
    if (username) {
      const favorites = parts[2] === 'favorites';
      return { _tag: 'Profile', username, favorites };
    }
  }

  return { _tag: 'NotFound' };
};

export const routeToPath = (route: Route): string => {
  switch (route._tag) {
    case 'Home':
      return '/';
    case 'Login':
      return '/login';
    case 'Register':
      return '/register';
    case 'Settings':
      return '/settings';
    case 'Editor':
      return route.slug._tag === 'Some' ? `/editor/${route.slug.value}` : '/editor';
    case 'Article':
      return `/article/${route.slug}`;
    case 'Profile':
      return route.favorites ? `/profile/${route.username}/favorites` : `/profile/${route.username}`;
    case 'NotFound':
      return '/not-found';
  }
};
