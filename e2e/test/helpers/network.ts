import { Page, Response } from '@playwright/test'

/**
 * Performs a UI action and waits for a specific network response.
 * Useful for actions that trigger asynchronous API calls (e.g. optimistic updates).
 */
export async function performActionAndWaitForResponse(
  page: Page,
  action: () => Promise<void>,
  urlPattern: string | RegExp,
  expectedStatus: number = 200,
): Promise<Response> {
  const [response] = await Promise.all([
    page.waitForResponse(
      (resp) =>
        resp.url().includes(urlPattern.toString()) &&
        resp.status() === expectedStatus,
    ),
    action(),
  ])
  return response
}
