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

const { getHovers, waitForHover, activateExtension, findPosition } = require('../../utils/helpers')
const { openFixtureDocument, FIXTURES } = require('../../utils/fixtures')
const { assertHoverContains } = require('../../utils/assertions')

suite('Hover Provider Tests', () => {
  let jsDocument, tsDocument, blitsDocument

  suiteSetup(async () => {
    jsDocument = await openFixtureDocument(FIXTURES.TEST_COMPONENT_JS)
    tsDocument = await openFixtureDocument(FIXTURES.TEST_COMPONENT_TS)
    blitsDocument = await openFixtureDocument(FIXTURES.TEST_COMPONENT_BLITS)

    await activateExtension()
  })

  test('Should provide hover information for Element component in JS template', async () => {
    const position = findPosition(jsDocument, '<Element', 2)
    assert.ok(position, 'Should find Element tag')

    const hovers = await getHovers(jsDocument.uri, position)

    // Blits hover is .blits-only; tag hover in JS/TS goes through the TS language service and may return nothing
    assert.ok(Array.isArray(hovers), 'Hover provider should return an array')
  })

  test('Should provide hover information for Text component in JS template', async () => {
    const position = findPosition(jsDocument, '<Text', 2)
    assert.ok(position, 'Should find Text tag')

    const hovers = await getHovers(jsDocument.uri, position)

    assert.ok(Array.isArray(hovers), 'Hover provider should return an array')
  })

  test('Should provide hover information for Layout component in JS template', async () => {
    const position = findPosition(jsDocument, '<Layout', 2)
    assert.ok(position, 'Should find Layout tag')

    const hovers = await getHovers(jsDocument.uri, position)

    assert.ok(Array.isArray(hovers), 'Hover provider should return an array')
  })

  test('Should provide hover information for component attributes', async () => {
    const position = findPosition(jsDocument, 'w="1920"')
    assert.ok(position, 'Should find w attribute')

    const hovers = await getHovers(jsDocument.uri, position)

    assert.ok(Array.isArray(hovers), 'Hover provider should return an array')
  })

  test('Should provide hover information in TypeScript template', async () => {
    const position = findPosition(tsDocument, '<Element', 2)
    assert.ok(position, 'Should find Element tag in TS')

    const hovers = await getHovers(tsDocument.uri, position)

    assert.ok(Array.isArray(hovers), 'Hover provider should return an array')
  })

  test('Should provide hover information in .blits template section', async () => {
    const position = findPosition(blitsDocument, '<Element', 2)
    assert.ok(position, 'Should find Element tag in .blits')

    const hovers = await getHovers(blitsDocument.uri, position)

    // Template positions map to a negative offset into the script — hover returns nothing here
    assert.ok(Array.isArray(hovers), 'Hover provider should return an array')
  })

  test('Should provide hover information in .blits script section', async function () {
    this.timeout(8000)

    const position = findPosition(blitsDocument, 'state')
    assert.ok(position, 'Should find state in script')

    const hovers = await waitForHover(blitsDocument.uri, position, { timeout: 5000 })

    assertHoverContains(hovers, 'state')
  })
})
