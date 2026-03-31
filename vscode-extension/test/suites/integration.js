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

// Files listed in the same order as the old flat directory (alphabetical by original filename).
// This order is load-bearing: diagnostics must run before virtual-files, and completion
// must run after diagnostics/event-attributes (same position as the old extension.test.js).
const TEST_FILES = [
  'integration/commands/comment.test.js',
  'integration/providers/diagnostics.test.js',
  'integration/providers/event-attributes.test.js',
  'integration/core/extension.test.js',
  'integration/core/language-support.test.js',
  'integration/providers/completion.test.js',
  'e2e/fixture-validation.test.js',
  'integration/providers/formatting.test.js',
  'integration/providers/hover.test.js',
  'integration/templates/detection.test.js',
  'integration/core/virtual-files.test.js',
  'unit/workspace-handler.test.js',
  'unit/template-handler.test.js',
]

function run() {
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
    timeout: 10000,
  })

  const testsRoot = path.resolve(__dirname, '..')

  TEST_FILES.forEach((f) => mocha.addFile(path.resolve(testsRoot, f)))

  return new Promise((c, e) => {
    mocha.run((failures) => {
      if (failures > 0) {
        e(new Error(`${failures} tests failed.`))
      } else {
        c()
      }
    })
  })
}

module.exports = { run }
