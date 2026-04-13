import {
  end,
  format,
  lit,
  parse,
  Parser,
  Route,
  str,
  zero,
  Match,
  Formatter,
} from "@rinn7e/fp-ts-routing";
import * as O from "fp-ts/lib/Option";
import type { AppPage, AppRoute } from "./type";
import {
  homePage,
  loginPage,
  registerPage,
  settingsPage,
  editorPage,
  articlePage,
  profilePage,
  notFoundPage,
} from "./type";

// Parser
// ------------------------------------------------------------------

const homeMatch = end;
const loginMatch = lit("login").and(end);
const registerMatch = lit("register").and(end);
const settingsMatch = lit("settings").and(end);
const editorMatch: Match<{}> = lit("editor").and(end);
const editorSlugMatch: Match<{ slug: string }> = lit("editor")
  .and(str("slug"))
  .and(end);
const articleMatch: Match<{ slug: string }> = lit("article")
  .and(str("slug"))
  .and(end);
const profileMatch: Match<{ username: string }> = lit("profile")
  .and(str("username"))
  .and(end);
const profileFavoritesMatch: Match<{ username: string }> = lit("profile")
  .and(str("username"))
  .and(lit("favorites"))
  .and(end);

const anyStrings = new Match<{}>(
  new Parser((r) => O.some([{}, new Route([], r.query)])),
  new Formatter((r) => r),
);

const appRouter: Parser<AppPage> = zero<AppPage>()
  .alt(homeMatch.parser.map(() => homePage()))
  .alt(loginMatch.parser.map(() => loginPage()))
  .alt(registerMatch.parser.map(() => registerPage()))
  .alt(settingsMatch.parser.map(() => settingsPage()))
  .alt(editorMatch.parser.map(() => editorPage(O.none)))
  .alt(editorSlugMatch.parser.map(({ slug }) => editorPage(O.some(slug))))
  .alt(articleMatch.parser.map(({ slug }) => articlePage(slug)))
  .alt(profileMatch.parser.map(({ username }) => profilePage(username, false)))
  .alt(
    profileFavoritesMatch.parser.map(({ username }) =>
      profilePage(username, true),
    ),
  )
  .alt(anyStrings.parser.map(() => notFoundPage()));

export const parseAppRoute = (_mainUrl: string, href: string): AppRoute => {
  const page = parse(appRouter, Route.parse(href), homePage());
  return { page };
};

// Formatter
// ------------------------------------------------------------------

export const toUrlString = (r: AppRoute): string => {
  const page = r.page;
  switch (page._tag) {
    case "HomePage":
      return format(homeMatch.formatter, {});
    case "LoginPage":
      return format(loginMatch.formatter, {});
    case "RegisterPage":
      return format(registerMatch.formatter, {});
    case "SettingsPage":
      return format(settingsMatch.formatter, {});
    case "EditorPage":
      return O.isSome(page.slug)
        ? format(editorSlugMatch.formatter, { slug: page.slug.value })
        : format(editorMatch.formatter, {});
    case "ArticlePage":
      return format(articleMatch.formatter, { slug: page.slug });
    case "ProfilePage":
      return page.favorites
        ? format(profileFavoritesMatch.formatter, { username: page.username })
        : format(profileMatch.formatter, { username: page.username });
    case "NotFoundPage":
      return "/404";
  }
};
