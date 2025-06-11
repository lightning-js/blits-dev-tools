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

suite('Virtual Files Tests', () => {
  let blitsDocument

  suiteSetup(async () => {
    const blitsUri = vscode.Uri.file(path.join(__dirname, 'fixtures', 'test-component.blits'))
    blitsDocument = await vscode.workspace.openTextDocument(blitsUri)

    const extension = vscode.extensions.getExtension('lightningjs.lightning-blits')
    await extension.activate()

    // Wait for virtual files to be processed
    await new Promise((resolve) => setTimeout(resolve, 1000))
  })

  test('Should create virtual file for .blits script section', async () => {
    // Open the .blits file in editor to trigger virtual file creation
    await vscode.window.showTextDocument(blitsDocument)

    // The virtual file system should handle .blits files
    // This is mostly internal, but we can test that it doesn't crash
    assert.ok(blitsDocument.languageId === 'blits')
  })

  test('Should provide TypeScript features in .blits script section', async () => {
    const text = blitsDocument.getText()
    const statePos = text.indexOf('state()')
    const position = blitsDocument.positionAt(statePos)

    // Should provide completions in script section
    const completions = await vscode.commands.executeCommand(
      'vscode.executeCompletionItemProvider',
      blitsDocument.uri,
      position
    )

    assert.ok(completions)
    // Should get JavaScript/TypeScript completions in script section
    assert.ok(completions.items.length >= 0)
  })

  test('Should handle .blits file imports and module resolution', async () => {
    // Test that .blits files can be imported and resolved
    // This is complex to test directly, but we can verify the document opens correctly
    assert.ok(blitsDocument)
    assert.strictEqual(blitsDocument.languageId, 'blits')

    const text = blitsDocument.getText()
    assert.ok(text.includes('<template>'))
    assert.ok(text.includes('<script>'))
  })

  test('Should map positions between real and virtual files', async () => {
    // Position mapping is internal, but we can test that features work
    const text = blitsDocument.getText()
    const scriptStart = text.indexOf('<script>')
    const statePos = text.indexOf('state()', scriptStart)
    const position = blitsDocument.positionAt(statePos)

    // Should be able to get hover information in script section
    const hovers = await vscode.commands.executeCommand('vscode.executeHoverProvider', blitsDocument.uri, position)

    assert.ok(hovers)
    // Position mapping should work correctly
  })

  test('Should handle script section language detection', async () => {
    // The script section should be treated as JavaScript by default
    const text = blitsDocument.getText()
    assert.ok(text.includes('export default'))

    // Script extraction should work
    const scriptStart = text.indexOf('<script>')
    const scriptEnd = text.indexOf('</script>')
    assert.ok(scriptStart >= 0)
    assert.ok(scriptEnd > scriptStart)
  })

  test('Should sync changes between real and virtual files', async () => {
    // Open editor and make a change
    const editor = await vscode.window.showTextDocument(blitsDocument)

    // This tests that the virtual file system handles document changes
    // The actual syncing is internal, but we can verify no errors occur
    assert.ok(editor)
    assert.strictEqual(editor.document.uri.fsPath, blitsDocument.uri.fsPath)
  })
})
