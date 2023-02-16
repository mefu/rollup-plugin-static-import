import * as url from 'node:url'
import * as path from 'node:path'

import { test, expect } from 'vitest'

import { rollup } from 'rollup'
import staticImport from '..'

const testDir = url.fileURLToPath(new URL('.', import.meta.url));
const fixtureDir = path.join(testDir, 'fixtures')

test('staticImport outputs files correctly', async () => {
  const bundle = await rollup({
    input: path.join(fixtureDir, 'index.js'),
    plugins: [
      staticImport({
        include: ['**/*.jpg'],
        projectRoot: fixtureDir,
        baseDir: fixtureDir
      })
    ]
  })

  const { output } = await bundle.generate({ format: 'es' });

  expect(output.map(o => o.fileName)).toStrictEqual([
    'index.js',
    'module-dir-a/sample.jpg',
    'sample.jpg',
    'sub-dir/sample.jpg',
    'sub-dir/sub-sub-dir/sample.jpg'
  ])
})
