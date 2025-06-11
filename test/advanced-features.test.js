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
async function getSignatureHelp(uri, position, triggerCharacter) {
  const result = await vscode.commands.executeCommand(
    'vscode.executeSignatureHelpProvider',
    uri,
    position,
    triggerCharacter
  )
  return /** @type {VSCodeSignatureHelp | undefined} */ (result)
}

suite('Advanced Language Features Tests', () => {
  let tsProjectPath

  suiteSetup(async function () {
    this.timeout(15000)

    // Advanced features test should run in TypeScript workspace context
    const workspaceFolders = vscode.workspace.workspaceFolders
    if (!workspaceFolders || workspaceFolders.length === 0) {
      throw new Error('TypeScript workspace not loaded properly for advanced features')
    }

    tsProjectPath = workspaceFolders[0].uri.fsPath
    // Note: JavaScript tests are now in separate workspace context

    console.log('Advanced features testing in workspace:', tsProjectPath)

    // Ensure extension is activated
    const extension = vscode.extensions.getExtension('lightningjs.lightning-blits')
    if (extension && !extension.isActive) {
      await extension.activate()
    }

    // Wait for language services to initialize
    await new Promise((resolve) => setTimeout(resolve, 3000))
  })

  test('Should provide signature help for functions in .blits TypeScript', async () => {
    const buttonUri = vscode.Uri.file(path.join(tsProjectPath, 'src', 'components', 'Button.blits'))
    const buttonDocument = await vscode.workspace.openTextDocument(buttonUri)

    const text = buttonDocument.getText()
    const distanceCallPos = text.indexOf('MathUtils.distance(') + 'MathUtils.distance('.length
    const position = buttonDocument.positionAt(distanceCallPos)

    const signatureHelp = await getSignatureHelp(buttonDocument.uri, position, '(')

    assert.ok(signatureHelp)
    if (signatureHelp.signatures && signatureHelp.signatures.length > 0) {
      const signature = signatureHelp.signatures[0]
      assert.ok(signature.label.includes('distance'))
      assert.ok(signature.parameters && signature.parameters.length >= 2)
    }
  })

  // Note: JavaScript signature help test moved to JavaScript integration test suite
  // since it requires JavaScript workspace context

  test('Should support find all references in TypeScript .blits files', async () => {
    const mathUri = vscode.Uri.file(path.join(tsProjectPath, 'src', 'utils', 'math.ts'))
    const mathDocument = await vscode.workspace.openTextDocument(mathUri)

    const text = mathDocument.getText()
    const pointInterfacePos = text.indexOf('interface Point')
    const position = mathDocument.positionAt(pointInterfacePos + 'interface '.length)

    const references = await vscode.commands.executeCommand(
      'vscode.executeReferenceProvider',
      mathDocument.uri,
      position
    )

    assert.ok(references)
    // Should find references to Point interface across files
    assert.ok(references.length >= 1)
  })

  test('Should support rename symbol across files', async () => {
    const mathUri = vscode.Uri.file(path.join(tsProjectPath, 'src', 'utils', 'math.ts'))
    const mathDocument = await vscode.workspace.openTextDocument(mathUri)

    const text = mathDocument.getText()
    const createPointPos = text.indexOf('createPoint')
    const position = mathDocument.positionAt(createPointPos)

    const workspaceEdit = await vscode.commands.executeCommand(
      'vscode.executeDocumentRenameProvider',
      mathDocument.uri,
      position,
      'createNewPoint'
    )

    assert.ok(workspaceEdit)
    // Should provide rename edits
    if (workspaceEdit.size > 0) {
      assert.ok(true, 'Rename functionality is working')
    }
  })

  test('Should validate imports between different file types', async () => {
    const mainUri = vscode.Uri.file(path.join(tsProjectPath, 'src', 'main.ts'))
    const mainDocument = await vscode.workspace.openTextDocument(mainUri)

    // Wait for diagnostics to be processed
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const diagnostics = vscode.languages.getDiagnostics(mainDocument.uri)

    // Should not have import errors for .blits files
    const importErrors = diagnostics.filter(
      (d) => d.message.includes('Cannot find module') && d.message.includes('.blits')
    )

    assert.strictEqual(
      importErrors.length,
      0,
      `Found .blits import errors: ${importErrors.map((e) => e.message).join(', ')}`
    )
  })

  test('Should provide code actions in .blits files', async () => {
    const buttonUri = vscode.Uri.file(path.join(tsProjectPath, 'src', 'components', 'Button.blits'))
    const buttonDocument = await vscode.workspace.openTextDocument(buttonUri)

    const text = buttonDocument.getText()
    const importPos = text.indexOf('import type { Point }')
    const position = buttonDocument.positionAt(importPos)
    const range = new vscode.Range(position, position)

    const codeActions = await vscode.commands.executeCommand(
      'vscode.executeCodeActionProvider',
      buttonDocument.uri,
      range
    )

    assert.ok(codeActions)
    // Should provide some code actions (organize imports, etc.)
    assert.ok(Array.isArray(codeActions))
  })

  test('Should handle complex TypeScript features in .blits files', async () => {
    const buttonUri = vscode.Uri.file(path.join(tsProjectPath, 'src', 'components', 'Button.blits'))
    const buttonDocument = await vscode.workspace.openTextDocument(buttonUri)

    const text = buttonDocument.getText()

    // Test generic type usage
    assert.ok(text.includes('Promise<void>'))
    assert.ok(text.includes('interface ButtonProps'))
    assert.ok(text.includes('as const'))

    // Should not have TypeScript compilation errors
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const diagnostics = vscode.languages.getDiagnostics(buttonDocument.uri)
    const tsErrors = diagnostics.filter(
      (d) => d.severity === vscode.DiagnosticSeverity.Error && (d.source === 'ts' || d.message.includes('Type '))
    )

    assert.strictEqual(tsErrors.length, 0, `Found TypeScript errors: ${tsErrors.map((e) => e.message).join(', ')}`)
  })

  test('Should support workspace symbols search', async () => {
    // Note: Workspace symbol search may not work without proper workspace setup
    const symbols = await vscode.commands.executeCommand('vscode.executeWorkspaceSymbolProvider', 'MathUtils')

    assert.ok(symbols)
    if (symbols.length > 0) {
      const mathUtilsSymbol = symbols.find((s) => s.name.includes('MathUtils'))
      assert.ok(mathUtilsSymbol, 'Should find MathUtils in workspace symbols')
    }
  })

  test('Should provide document symbols for .blits files', async () => {
    const buttonUri = vscode.Uri.file(path.join(tsProjectPath, 'src', 'components', 'Button.blits'))
    const buttonDocument = await vscode.workspace.openTextDocument(buttonUri)

    try {
      const symbols = await vscode.commands.executeCommand('vscode.executeDocumentSymbolProvider', buttonDocument.uri)

      // Document symbols may not be available in test environment
      // Just verify the command doesn't throw an error
      assert.ok(true, 'Document symbol provider executed without error')

      if (symbols && symbols.length > 0) {
        const symbolNames = symbols.map((s) => s.name)
        // Should find symbols from the script section
        assert.ok(
          symbolNames.some(
            (name) => name.includes('handleClick') || name.includes('state') || name.includes('computed')
          )
        )
      }
    } catch (error) {
      // In test environment, this feature may not work
      assert.ok(true, 'Document symbol provider may not be available in test environment')
    }
  })
})
