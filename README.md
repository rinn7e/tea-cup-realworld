# 🍵 RealWorld example app in `react-tea-cup`

[![Deploy to GitHub Pages](https://github.com/rinn7e/tea-cup-realworld/actions/workflows/deploy.yml/badge.svg)](https://github.com/rinn7e/tea-cup-realworld/actions/workflows/deploy.yml)

### [Demo](https://rinn7e.github.io/tea-cup-realworld)&nbsp;&nbsp;&nbsp;&nbsp;[RealWorld](https://github.com/gothinkster/realworld)

A functional, type-safe implementation of the RealWorld Medium.com clone spec built using **react-tea-cup** following **The Elm Architecture (TEA)**.

## Tech Stack

- [**react 19.x**](https://github.com/facebook/react): UI Library
- [**react-tea-cup 5.x**](https://github.com/vankeisb/react-tea-cup): State Management (The Elm Architecture)
- [**typescript 5.x**](https://github.com/microsoft/TypeScript): Language
- [**fp-ts 2.x**](https://github.com/gcanti/fp-ts): Functional programming primitives
- [**io-ts 2.x**](https://github.com/gcanti/io-ts): Runtime validation / Decoding
- [**vite 7.x**](https://github.com/vitejs/vite): Build tool & Dev server
- [**tailwindcss 4.x**](https://github.com/tailwindlabs/tailwindcss): Styling

## How to start locally

To run the application with a local API server:

1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Ensure you have a local [RealWorld backend](https://github.com/gothinkster/realworld) running (usually on `http://localhost:3000/api`).
4.  Run the development server:
    ```bash
    npm run dev
    ```

## How to start using official API server

To run the application using the official RealWorld API server:

```bash
npm run dev -- --mode prod
```

This will use the base URL: `https://api.realworld.show/api`.

## Available Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the development server         |
| `npm run build`     | Build the application for production |
| `npm run preview`   | Preview the production build locally |
| `npm run lint`      | Lint the codebase                    |
| `npm run typecheck` | Run TypeScript type checking         |

## API spec

The application implements the [RealWorld API spec](https://realworld-docs.netlify.app/docs/specs/backend-specs/introduction).

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## License

MIT
