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
2.  Go to the `frontend` directory:
    ```bash
    cd frontend
    ```
3.  Install dependencies:
    ```bash
    npm install
    ```
4.  Ensure you have a local [RealWorld backend](https://github.com/gothinkster/realworld) running (usually on `http://localhost:3000/api`).
5.  Run the development server:
    ```bash
    npm run dev
    ```

## How to start using official API server

To run the application using the official RealWorld API server:

```bash
cd frontend
npm run dev -- --mode production
```

This will use the base URL: `https://api.realworld.show/api`.

## Available Scripts

> [!NOTE]
> All scripts should be run from the `frontend/` directory.

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Start the development server         |
| `npm run build`     | Build the application for production |
| `npm run preview`   | Preview the production build locally |
| `npm run lint`      | Lint the codebase                    |
| `npm run typecheck` | Run TypeScript type checking         |
| `npm run check:watch` | Run Type checking in watch mode |

## End-to-End Testing

The project includes a standalone E2E test suite based on Playwright, located in the `e2e/` directory. These tests are generic and can be run against any RealWorld implementation.

### Running tests locally

1.  Navigate to the `e2e` directory:
    ```bash
    cd e2e
    ```
2.  Install dependencies (first time only):
    ```bash
    npm install
    ```
3.  Install Playwright browsers:
    ```bash
    npx playwright install chromium
    ```
4.  Run tests against your local frontend:
    ```bash
    BASE_URL=http://localhost:5173 npm run test:e2e
    ```

To run tests in interactive mode:
```bash
BASE_URL=http://localhost:5173 npm run test:e2e:ui
```

### Configuration

You can configure the target environment using the following environment variables:
- `BASE_URL`: The URL of the frontend application to test (default: `http://localhost:5173`).
- `API_BASE`: The API endpoint to use for setup and direct API tests (default: `https://api.realworld.show/api`).

The application implements the [RealWorld API spec](https://github.com/realworld-apps/realworld/tree/main/specs/api).

## Contributing

Contributions are welcome. Please open an issue or submit a pull request.

## License

MIT
