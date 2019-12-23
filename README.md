# rollup-plugin-import-glob

[![CircleCI](https://circleci.com/gh/jackfranklin/rollup-plugin-import-glob.svg?style=svg)](https://circleci.com/gh/jackfranklin/rollup-plugin-import-glob)

A Rollup plugin to import a glob of files. When a matching import is found a new JS file is created that contains all the imports of any files matching the glob.

## Install

```
npm install --save-dev @jackfranklin/rollup-plugin-import-glob

yarn add --dev @jackfranklin/rollup-plugin-import-glob
```

## Example usage

The plugin looks for imports that start with `glob:` and are followed by a regex.

Each matched import is a named export in the form `fileX`, where `X` starts at 0:

```js
import * as posts from 'glob:./posts/*.js'

// posts will look like so:

{
  file0: {
    default: ...,
    // and any named exports
  },
  file1: {
    default: ...,
    // and any named exports
  },
  /// and so on for as many files as were found
}
```

## Rollup configuration

```js
import importGlob from '@jackfranklin/rollup-plugin-import-glob'

export default {
  input: 'your-app.js',
  plugins: [importGlob()],
}
```

There are currently no configuration options available for the plugin.
