# End-to-End Testing

The project includes a standalone E2E test suite based on Playwright. These tests are generic and can be run against any RealWorld implementation.

## Running tests locally

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

> [!TIP]
> The directory contains an `.envrc` file. If you use [direnv](https://direnv.net/), the `BASE_URL` and `JWT_SECRET` will be loaded automatically, and you can just run `npm run test:e2e`.


To run tests in interactive mode:
```bash
BASE_URL=http://localhost:5173 npm run test:e2e:ui
```
