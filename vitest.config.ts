import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: [
      'test/**/*.test.ts'
    ],
    exclude: [
      'test/fixtures/**/*'
    ],
    deps: {
      external: [
        '**/node_modules/**',
        '**/dist/**',
        'test/fixtures/**/*'
      ]
    }
  }
})
