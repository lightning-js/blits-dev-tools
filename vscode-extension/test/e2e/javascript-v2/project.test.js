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

const { getCompletions, activateExtension, sleep, getCompletionLabels } = require('../../utils/helpers')

suite('JavaScript v2 Integration Tests', () => {
  let jsProjectPath
  let panelBlitsDocument, mainJsDocument

  suiteSetup(async function () {
    this.timeout(15000)

    const workspaceFolders = vscode.workspace.workspaceFolders
    if (!workspaceFolders || workspaceFolders.length === 0) {
      throw new Error('JavaScript v2 workspace not loaded properly')
    }

    jsProjectPath = workspaceFolders[0].uri.fsPath

    const panelUri = vscode.Uri.file(path.join(jsProjectPath, 'src', 'components', 'Panel.blits'))
    const mainUri = vscode.Uri.file(path.join(jsProjectPath, 'src', 'main.js'))

    panelBlitsDocument = await vscode.workspace.openTextDocument(panelUri)
    mainJsDocument = await vscode.workspace.openTextDocument(mainUri)

    await activateExtension()
    await sleep(3000)
  })

  test('Should recognize .blits file in JavaScript v2 project', () => {
    assert.strictEqual(panelBlitsDocument.languageId, 'blits')
  })

  test('Should recognize .js file in JavaScript v2 project', () => {
    assert.strictEqual(mainJsDocument.languageId, 'javascript')
  })

  test('Should serve v2 attribute set for Element completions', async function () {
    this.timeout(15000)

    const text = panelBlitsDocument.getText()
    const attrPos = text.indexOf('    :w="$panelWidth"')
    const position = panelBlitsDocument.positionAt(attrPos + '    '.length)

    let labels = []
    const deadline = Date.now() + 12000
    while (Date.now() < deadline) {
      const completions = await getCompletions(panelBlitsDocument.uri, position)
      if (completions && completions.items.length > 0) {
        labels = getCompletionLabels(completions)
        if (labels.includes('border')) break
      }
      await sleep(500)
    }

    assert.ok(labels.includes('border'), 'border should be in v2 completions')
    assert.ok(!labels.includes('effects'), 'effects should not be in v2 completions')
    assert.ok(!labels.includes('wordwrap'), 'wordwrap should not be in v2 completions')
  })

  test('Should provide non-reactive completions in .js template string', async function () {
    this.timeout(15000)

    const text = mainJsDocument.getText()
    const attrPos = text.indexOf('<Element b') + '<Element b'.length
    const position = mainJsDocument.positionAt(attrPos)

    let labels = []
    const deadline = Date.now() + 12000
    while (Date.now() < deadline) {
      const completions = await getCompletions(mainJsDocument.uri, position)
      if (completions && completions.items.length > 0) {
        labels = getCompletionLabels(completions)
        if (labels.includes('border')) break
      }
      await sleep(500)
    }

    assert.ok(labels.includes('border'), 'border should be in v2 non-reactive completions')
    assert.ok(!labels.includes('effects'), 'effects should not be in v2 completions')
  })

  test('Should provide reactive completions in .js template string', async function () {
    this.timeout(15000)

    const text = mainJsDocument.getText()
    const attrPos = text.indexOf('      :color="$bgColor"') + '      :'.length
    const position = mainJsDocument.positionAt(attrPos)

    let labels = []
    const deadline = Date.now() + 12000
    while (Date.now() < deadline) {
      const completions = await getCompletions(mainJsDocument.uri, position)
      if (completions && completions.items.length > 0) {
        labels = getCompletionLabels(completions)
        if (labels.includes(':border')) break
      }
      await sleep(500)
    }

    assert.ok(labels.includes(':border'), ':border should be in v2 reactive completions')
    assert.ok(!labels.includes(':effects'), ':effects should not be in v2 completions')
  })
})
