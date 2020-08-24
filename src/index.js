import fs from 'fs';
import path from 'path';
import glob from 'glob';
import { createFilter } from '@rollup/pluginutils';

const makePathAbsolute = (p, rootPath) => {
  if (path.isAbsolute(p)) {
    return p;
  }

  return path.join(rootPath, p);
};

export default (opts = {}) => {
  if (!opts.include) {
    throw new Error('include option should be specified');
  }

  const projectRoot = opts.projectRoot || process.cwd();
  const absoluteIncludes = opts.include.map(p => makePathAbsolute(p, projectRoot));
  const absoluteExcludes = (opts.exclude || []).map(p => makePathAbsolute(p, projectRoot));

  const filter = createFilter(absoluteIncludes, absoluteExcludes, { resolve: false });
  const baseDir = makePathAbsolute(opts.baseDir || 'src', projectRoot);

  return {
    name: 'static-import',
    resolveId(source, importer) {
      const id = makePathAbsolute(path.join(path.dirname(importer || './'), source), projectRoot);
      if (!filter(id)) {
        return;
      }
      return { id: source, external: true };
    },
    buildStart() {
      absoluteIncludes.flatMap(inc => glob.sync(inc)).forEach(id => {
        this.emitFile({
          type: 'asset',
          source: fs.readFileSync(id),
          fileName: path.relative(baseDir, id)
        });
        this.addWatchFile(id);
      });
    },
    watchChange(id) {
      if (!filter(id)) {
        return;
      }
      this.emitFile({
        type: 'asset',
        source: fs.readFileSync(id),
        fileName: path.relative(baseDir, id)
      });
    }
  };
};
