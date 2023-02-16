import type { FilterPattern } from '@rollup/pluginutils'
import type { PluginImpl } from 'rollup'

export interface RollupStaticImportPluginOptions {
  /**
   * A picomatch pattern, or array of patterns, which specifies the files in the build the plugin
   * should operate on.
   */
  include: FilterPattern;
  /**
   * A picomatch pattern, or array of patterns, which specifies the files in the build the plugin
   * should _ignore_.
   * @default []
   */
  exclude?: FilterPattern;
  /**
   * Root path to create absolute paths out of include, exclude and baseDir parameters.
   * @default process.cwd()
   */
  projectRoot?: string;
  /**
   * Base directory that will be used to determine path of copied files.
   * For example src/styles/main.scss with baseDir: 'src'
   * will be copied to <outputDir>/styles/main.scss.
   * @default 'src'
   */
  baseDir?: string;
}

declare const staticImport: PluginImpl<RollupStaticImportPluginOptions>
export default staticImport;
