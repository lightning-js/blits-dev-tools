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
const path = require('path')

suite('Fixture File Validation Tests', () => {
  test('Should validate JavaScript fixture files have expected errors only', async () => {
    const jsProjectPath = path.join(__dirname, 'fixtures', 'javascript-project')

    // Open the main.js file that imports non-existent @lightningjs/blits
    const mainUri = vscode.Uri.file(path.join(jsProjectPath, 'src', 'main.js'))
    await vscode.workspace.openTextDocument(mainUri)

    // Wait for diagnostics to be processed
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const diagnostics = vscode.languages.getDiagnostics(mainUri)

    // Note: Import errors may not always appear in test context
    // The main purpose is to check for unexpected errors below

    // Should NOT have syntax errors or other unexpected errors
    const unexpectedErrors = diagnostics.filter(
      (d) =>
        d.severity === vscode.DiagnosticSeverity.Error &&
        !d.message.includes('Cannot find module') &&
        !d.message.includes('Cannot resolve module')
    )

    if (unexpectedErrors.length > 0) {
      console.log(
        'Unexpected errors in JavaScript fixture:',
        unexpectedErrors.map((e) => e.message)
      )
    }

    assert.strictEqual(
      unexpectedErrors.length,
      0,
      `JavaScript fixture should not have unexpected errors: ${unexpectedErrors.map((e) => e.message).join(', ')}`
    )
  })

  test('Should validate TypeScript fixture files have expected errors only', async () => {
    const tsProjectPath = path.join(__dirname, 'fixtures', 'typescript-project')

    // Open the main.ts file
    const mainUri = vscode.Uri.file(path.join(tsProjectPath, 'src', 'main.ts'))
    await vscode.workspace.openTextDocument(mainUri)

    // Wait for diagnostics to be processed
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const diagnostics = vscode.languages.getDiagnostics(mainUri)

    // Note: Import errors may not always appear in test context
    // The main purpose is to check for unexpected errors below

    // Should NOT have TypeScript syntax errors or other unexpected errors
    const unexpectedErrors = diagnostics.filter(
      (d) =>
        d.severity === vscode.DiagnosticSeverity.Error &&
        !d.message.includes('Cannot find module') &&
        !d.message.includes('Cannot resolve module')
    )

    if (unexpectedErrors.length > 0) {
      console.log(
        'Unexpected errors in TypeScript fixture:',
        unexpectedErrors.map((e) => e.message)
      )
    }

    assert.strictEqual(
      unexpectedErrors.length,
      0,
      `TypeScript fixture should not have unexpected errors: ${unexpectedErrors.map((e) => e.message).join(', ')}`
    )
  })

  test('Should validate .blits files have expected language service support', async () => {
    const tsProjectPath = path.join(__dirname, 'fixtures', 'typescript-project')

    // Open a .blits file
    const blitsUri = vscode.Uri.file(path.join(tsProjectPath, 'src', 'components', 'Button.blits'))
    await vscode.workspace.openTextDocument(blitsUri)

    // Wait for language services to initialize
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const diagnostics = vscode.languages.getDiagnostics(blitsUri)

    // Should NOT have major TypeScript/JavaScript errors in script section
    const majorErrors = diagnostics.filter(
      (d) =>
        d.severity === vscode.DiagnosticSeverity.Error &&
        !d.message.includes('Cannot find module') && // Import resolution errors are expected
        !d.message.includes('Cannot resolve module') &&
        d.message.includes('script') // Only check script section errors
    )

    if (majorErrors.length > 0) {
      console.log(
        'Major errors in .blits file:',
        majorErrors.map((e) => e.message)
      )
    }

    assert.strictEqual(
      majorErrors.length,
      0,
      `.blits file should not have major language service errors: ${majorErrors.map((e) => e.message).join(', ')}`
    )
  })
})
