const path = require('path')
const Mocha = require('mocha')
const { glob } = require('glob')

function run() {
  // Create the mocha test
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
    timeout: 15000, // Longer timeout for language service initialization
  })

  const testsRoot = path.resolve(__dirname, '../..')

  // Run JavaScript-specific integration tests
  return glob('**/javascript-integration.test.js', {
    cwd: testsRoot,
  })
    .then((files) => {
      // Add files to the test suite
      files.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)))

      return new Promise((c, e) => {
        // Run the mocha test
        mocha.run((failures) => {
          if (failures > 0) {
            e(new Error(`${failures} tests failed.`))
          } else {
            c()
          }
        })
      })
    })
    .catch((err) => {
      console.error(err)
      throw err
    })
}

module.exports = { run }
