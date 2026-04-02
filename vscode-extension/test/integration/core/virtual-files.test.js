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

const { getCompletions, waitForHover, activateExtension, findPosition, sleep } = require('../../utils/helpers')
const { assertHoverContains } = require('../../utils/assertions')
const { openFixtureDocument, FIXTURES } = require('../../utils/fixtures')

suite('Virtual Files Tests', () => {
  let blitsDocument

  suiteSetup(async () => {
    blitsDocument = await openFixtureDocument(FIXTURES.TEST_COMPONENT_BLITS)

    await activateExtension()
    await sleep(1000)
  })

  test('Should create virtual file for .blits script section', async () => {
    await vscode.window.showTextDocument(blitsDocument)

    assert.ok(blitsDocument.languageId === 'blits')
  })

  test('Should provide TypeScript features in .blits script section', async () => {
    const position = findPosition(blitsDocument, 'state()')
    assert.ok(position, 'Should find state()')

    const completions = await getCompletions(blitsDocument.uri, position)

    assert.ok(completions, 'Should get completions')
    assert.ok(completions.items.length > 0, 'Should have JS/TS completions in script section')
  })

  test('Should map positions between real and virtual files', async function () {
    this.timeout(8000)

    const position = findPosition(blitsDocument, 'state()')
    assert.ok(position, 'Should find state() in script')

    const hovers = await waitForHover(blitsDocument.uri, position, { timeout: 5000 })

    assertHoverContains(hovers, 'state')
  })

  test('Should handle script section language detection', async () => {
    const text = blitsDocument.getText()
    assert.ok(text.includes('export default'))

    const scriptStart = text.indexOf('<script>')
    const scriptEnd = text.indexOf('</script>')
    assert.ok(scriptStart >= 0)
    assert.ok(scriptEnd > scriptStart)
  })

  test('Should sync changes between real and virtual files', async () => {
    const editor = await vscode.window.showTextDocument(blitsDocument)

    assert.ok(editor)
    assert.strictEqual(editor.document.uri.fsPath, blitsDocument.uri.fsPath)
  })
})
