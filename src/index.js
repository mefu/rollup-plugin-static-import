import fs from 'fs';
import path from 'path';
import glob from 'glob';
import { createFilter } from '@rollup/pluginutils';

export default (opts = {}) => {
  if (!opts.include) {
    throw new Error('include option should be specified');
  }

  const filter = createFilter(opts.include, opts.exclude, { resolve: false });
  const baseDir = opts.baseDir || 'src';

  return {
    name: 'static-import',
    resolveId(source, importer) {
      const id = path.join(path.dirname(importer || '/'), source);
      if (!filter(id)) {
        return;
      }
      return { id, external: true };
    },
    buildStart() {
      opts.include.flatMap(inc => glob.sync(inc)).forEach(id => {
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
