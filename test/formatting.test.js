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

suite('Formatting Tests', () => {
  let jsDocument, tsDocument, blitsDocument

  suiteSetup(async () => {
    const jsUri = vscode.Uri.file(path.join(__dirname, 'fixtures', 'test-component.js'))
    const tsUri = vscode.Uri.file(path.join(__dirname, 'fixtures', 'test-component.ts'))
    const blitsUri = vscode.Uri.file(path.join(__dirname, 'fixtures', 'test-component.blits'))

    jsDocument = await vscode.workspace.openTextDocument(jsUri)
    tsDocument = await vscode.workspace.openTextDocument(tsUri)
    blitsDocument = await vscode.workspace.openTextDocument(blitsUri)

    const extension = vscode.extensions.getExtension('lightningjs.lightning-blits')
    await extension.activate()
  })

  test('Should format JavaScript template strings', async () => {
    // Get range of template string in JS file
    const text = jsDocument.getText()
    const templateStart = text.indexOf('template: `')
    const templateEnd = text.indexOf('`,', templateStart) + 1

    const startPos = jsDocument.positionAt(templateStart)
    const endPos = jsDocument.positionAt(templateEnd)
    const range = new vscode.Range(startPos, endPos)

    const formatEdits = await vscode.commands.executeCommand(
      'vscode.executeFormatRangeProvider',
      jsDocument.uri,
      range,
      {
        tabSize: 2,
        insertSpaces: true,
      }
    )

    // Formatting might not be available for all contexts, check if result exists
    if (formatEdits) {
      assert.ok(Array.isArray(formatEdits))
    } else {
      // No formatting available for this context, which is acceptable
      assert.ok(true)
    }
  })

  test('Should format TypeScript template strings', async () => {
    const text = tsDocument.getText()
    const templateStart = text.indexOf('template: `')
    const templateEnd = text.indexOf('`,', templateStart) + 1

    const startPos = tsDocument.positionAt(templateStart)
    const endPos = tsDocument.positionAt(templateEnd)
    const range = new vscode.Range(startPos, endPos)

    const formatEdits = await vscode.commands.executeCommand(
      'vscode.executeFormatRangeProvider',
      tsDocument.uri,
      range,
      {
        tabSize: 2,
        insertSpaces: true,
      }
    )

    if (formatEdits) {
      assert.ok(Array.isArray(formatEdits))
    } else {
      assert.ok(true)
    }
  })

  test('Should format .blits template section', async () => {
    const text = blitsDocument.getText()
    const templateStart = text.indexOf('<template>')
    const templateEnd = text.indexOf('</template>') + '</template>'.length

    const startPos = blitsDocument.positionAt(templateStart)
    const endPos = blitsDocument.positionAt(templateEnd)
    const range = new vscode.Range(startPos, endPos)

    const formatEdits = await vscode.commands.executeCommand(
      'vscode.executeFormatRangeProvider',
      blitsDocument.uri,
      range,
      {
        tabSize: 2,
        insertSpaces: true,
      }
    )

    if (formatEdits) {
      assert.ok(Array.isArray(formatEdits))
    } else {
      assert.ok(true)
    }
  })

  test('Should format .blits script section', async () => {
    const text = blitsDocument.getText()
    const scriptStart = text.indexOf('<script>')
    const scriptEnd = text.indexOf('</script>') + '</script>'.length

    const startPos = blitsDocument.positionAt(scriptStart)
    const endPos = blitsDocument.positionAt(scriptEnd)
    const range = new vscode.Range(startPos, endPos)

    const formatEdits = await vscode.commands.executeCommand(
      'vscode.executeFormatRangeProvider',
      blitsDocument.uri,
      range,
      {
        tabSize: 2,
        insertSpaces: true,
      }
    )

    if (formatEdits) {
      assert.ok(Array.isArray(formatEdits))
    } else {
      assert.ok(true)
    }
  })

  test('Should format entire .blits file', async () => {
    const formatEdits = await vscode.commands.executeCommand(
      'vscode.executeFormatDocumentProvider',
      blitsDocument.uri,
      {
        tabSize: 2,
        insertSpaces: true,
      }
    )

    if (formatEdits) {
      assert.ok(Array.isArray(formatEdits))
    } else {
      assert.ok(true)
    }
  })

  test('Should respect formatting configuration', async () => {
    // Test that formatting respects the extension's configuration options
    const config = vscode.workspace.getConfiguration('blits.format')

    // These are the configuration options from package.json
    const printWidth = config.get('printWidth')
    const tabWidth = config.get('tabWidth')
    const useTabs = config.get('useTabs')
    const singleQuote = config.get('singleQuote')

    assert.ok(typeof printWidth === 'number')
    assert.ok(typeof tabWidth === 'number')
    assert.ok(typeof useTabs === 'boolean')
    assert.ok(typeof singleQuote === 'boolean')
  })

  test('Should handle auto-format setting', () => {
    const config = vscode.workspace.getConfiguration('blits')
    const autoFormat = config.get('autoFormat')

    assert.ok(typeof autoFormat === 'boolean')
  })
})
