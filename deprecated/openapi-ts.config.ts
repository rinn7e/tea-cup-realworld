import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: './openapi.yml', // or a URL
  output: 'src/generated/api',
  // optional: choose plugins, client runtime, etc.
})
