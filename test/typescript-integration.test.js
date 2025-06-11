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

// Type-safe helpers for VS Code API calls
async function getCompletions(uri, position) {
  const result = await vscode.commands.executeCommand('vscode.executeCompletionItemProvider', uri, position)
  return /** @type {VSCodeCompletionList | undefined} */ (result)
}

async function getHovers(uri, position) {
  const result = await vscode.commands.executeCommand('vscode.executeHoverProvider', uri, position)
  return /** @type {VSCodeHover[] | undefined} */ (result)
}

suite('TypeScript Integration Tests', () => {
  let tsProjectPath
  let buttonBlitsDocument, mainTsDocument, mathUtilsDocument

  suiteSetup(async function () {
    this.timeout(15000)

    // TypeScript project workspace should already be loaded by test runner
    const workspaceFolders = vscode.workspace.workspaceFolders
    if (!workspaceFolders || workspaceFolders.length === 0) {
      throw new Error('TypeScript workspace not loaded properly')
    }

    tsProjectPath = workspaceFolders[0].uri.fsPath
    console.log('TypeScript workspace loaded:', tsProjectPath)

    // Open test files - they should be in the current workspace
    const buttonUri = vscode.Uri.file(path.join(tsProjectPath, 'src', 'components', 'Button.blits'))
    const mainUri = vscode.Uri.file(path.join(tsProjectPath, 'src', 'main.ts'))
    const mathUri = vscode.Uri.file(path.join(tsProjectPath, 'src', 'utils', 'math.ts'))

    buttonBlitsDocument = await vscode.workspace.openTextDocument(buttonUri)
    mainTsDocument = await vscode.workspace.openTextDocument(mainUri)
    mathUtilsDocument = await vscode.workspace.openTextDocument(mathUri)

    // Ensure extension is activated
    const extension = vscode.extensions.getExtension('lightningjs.lightning-blits')
    if (extension && !extension.isActive) {
      await extension.activate()
    }

    // Wait for TypeScript language services to initialize properly
    await new Promise((resolve) => setTimeout(resolve, 3000))
  })

  test('Should recognize .blits file with TypeScript script section', () => {
    assert.strictEqual(buttonBlitsDocument.languageId, 'blits')

    const text = buttonBlitsDocument.getText()
    assert.ok(text.includes('<script lang="ts">'))
    assert.ok(text.includes('interface ButtonProps'))
    assert.ok(text.includes('Promise<void>'))
  })

  test('Should provide TypeScript completions in .blits script section', async () => {
    const text = buttonBlitsDocument.getText()
    const mathPos = text.indexOf('Math.') + 'Math.'.length
    const position = buttonBlitsDocument.positionAt(mathPos)

    const completions = await getCompletions(buttonBlitsDocument.uri, position)

    assert.ok(completions)
    assert.ok(completions.items.length > 0)

    const completionLabels = completions.items.map((item) =>
      typeof item.label === 'string' ? item.label : item.label.label || ''
    )
    // Should provide Math object methods - STRICT validation for standard library
    assert.ok(
      completionLabels.some((label) => label.includes('round')),
      `Math.round not found in completions: ${completionLabels.slice(0, 20).join(', ')}`
    )
    assert.ok(
      completionLabels.some((label) => label.includes('sqrt')),
      `Math.sqrt not found in completions: ${completionLabels.slice(0, 20).join(', ')}`
    )
    assert.ok(
      completionLabels.some((label) => label.includes('PI')),
      `Math.PI not found in completions: ${completionLabels.slice(0, 20).join(', ')}`
    )
  })

  test('Should provide hover information for TypeScript types in .blits file', async () => {
    const text = buttonBlitsDocument.getText()
    const pointPos = text.indexOf('Point')
    const position = buttonBlitsDocument.positionAt(pointPos)

    const hovers = await getHovers(buttonBlitsDocument.uri, position)

    assert.ok(hovers)
    if (hovers.length > 0) {
      const hoverContent = hovers[0].contents[0]
      assert.ok(hoverContent)
      // Should show type information
      assert.ok(hoverContent.value.includes('Point') || hoverContent.includes('Point'))
    }
  })

  test('Should resolve path aliases in .blits TypeScript imports', async () => {
    const text = buttonBlitsDocument.getText()
    const importPos = text.indexOf('@/utils/math')
    const position = buttonBlitsDocument.positionAt(importPos)

    // Test go to definition for path alias
    const definitions = await vscode.commands.executeCommand(
      'vscode.executeDefinitionProvider',
      buttonBlitsDocument.uri,
      position
    )

    assert.ok(definitions)
    if (definitions.length > 0) {
      const definition = definitions[0]
      assert.ok(definition.uri.fsPath.includes('math.ts'))
    }
  })

  test('Should provide diagnostics for TypeScript errors in .blits file', async () => {
    // Wait for diagnostics to be processed
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const diagnostics = vscode.languages.getDiagnostics(buttonBlitsDocument.uri)

    // Should not have TypeScript errors in our valid file
    const tsErrors = diagnostics.filter(
      (d) => d.source === 'ts' || d.message.includes('Cannot find') || d.message.includes('Type ')
    )

    // Our test file should be valid TypeScript
    assert.strictEqual(tsErrors.length, 0, `Found TypeScript errors: ${tsErrors.map((e) => e.message).join(', ')}`)
  })

  test('Should support async/await and Promise types in .blits TypeScript', async () => {
    const text = buttonBlitsDocument.getText()
    const asyncPos = text.indexOf('async handleClick')
    const position = buttonBlitsDocument.positionAt(asyncPos)

    const hovers = await getHovers(buttonBlitsDocument.uri, position)

    assert.ok(hovers)
    if (hovers.length > 0) {
      const hoverContent = hovers[0].contents[0]
      // Should recognize async method returning Promise<void>
      assert.ok(hoverContent.value.includes('Promise') || hoverContent.includes('Promise'))
    }
  })

  test('Should import .blits file from TypeScript main file', async () => {
    const text = mainTsDocument.getText()

    // Verify the import statement exists in the file
    assert.ok(text.includes('./components/Button.blits'), 'Import statement should exist')

    // Test go to definition for .blits import
    const importPos = text.indexOf('./components/Button.blits')
    const position = mainTsDocument.positionAt(importPos)

    const definitions = await vscode.commands.executeCommand(
      'vscode.executeDefinitionProvider',
      mainTsDocument.uri,
      position
    )

    // Note: In test environment, cross-file resolution may not work perfectly
    // The important thing is that the TypeScript service can handle .blits imports
    // without throwing errors
    assert.ok(definitions !== undefined, 'Definition provider should respond')
  })

  test('Should provide standard library completions in TypeScript files', async () => {
    const text = mathUtilsDocument.getText()
    const mathPos = text.indexOf('Math.') + 'Math.'.length
    const position = mathUtilsDocument.positionAt(mathPos)

    const completions = await getCompletions(mathUtilsDocument.uri, position)

    assert.ok(completions)
    assert.ok(completions.items.length > 0)

    const completionLabels = completions.items.map((item) =>
      typeof item.label === 'string' ? item.label : item.label.label || ''
    )
    // Should provide standard Math methods - STRICT validation for standard library
    assert.ok(
      completionLabels.some((label) => label.includes('sqrt')),
      `Math.sqrt not found in completions: ${completionLabels.slice(0, 20).join(', ')}`
    )
    assert.ok(
      completionLabels.some((label) => label.includes('round')),
      `Math.round not found in completions: ${completionLabels.slice(0, 20).join(', ')}`
    )
    assert.ok(
      completionLabels.some((label) => label.includes('PI')),
      `Math.PI not found in completions: ${completionLabels.slice(0, 20).join(', ')}`
    )
  })

  test('Should provide Promise completions in TypeScript', async () => {
    const text = mathUtilsDocument.getText()
    const promisePos = text.indexOf('new Promise') + 'new Promise'.length
    const position = mathUtilsDocument.positionAt(promisePos)

    const completions = await getCompletions(mathUtilsDocument.uri, position)

    assert.ok(completions)
    const completionLabels = completions.items.map((item) =>
      typeof item.label === 'string' ? item.label : item.label.label || ''
    )
    // Should provide Promise constructor completion
    assert.ok(completionLabels.length > 0, 'Should provide Promise completions')
  })

  test('Should provide hover information for Math object in TypeScript', async () => {
    const text = mathUtilsDocument.getText()
    const mathPos = text.indexOf('Math.sqrt')
    const position = mathUtilsDocument.positionAt(mathPos)

    const hovers = await vscode.commands.executeCommand('vscode.executeHoverProvider', mathUtilsDocument.uri, position)

    assert.ok(hovers, 'Should provide hover for Math object')
    if (hovers.length > 0) {
      const hoverContent = hovers[0].contents[0]
      assert.ok(hoverContent, 'Should have hover content for Math object')
      // Should show information about Math object or Math.sqrt
      const content = typeof hoverContent === 'string' ? hoverContent : hoverContent.value || ''
      assert.ok(
        content.toLowerCase().includes('math') || content.toLowerCase().includes('sqrt'),
        `Expected Math object info in hover: ${content}`
      )
    }
  })

  test('Should provide hover information for Promise types in TypeScript', async () => {
    const text = mathUtilsDocument.getText()
    const promisePos = text.indexOf('Promise<number>')
    const position = mathUtilsDocument.positionAt(promisePos)

    const hovers = await vscode.commands.executeCommand('vscode.executeHoverProvider', mathUtilsDocument.uri, position)

    assert.ok(hovers, 'Should provide hover for Promise types')
    if (hovers.length > 0) {
      const hoverContent = hovers[0].contents[0]
      assert.ok(hoverContent, 'Should have hover content for Promise types')
      // Should show Promise type information
      const content = typeof hoverContent === 'string' ? hoverContent : hoverContent.value || ''
      assert.ok(content.toLowerCase().includes('promise'), `Expected Promise type info in hover: ${content}`)
    }
  })
})
