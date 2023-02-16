import fs from 'node:fs'
import path from 'node:path'

import glob from 'glob'

import { Plugin, PluginImpl } from 'rollup'
import { createFilter } from '@rollup/pluginutils'

import { RollupStaticImportPluginOptions } from '../types'

const makePathAbsolute = (p: string, rootPath: string): string => {
  if (path.isAbsolute(p)) {
    return p
  }
  return path.join(rootPath, p)
}

const staticImport: PluginImpl<RollupStaticImportPluginOptions> = options => {
  const pluginOptions = Object.assign({}, {
      include: [],
      exclude: [],
      projectRoot: process.cwd(),
      baseDir: 'src'
    }, options as RollupStaticImportPluginOptions);

  const projectRoot = pluginOptions.projectRoot;
  const absoluteIncludes = pluginOptions.include.map(p => makePathAbsolute(p, projectRoot))
  const absoluteExcludes = pluginOptions.exclude.map(p => makePathAbsolute(p, projectRoot))

  const filter = createFilter(absoluteIncludes, absoluteExcludes, { resolve: false });
  const baseDir = makePathAbsolute(pluginOptions.baseDir, projectRoot)

  const self: Plugin = {
    name: 'static-import',
    resolveId: (source, importer) => {
      const id = makePathAbsolute(path.join(path.dirname(importer || './'), source), projectRoot)
      if (!filter(id)) {
        return
      }
      // mark import external if it matches filters
      return { id: source, external: true }
    },
    buildStart() {
      // emit matching files and add them to watch list at the start of build
      absoluteIncludes.flatMap(inc => glob.sync(inc)).forEach(id => {
        this.emitFile({
          type: 'asset',
          source: fs.readFileSync(id),
          fileName: path.relative(baseDir, id)
        })
        this.addWatchFile(id)
      })
    },
    watchChange(id) {
      if (!filter(id)) {
        return
      }
      // emit file if changed file matches filters
      this.emitFile({
        type: 'asset',
        source: fs.readFileSync(id),
        fileName: path.relative(baseDir, id)
      })
    }
  }

  return self
}

export default staticImport;
