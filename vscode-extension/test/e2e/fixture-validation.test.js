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

const assert = require('assert')
const vscode = require('vscode')

const { sleep } = require('../utils/helpers')
const { openFixtureDocument, FIXTURES } = require('../utils/fixtures')

suite('Fixture File Validation Tests', () => {
  test('Should validate JavaScript fixture files have expected errors only', async () => {
    const mainDocument = await openFixtureDocument(FIXTURES.JS_PROJECT.MAIN)
    await sleep(2000)

    const diagnostics = vscode.languages.getDiagnostics(mainDocument.uri)

    const unexpectedErrors = diagnostics.filter(
      (d) =>
        d.severity === vscode.DiagnosticSeverity.Error &&
        !d.message.includes('Cannot find module') &&
        !d.message.includes('Cannot resolve module')
    )

    assert.strictEqual(
      unexpectedErrors.length,
      0,
      `JavaScript fixture should not have unexpected errors: ${unexpectedErrors.map((e) => e.message).join(', ')}`
    )
  })

  test('Should validate TypeScript fixture files have expected errors only', async () => {
    const mainDocument = await openFixtureDocument(FIXTURES.TS_PROJECT.MAIN)
    await sleep(2000)

    const diagnostics = vscode.languages.getDiagnostics(mainDocument.uri)

    const unexpectedErrors = diagnostics.filter(
      (d) =>
        d.severity === vscode.DiagnosticSeverity.Error &&
        !d.message.includes('Cannot find module') &&
        !d.message.includes('Cannot resolve module')
    )

    assert.strictEqual(
      unexpectedErrors.length,
      0,
      `TypeScript fixture should not have unexpected errors: ${unexpectedErrors.map((e) => e.message).join(', ')}`
    )
  })

  test('Should validate .blits files have expected language service support', async () => {
    const blitsDocument = await openFixtureDocument(FIXTURES.TS_PROJECT.BUTTON)
    await sleep(3000)

    const diagnostics = vscode.languages.getDiagnostics(blitsDocument.uri)

    const majorErrors = diagnostics.filter(
      (d) =>
        d.severity === vscode.DiagnosticSeverity.Error &&
        !d.message.includes('Cannot find module') &&
        !d.message.includes('Cannot resolve module') &&
        d.message.includes('script')
    )

    assert.strictEqual(
      majorErrors.length,
      0,
      `.blits file should not have major language service errors: ${majorErrors.map((e) => e.message).join(', ')}`
    )
  })
})
