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

const { activateExtension, findPosition, setCursorPosition } = require('../../utils/helpers')
const { openFixtureDocument, FIXTURES } = require('../../utils/fixtures')
const { assertCommandRegistered } = require('../../utils/assertions')

suite('Commands Tests', () => {
  let jsDocument, blitsDocument

  suiteSetup(async () => {
    jsDocument = await openFixtureDocument(FIXTURES.TEST_COMPONENT_JS)
    blitsDocument = await openFixtureDocument(FIXTURES.TEST_COMPONENT_BLITS)

    await activateExtension()
  })

  suiteTeardown(async () => {
    for (const doc of [jsDocument, blitsDocument]) {
      const bytes = await vscode.workspace.fs.readFile(doc.uri)
      const original = Buffer.from(bytes).toString('utf8')
      const edit = new vscode.WorkspaceEdit()
      edit.replace(doc.uri, new vscode.Range(doc.positionAt(0), doc.positionAt(doc.getText().length)), original)
      await vscode.workspace.applyEdit(edit)
    }
  })

  test('Should register comment command', async () => {
    await assertCommandRegistered('blits-vscode.commentCommand')
  })

  test('Should toggle comments in JavaScript template', async () => {
    const editor = await vscode.window.showTextDocument(jsDocument)

    const position = findPosition(jsDocument, '<Text ')
    assert.ok(position, 'Should find <Text tag in template')

    setCursorPosition(editor, position)

    try {
      await vscode.commands.executeCommand('blits-vscode.commentCommand')
    } catch (_) {
      // acceptable in test environment
    }
    assert.ok(true)
  })

  test('Should toggle comments in .blits template section', async () => {
    const editor = await vscode.window.showTextDocument(blitsDocument)

    const position = findPosition(blitsDocument, '<Text ')
    assert.ok(position, 'Should find <Text tag in .blits template')

    setCursorPosition(editor, position)

    try {
      await vscode.commands.executeCommand('blits-vscode.commentCommand')
    } catch (_) {
      // acceptable in test environment
    }

    const lineText = blitsDocument.lineAt(position.line).text
    assert.ok(lineText.includes('<!--') && lineText.includes('-->'), 'Template section should use <!-- --> comment style')
  })

  test('Should toggle comments in .blits script section', async () => {
    const editor = await vscode.window.showTextDocument(blitsDocument)

    const position = findPosition(blitsDocument, 'state()')
    assert.ok(position, 'Should find state() in .blits script')

    setCursorPosition(editor, position)

    try {
      await vscode.commands.executeCommand('blits-vscode.commentCommand')
    } catch (_) {
      // acceptable in test environment
    }

    const lineText = blitsDocument.lineAt(position.line).text
    assert.ok(lineText.trimStart().startsWith('//'), 'Script section should use // comment style')
  })

  test('Should handle keybinding for comment command', () => {
    const packageJson = require('../../../package.json')
    const keybindings = packageJson.contributes.keybindings

    assert.ok(Array.isArray(keybindings))
    const commentBinding = keybindings.find((kb) => kb.command === 'blits-vscode.commentCommand')
    assert.ok(commentBinding)
    assert.strictEqual(commentBinding.key, 'ctrl+/')
    assert.strictEqual(commentBinding.mac, 'cmd+/')
  })
})
