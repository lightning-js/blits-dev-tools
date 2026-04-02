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

suite('TypeScript v2 Integration Tests', () => {
  let tsProjectPath
  let buttonBlitsDocument, anchorBlitsDocument, mainTsDocument

  suiteSetup(async function () {
    this.timeout(15000)

    const workspaceFolders = vscode.workspace.workspaceFolders
    if (!workspaceFolders || workspaceFolders.length === 0) {
      throw new Error('TypeScript v2 workspace not loaded properly')
    }

    tsProjectPath = workspaceFolders[0].uri.fsPath

    const buttonUri = vscode.Uri.file(path.join(tsProjectPath, 'src', 'components', 'Button.blits'))
    const anchorUri = vscode.Uri.file(path.join(tsProjectPath, 'src', 'components', 'anchor.blits'))
    const mainUri = vscode.Uri.file(path.join(tsProjectPath, 'src', 'main.ts'))

    buttonBlitsDocument = await vscode.workspace.openTextDocument(buttonUri)
    anchorBlitsDocument = await vscode.workspace.openTextDocument(anchorUri)
    mainTsDocument = await vscode.workspace.openTextDocument(mainUri)

    await activateExtension()
    await sleep(3000)
  })

  test('Should recognize .blits file in TypeScript v2 project', () => {
    assert.strictEqual(buttonBlitsDocument.languageId, 'blits')
    const text = buttonBlitsDocument.getText()
    assert.ok(text.includes('<script lang="ts">'))
  })

  test('Should recognize .ts file in TypeScript v2 project', () => {
    assert.strictEqual(mainTsDocument.languageId, 'typescript')
  })

  test('Should serve v2 attribute set for Element completions in .blits file', async function () {
    this.timeout(15000)

    const text = anchorBlitsDocument.getText()
    const attrPos = text.indexOf('<Element b') + '<Element b'.length
    const position = anchorBlitsDocument.positionAt(attrPos)

    let labels = []
    const deadline = Date.now() + 12000
    while (Date.now() < deadline) {
      const completions = await getCompletions(anchorBlitsDocument.uri, position)
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

  test('Should serve v2 attribute set for Element completions in .ts template string', async function () {
    this.timeout(15000)

    const text = mainTsDocument.getText()
    const attrPos = text.indexOf('<Element b') + '<Element b'.length
    const position = mainTsDocument.positionAt(attrPos)

    let labels = []
    const deadline = Date.now() + 12000
    while (Date.now() < deadline) {
      const completions = await getCompletions(mainTsDocument.uri, position)
      if (completions && completions.items.length > 0) {
        labels = getCompletionLabels(completions)
        if (labels.includes('border')) break
      }
      await sleep(500)
    }

    assert.ok(labels.includes('border'), 'border should be in v2 completions')
    assert.ok(!labels.includes('effects'), 'effects should not be in v2 completions')
  })
})
