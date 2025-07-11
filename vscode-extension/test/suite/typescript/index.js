/*
 * Copyright 2023 Comcast Cable Communications Management, LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

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

  // Run TypeScript-specific integration tests
  return glob('**/{typescript-integration,advanced-features}.test.js', {
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
