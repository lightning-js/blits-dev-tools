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

const { getCompletions, activateExtension, findPosition } = require('../../utils/helpers')
const { openFixtureDocument, FIXTURES } = require('../../utils/fixtures')
const { assertHasCompletionsExact, assertNotHasCompletionExact } = require('../../utils/assertions')

suite('Completion Provider Tests', () => {
  let jsDocument, tsDocument, blitsDocument

  suiteSetup(async () => {
    jsDocument = await openFixtureDocument(FIXTURES.TEST_COMPONENT_JS)
    tsDocument = await openFixtureDocument(FIXTURES.TEST_COMPONENT_TS)
    blitsDocument = await openFixtureDocument(FIXTURES.TEST_COMPONENT_BLITS)

    await activateExtension()
  })

  test('Should provide completion for Element attributes in JS template', async () => {
    // 'w="200" h' puts the cursor after 'h' with a space as prevChar — required to trigger the attribute provider
    const position = findPosition(jsDocument, 'w="200" h', 'w="200" h'.length)
    assert.ok(position, 'Should find Element tag in template')

    const completions = await getCompletions(jsDocument.uri, position)

    assertHasCompletionsExact(completions, ['alpha', 'mount', 'x'])
    // v2-only attributes must not appear for a v1 project (verifies version detection)
    assertNotHasCompletionExact(completions, 'border')
    assertNotHasCompletionExact(completions, 'rounded')
  })

  test('Should provide completion for built-in components', async () => {
    const position = findPosition(jsDocument, '<Layout')
    assert.ok(position, 'Should find Layout tag in template')

    const completions = await getCompletions(jsDocument.uri, position)

    assertHasCompletionsExact(completions, ['Element', 'Text', 'Layout', 'RouterView'])
  })

  test('Should provide completion in TypeScript template', async () => {
    const position = findPosition(tsDocument, 'w="200" h', 'w="200" h'.length)
    assert.ok(position, 'Should find Element tag in TS template')

    const completions = await getCompletions(tsDocument.uri, position)

    assertHasCompletionsExact(completions, ['alpha', 'mount', 'x'])
  })

  test('Should provide completion in .blits template section', async () => {
    const position = findPosition(blitsDocument, 'w="200" h', 'w="200" h'.length)
    assert.ok(position, 'Should find Element tag in .blits template')

    const completions = await getCompletions(blitsDocument.uri, position)

    assertHasCompletionsExact(completions, ['alpha', 'mount', 'x'])
  })

  test('Reactive attribute already in tag is excluded from static completions', async () => {
    const position = findPosition(jsDocument, ':color="$c" w', ':color="$c" w'.length)
    assert.ok(position, 'Should find deduplication anchor')
    const completions = await getCompletions(jsDocument.uri, position)
    assertNotHasCompletionExact(completions, 'color')
  })

  test('Reactive attribute with object value is excluded from static completions', async () => {
    const anchor = "'#444'}\" w"
    const position = findPosition(jsDocument, anchor, anchor.length)
    assert.ok(position, 'Should find object-value deduplication anchor')
    const completions = await getCompletions(jsDocument.uri, position)
    assertNotHasCompletionExact(completions, 'color')
  })

  test('Static attribute already in tag is excluded from reactive completions', async () => {
    const position = findPosition(jsDocument, 'color="red" :', 'color="red" '.length)
    assert.ok(position, 'Should find deduplication anchor')
    const completions = await getCompletions(jsDocument.uri, position)
    assertNotHasCompletionExact(completions, ':color')
  })

  test('Should provide completion in .blits script section', async () => {
    const position = findPosition(blitsDocument, 'state()', 'state()'.length)
    assert.ok(position, 'Should find state() in .blits script')

    const completions = await getCompletions(blitsDocument.uri, position)

    assert.ok(completions.items.length > 0, 'Should have JavaScript/TypeScript completions in script section')
  })
})
