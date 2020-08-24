# rollup-plugin-static-import

Rollup plugin for copying imported files without modifying. It's basically a
copy plugin with the added functionality of marking imported assets as external.

This is mostly useful when you want to let bundler of application using your
library handle some files. SVG icons and SCSS files can be a good example for
this.

Also, this mostly makes sense using together with `preserveModules` option of
rollup. If not, all your imports will end up in one file and it will not be
tree-shakable by the application bundler (Not 100% sure on this, haven't tested
extensively). In that case, you might as well use something like
`rollup-plugin-scss` where all your scss is compiled into one file.

## Usage

```js
// rollup.config.js
import staticImport from 'rollup-plugin-static-import'
// ...
  preserveModules: true,
  plugins: [
    //...
    staticImport({ include: ['src/**/*.scss', 'src/**/*.svg']})
  ]
// ...
```

With this configuration, this plugin will
* Mark scss and svg imports as external, therefore those imports will stay in
output bundle as it is.
* Copy all scss and svg files matching globs in `include` param.
* It will also watch these files and copy them on change if rollup is started
in watch mode.

With this output, you can let the application bundler handle scss and svg files.

## Parameters

### `projectRoot` (default: `process.cwd()`)
This will be used to create absolute paths out of `include`, `exclude` and
`baseDir` parameters. Mostly, `rollup` is run in project root folder, so default
value of `process.cwd()` works fine and you do not have to think about this at
all. But for some reason, if you are running `rollup` command from a different
folder than project root, you should set this to an absolute path pointing to
root folder of project (where `package.json` is located). If you use absolute
paths for all other parameters, this parameter will not have any effect.

### `include`* and `exclude` (default: `[]`)
`include` and `exclude` are parameters that are used in almost every rollup
plugin and functions in the same way. For this plugin, `include` is a required
parameter.

### `baseDir` (default: `'src'`)
Base directory that will be used to determine path of copied files. For example
`src/styles/main.scss` with `baseDir: 'src'` will be copied to
`<outputDir>/styles/main.scss`.
