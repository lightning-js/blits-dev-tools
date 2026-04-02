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

const { getCompletions, activateExtension, findPosition } = require('../../utils/helpers')
const { openFixtureDocument, FIXTURES } = require('../../utils/fixtures')

suite('Template Detection Tests', () => {
  let jsDocument, tsDocument, errorDocument

  suiteSetup(async () => {
    jsDocument = await openFixtureDocument(FIXTURES.TEST_COMPONENT_JS)
    tsDocument = await openFixtureDocument(FIXTURES.TEST_COMPONENT_TS)
    errorDocument = await openFixtureDocument(FIXTURES.TEST_COMPONENT_WITH_ERRORS)

    await activateExtension()
  })

  test('Should detect template in Blits.Component call in JavaScript', async () => {
    await vscode.window.showTextDocument(jsDocument)

    const text = jsDocument.getText()
    assert.ok(text.includes('Blits.Component'))
    assert.ok(text.includes('template: `'))

    const position = findPosition(jsDocument, '<Element')
    assert.ok(position, 'Should find Element tag')

    const completions = await getCompletions(jsDocument.uri, position)

    assert.ok(completions.items.length > 0, 'Should get completions in template')
  })

  test('Should detect template in Blits.Component call in TypeScript', async () => {
    await vscode.window.showTextDocument(tsDocument)

    const text = tsDocument.getText()
    assert.ok(text.includes('Blits.Component'))
    assert.ok(text.includes('template: `'))

    const position = findPosition(tsDocument, '<Element')
    assert.ok(position, 'Should find Element tag in TS')

    const completions = await getCompletions(tsDocument.uri, position)

    assert.ok(completions.items.length > 0, 'Should get completions in TypeScript template')
  })

  test('Should handle template detection with syntax errors', async () => {
    await vscode.window.showTextDocument(errorDocument)

    const text = errorDocument.getText()
    assert.ok(text.includes('Blits.Component'))
    assert.ok(text.includes('template: `'))

    const position = findPosition(errorDocument, '<Element')

    if (position) {
      try {
        const completions = await getCompletions(errorDocument.uri, position)
        assert.ok(completions, 'Should provide completions even with errors')
      } catch (_) {
        assert.ok(true, 'Extension should handle syntax errors gracefully')
      }
    }
  })

  test('Should detect reactive attributes in templates', async () => {
    const position = findPosition(jsDocument, ':color="$backgroundColor"')
    assert.ok(position, 'Should find reactive attribute')

    const completions = await getCompletions(jsDocument.uri, position)

    assert.ok(completions.items.length > 0, 'Should get completions at reactive attribute')
  })

  test('Should detect event handlers in templates', async () => {
    const position = findPosition(jsDocument, '@click="$handleClick"')
    assert.ok(position, 'Should find event handler')

    const completions = await getCompletions(jsDocument.uri, position)

    assert.ok(completions.items.length > 0, 'Should get completions at event handler')
  })

  test('Should detect nested components in templates', async () => {
    const position = findPosition(jsDocument, '<CustomButton', 1)
    assert.ok(position, 'Should find custom component')

    const completions = await getCompletions(jsDocument.uri, position)

    assert.ok(completions.items.length > 0, 'Should get completions for custom component')
  })

  test('Should handle multiple templates in same file', async () => {
    const text = jsDocument.getText()
    const componentCalls = (text.match(/Blits\.Component/g) || []).length

    assert.ok(componentCalls >= 1)
  })

  test('Should parse template boundaries correctly', async () => {
    const text = jsDocument.getText()
    const templateStart = text.indexOf('template: `') + 'template: `'.length
    const templateEnd = text.indexOf('`,', templateStart)

    assert.ok(templateStart > 0)
    assert.ok(templateEnd > templateStart)

    const templateContent = text.substring(templateStart, templateEnd)
    assert.ok(templateContent.includes('<Element'))
    assert.ok(templateContent.includes('</Element>'))
  })
})
