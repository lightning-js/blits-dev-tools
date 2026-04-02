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
const { getTagContext } = require('../../src/core/templateHandler')

function makeDoc(text) {
  return { getText: () => text }
}

function pos(line, character) {
  return { line, character }
}

suite('getTagContext', () => {
  test('collects attributes before and after cursor position', () => {
    const text = '<Element x="100" y="100" w="150" h="150" color="#64748b" />'
    // Cursor at the space just before "color" — simulates typing between h and color
    const cursorChar = text.indexOf('color') - 1
    const context = getTagContext(makeDoc(text), pos(0, cursorChar))

    assert.strictEqual(context.isInTag, true)
    assert.strictEqual(context.tagName, 'Element')
    assert.ok(context.attributes.includes('color'), 'color (after cursor) should be in attributes')
    assert.ok(context.attributes.includes('x'), 'x (before cursor) should be in attributes')
    assert.ok(context.attributes.includes('h'), 'h (before cursor) should be in attributes')
  })

  test('collects attributes after cursor on a multi-line tag', () => {
    const text = ['<Element', '  x="100"', '  y="100"', '  color="#fff"', '/>'].join('\n')
    // Cursor at start of "y" line, before y attribute
    const context = getTagContext(makeDoc(text), pos(2, 2))

    assert.strictEqual(context.isInTag, true)
    assert.ok(context.attributes.includes('color'), 'color (after cursor) should be in attributes')
    assert.ok(context.attributes.includes('x'), 'x (before cursor) should be in attributes')
  })
})
