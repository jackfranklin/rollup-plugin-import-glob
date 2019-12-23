const rollup = require('rollup')
const path = require('path')
const Module = require('module')
const importGlobPlugin = require('../src/rollup-plugin-import-glob')

function requireFromString(code) {
  const opts = {}
  const filename = 'test_require_from_string.js'

  opts.appendPaths = opts.appendPaths || []
  opts.prependPaths = opts.prependPaths || []

  if (typeof code !== 'string') {
    throw new Error('code must be a string, not ' + typeof code)
  }

  var paths = Module._nodeModulePaths(path.dirname(filename))

  var parent = module.parent
  var m = new Module(filename, parent)
  m.filename = filename
  m._compile(code, filename)

  var exports = m.exports
  parent &&
    parent.children &&
    parent.children.splice(parent.children.indexOf(m), 1)

  return exports
}

process.chdir(__dirname)

const bundleFileAndGetCode = async rollupConfig => {
  const bundle = await rollup.rollup(rollupConfig)

  const { output } = await bundle.generate({ format: 'cjs' })

  const [{ code }] = output
  return code
}

it('ends up importing both a.js and b.js', async () => {
  const code = await bundleFileAndGetCode({
    input: 'fixtures/app.js',
    plugins: [importGlobPlugin()],
  })

  expect(code).toMatchSnapshot()

  const module = requireFromString(code)

  expect(module).toEqual({
    file0: { default: 1, a2: 3 },
    file1: { default: 2 },
  })
})
