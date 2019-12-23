const glob = require('glob')
const tmp = require('tmp')
const path = require('path')
const fs = require('fs')

const globImport = () => {
  const generatedCodes = new Map()

  return {
    name: 'plugin-glob-import',
    resolveId(importee, importer) {
      if (!importee.startsWith('glob:')) return

      // remove the glob: from the start of the import
      const pattern = importee.slice(5)
      const searchRoot = path.dirname(importer || process.cwd())

      const files = glob.sync(pattern, {
        cwd: searchRoot,
      })

      const generatedCodeImports = files.map((f, i) => {
        const resolvedPath = path.resolve(searchRoot, f)
        return `import * as file${i} from '${resolvedPath}'`
      })

      const exportCode = `export {${files
        .map((f, i) => `file${i}`)
        .join(', ')}}`

      const finalCode = generatedCodeImports.join('\n') + '\n' + exportCode

      const tmpFile = tmp.fileSync()

      fs.writeFileSync(tmpFile.name, finalCode, { encoding: 'utf8' })

      generatedCodes.set(tmpFile.name, finalCode)
      return tmpFile.name
    },

    load(id) {
      return generatedCodes.get(id) || null
    },
  }
}

module.exports = globImport
