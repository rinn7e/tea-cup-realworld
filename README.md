# 🍵 RealWorld example app in `react-tea-cup`

> A fully featured social blogging platform (Medium.com clone) built with **TeaCup (React + fp-ts)**, demonstrating functional programming patterns in React following The Elm Architecture (TEA).

This codebase was created to demonstrate a fully fledged application built with TeaCup that interacts with an actual backend server including CRUD operations, authentication, routing, pagination, and more.

For more information on how this works with other frontends/backends, head over to the [RealWorld repo](https://github.com/gothinkster/realworld).

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 19.x | UI Library |
| TeaCup | 5.x | State Management (The Elm Architecture) |
| TypeScript | 5.x | Language |
| fp-ts | 2.x | Functional programming primitives |
| io-ts | 2.x | Runtime validation / Decoding |
| Vite | 7.x | Build tool & Dev server |
| Tailwind CSS | 4.x | Styling |

---

## Features

The application implements the full [RealWorld frontend spec](https://realworld-docs.netlify.app/docs/specs/frontend-specs/templates), including:

- **Authentication** — JWT-based login and registration, persisted across sessions
- **Article Feed** — Global feed and personalised feed for authenticated users
- **Article CRUD** — Create, read, update, and delete articles with Markdown support
- **Comments** — Add and delete comments on articles
- **Tags** — Filter the global feed by tag
- **User Profiles** — View profiles and authored/favourited articles
- **Follow Users** — Follow/unfollow other authors
- **Favourite Articles** — Like and unlike articles
- **Settings** — Update user profile, avatar, bio, and password
- **Pagination** — Paginated article lists throughout

---

## Implementation Highlights

This project leverages functional programming and the Elm Architecture:

### The Elm Architecture (TEA)
The app follows the pattern of **Model**, **Update**, and **View**. State is managed in a single immutable Model, transformed by a pure `update` function, and rendered via React components.

### Pure Update Logic
Transitioning from one state to another is handled by a pure function. Side effects (commands) are decoupled from the update logic, making the application highly predictable and easy to test.

### Strong Typing with fp-ts
Uses `fp-ts` for handling optionality (`Option`), error handling (`Either`), and asynchronous operations (`TaskEither`), reducing the risk of runtime errors and null pointer exceptions.

### Runtime Validation with io-ts
All API responses are validated at the boundary using `io-ts` codecs, ensuring that the application logic always works with correctly typed and validated data.

### Functional Routing
Routing is implemented using `fp-ts-routing`, providing a type-safe way to define and navigate between application routes.

---

## Project Structure

```
src/
├── api/                # API client and io-ts codecs
├── component/          # Reusable UI components
├── data/               # Domain models and utility types
├── page/               # Page-specific views and sub-components
├── util/               # Helper functions and fp-ts utilities
├── component.tsx       # Root view component
├── main.tsx            # Application entry point & TeaCup initialization
├── type.ts             # Global Model and Msg type definitions
└── update.ts           # Main TEA update function
```

---

## Prerequisites

- **Node.js** 18.x or later (LTS recommended)
- **npm** 9.x or later

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

The application will be available at **[http://localhost:5173](http://localhost:5173)**.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Lint the codebase |
| `npm run typecheck` | Run TypeScript type checking |

---

## API

The application targets the public RealWorld API.

Any backend that implements the [RealWorld API spec](https://realworld-docs.netlify.app/docs/specs/backend-specs/introduction) is compatible.

---

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

---

## License

MIT
