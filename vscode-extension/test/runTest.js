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
const { runTests } = require('@vscode/test-electron')

async function runTestSuite(suiteName, workspacePath) {
  console.log(`\n🧪 Running ${suiteName} tests...`)
  try {
    // The folder containing the Extension Manifest package.json
    const extensionDevelopmentPath = path.resolve(__dirname, '../')

    // The path to test runner
    const extensionTestsPath = path.resolve(__dirname, './suites', suiteName)

    const launchArgs = ['--disable-extensions']
    if (workspacePath) {
      launchArgs.push(workspacePath)
    }

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs,
    })

    console.log(`✅ ${suiteName} tests completed successfully`)
  } catch (err) {
    console.error(`❌ ${suiteName} tests failed:`, err.message)
    throw err
  }
}

async function main() {
  try {
    // Run integration tests (unit + integration + fixture-validation)
    const fixturesPath = path.resolve(__dirname, 'fixtures')
    await runTestSuite('integration', fixturesPath)

    // Run TypeScript e2e project tests
    const tsProjectPath = path.resolve(__dirname, 'fixtures', 'typescript-project')
    await runTestSuite('e2e-typescript', tsProjectPath)

    // Run JavaScript e2e project tests
    const jsProjectPath = path.resolve(__dirname, 'fixtures', 'javascript-project')
    await runTestSuite('e2e-javascript', jsProjectPath)

    // Run JavaScript v2 e2e project tests
    const jsV2ProjectPath = path.resolve(__dirname, 'fixtures', 'javascript-project-v2')
    await runTestSuite('e2e-javascript-v2', jsV2ProjectPath)

    // Run TypeScript v2 e2e project tests
    const tsV2ProjectPath = path.resolve(__dirname, 'fixtures', 'typescript-project-v2')
    await runTestSuite('e2e-typescript-v2', tsV2ProjectPath)

    console.log('\n🎉 All test suites completed successfully!')
  } catch (err) {
    console.error('\n💥 Test suite failed')
    process.exit(1)
  }
}

main()
