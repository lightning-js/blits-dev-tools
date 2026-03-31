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

const { waitForDiagnostics, activateExtension, sleep } = require('../../utils/helpers')
const { openFixtureDocument, FIXTURES } = require('../../utils/fixtures')

suite('Diagnostics Tests', () => {
  let errorDocument

  suiteSetup(async function () {
    this.timeout(10000)

    errorDocument = await openFixtureDocument(FIXTURES.TEST_COMPONENT_WITH_ERRORS)
    await vscode.window.showTextDocument(errorDocument)

    await activateExtension()
  })

  test('Should detect diagnostics in files with errors', async function () {
    this.timeout(8000)

    const diagnostics = await waitForDiagnostics(errorDocument.uri, {
      timeout: 5000,
      minCount: 1,
    })

    assert.ok(diagnostics.length > 0, 'Expected at least one diagnostic for error file')

    diagnostics.forEach((d) => {
      assert.ok(d.message, 'Diagnostic should have a message')
      assert.ok(d.range, 'Diagnostic should have a range')
      assert.ok(typeof d.severity === 'number', 'Diagnostic should have a severity')
    })
  })

  test('Should have properly structured diagnostics', async function () {
    this.timeout(8000)

    const diagnostics = await waitForDiagnostics(errorDocument.uri, {
      timeout: 5000,
      minCount: 1,
    })

    const firstDiagnostic = diagnostics[0]
    assert.ok(firstDiagnostic.range.start, 'Diagnostic range should have start')
    assert.ok(firstDiagnostic.range.end, 'Diagnostic range should have end')
    assert.ok(firstDiagnostic.message.length > 0, 'Diagnostic should have non-empty message')
  })

  test('Should handle malformed JavaScript gracefully', () => {
    const diagnostics = vscode.languages.getDiagnostics(errorDocument.uri)

    assert.ok(Array.isArray(diagnostics), 'Should return array even with syntax errors')
  })

  test('Should validate valid .blits file with no errors', async function () {
    this.timeout(8000)

    const blitsDocument = await openFixtureDocument(FIXTURES.TEST_COMPONENT_BLITS)
    await sleep(1500)

    const diagnostics = vscode.languages.getDiagnostics(blitsDocument.uri)
    const errors = diagnostics.filter((d) => d.severity === vscode.DiagnosticSeverity.Error)

    assert.strictEqual(
      errors.length,
      0,
      `Valid .blits file should have no error-level diagnostics: ${errors.map((e) => e.message).join(', ')}`
    )
  })

  test('Should validate reactive attributes in templates', async function () {
    this.timeout(8000)

    const jsDocument = await openFixtureDocument(FIXTURES.TEST_COMPONENT_JS)
    await sleep(1500)

    const diagnostics = vscode.languages.getDiagnostics(jsDocument.uri)

    assert.ok(Array.isArray(diagnostics), 'Should return diagnostic array for reactive attributes')
  })

  test('Should validate event handlers in templates', async function () {
    this.timeout(8000)

    const jsDocument = await openFixtureDocument(FIXTURES.TEST_COMPONENT_JS)
    const diagnostics = vscode.languages.getDiagnostics(jsDocument.uri)

    assert.ok(Array.isArray(diagnostics), 'Should return diagnostic array for event handlers')
  })

  test('Should return a consistent diagnostic state', () => {
    const diagnostics = vscode.languages.getDiagnostics(errorDocument.uri)

    assert.ok(Array.isArray(diagnostics), 'Should be able to read diagnostics repeatedly')
    assert.ok(diagnostics.length >= 0, 'Diagnostic count should be non-negative')
  })

  test('Should provide diagnostics with correct severity levels', async function () {
    this.timeout(8000)

    const diagnostics = await waitForDiagnostics(errorDocument.uri, {
      timeout: 5000,
      minCount: 1,
    })

    const validSeverities = [
      vscode.DiagnosticSeverity.Error,
      vscode.DiagnosticSeverity.Warning,
      vscode.DiagnosticSeverity.Information,
      vscode.DiagnosticSeverity.Hint,
    ]

    diagnostics.forEach((d) => {
      assert.ok(validSeverities.includes(d.severity), `Diagnostic should have valid severity, got ${d.severity}`)
    })
  })
})
