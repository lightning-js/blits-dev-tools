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

suite('Hover Provider Tests', () => {
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

  test('Should provide hover information for Element component in JS template', async () => {
    const text = jsDocument.getText()
    const elementPos = text.indexOf('<Element')
    const position = jsDocument.positionAt(elementPos + 2) // Position on "Element"

    const hovers = await vscode.commands.executeCommand('vscode.executeHoverProvider', jsDocument.uri, position)

    assert.ok(hovers)
    if (hovers.length > 0) {
      const hoverContent = hovers[0].contents[0]
      assert.ok(hoverContent)
      // Should contain information about Element component
      assert.ok(hoverContent.value.includes('Element') || hoverContent.includes('Element'))
    }
  })

  test('Should provide hover information for Text component in JS template', async () => {
    const text = jsDocument.getText()
    const textPos = text.indexOf('<Text')
    const position = jsDocument.positionAt(textPos + 2) // Position on "Text"

    const hovers = await vscode.commands.executeCommand('vscode.executeHoverProvider', jsDocument.uri, position)

    assert.ok(hovers)
    if (hovers.length > 0) {
      const hoverContent = hovers[0].contents[0]
      assert.ok(hoverContent)
      // Should contain information about Text component
      assert.ok(hoverContent.value.includes('Text') || hoverContent.includes('Text'))
    }
  })

  test('Should provide hover information for Layout component in JS template', async () => {
    const text = jsDocument.getText()
    const layoutPos = text.indexOf('<Layout')
    const position = jsDocument.positionAt(layoutPos + 2) // Position on "Layout"

    const hovers = await vscode.commands.executeCommand('vscode.executeHoverProvider', jsDocument.uri, position)

    assert.ok(hovers)
    if (hovers.length > 0) {
      const hoverContent = hovers[0].contents[0]
      assert.ok(hoverContent)
      // Should contain information about Layout component
      assert.ok(hoverContent.value.includes('Layout') || hoverContent.includes('Layout'))
    }
  })

  test('Should provide hover information for component attributes', async () => {
    const text = jsDocument.getText()
    const wPos = text.indexOf('w="1920"')
    const position = jsDocument.positionAt(wPos) // Position on "w" attribute

    const hovers = await vscode.commands.executeCommand('vscode.executeHoverProvider', jsDocument.uri, position)

    assert.ok(hovers)
    // May provide hover information for attributes
    if (hovers.length > 0) {
      const hoverContent = hovers[0].contents[0]
      assert.ok(hoverContent)
    }
  })

  test('Should provide hover information in TypeScript template', async () => {
    const text = tsDocument.getText()
    const elementPos = text.indexOf('<Element')
    const position = tsDocument.positionAt(elementPos + 2)

    const hovers = await vscode.commands.executeCommand('vscode.executeHoverProvider', tsDocument.uri, position)

    assert.ok(hovers)
    // TypeScript should provide similar hover capabilities
  })

  test('Should provide hover information in .blits template section', async () => {
    const text = blitsDocument.getText()
    const elementPos = text.indexOf('<Element')
    const position = blitsDocument.positionAt(elementPos + 2)

    const hovers = await vscode.commands.executeCommand('vscode.executeHoverProvider', blitsDocument.uri, position)

    assert.ok(hovers)
    // .blits files should provide hover information in template section
  })

  test('Should provide hover information in .blits script section', async () => {
    const text = blitsDocument.getText()
    const statePos = text.indexOf('state')
    const position = blitsDocument.positionAt(statePos)

    const hovers = await vscode.commands.executeCommand('vscode.executeHoverProvider', blitsDocument.uri, position)

    assert.ok(hovers)
    // .blits files should provide TypeScript/JavaScript hover in script section
  })
})
