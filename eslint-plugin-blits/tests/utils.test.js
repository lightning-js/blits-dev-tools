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

const { test, describe } = require('node:test')
const assert = require('node:assert/strict')
const { getBlitsTemplate, indexToLoc, isValidTemplateString } = require('../lib/utils')

describe('getBlitsTemplate', () => {
  test('extracts content from <template> block', () => {
    const file = '<template><View /></template>'
    const result = getBlitsTemplate(file)
    assert.ok(result !== null)
    assert.equal(result.content, '<View />')
  })

  test('returns correct start offset (after opening tag)', () => {
    const file = '<template><View /></template>'
    const result = getBlitsTemplate(file)
    // '<template>' is 10 chars, so content starts at index 10
    assert.equal(result.start, 10)
  })

  test('handles multiline template block', () => {
    const file = '<template>\n  <View />\n</template>'
    const result = getBlitsTemplate(file)
    assert.ok(result !== null)
    assert.equal(result.content, '\n  <View />\n')
  })

  test('returns null when no <template> block', () => {
    const file = 'export default Blits.Component("Foo", { template: "<View />" })'
    const result = getBlitsTemplate(file)
    assert.equal(result, null)
  })

  test('returns null for empty string', () => {
    assert.equal(getBlitsTemplate(''), null)
  })
})

describe('indexToLoc', () => {
  test('index 0 is line 1 column 0', () => {
    const loc = indexToLoc('hello', 0)
    assert.deepEqual(loc, { line: 1, column: 0 })
  })

  test('index at end of first line (before newline)', () => {
    const text = 'hello\nworld'
    const loc = indexToLoc(text, 5)
    assert.deepEqual(loc, { line: 1, column: 5 })
  })

  test('index at start of second line (after newline)', () => {
    const text = 'hello\nworld'
    const loc = indexToLoc(text, 6)
    assert.deepEqual(loc, { line: 2, column: 0 })
  })

  test('index in the middle of second line', () => {
    const text = 'hello\nworld'
    const loc = indexToLoc(text, 8)
    assert.deepEqual(loc, { line: 2, column: 2 })
  })
})

describe('isValidTemplateString', () => {
  test('returns true for simple tag', () => {
    assert.equal(isValidTemplateString('<View />'), true)
  })

  test('returns true for nested tags', () => {
    assert.equal(isValidTemplateString('<View><Text /></View>'), true)
  })

  test('returns true for reactive attribute', () => {
    assert.equal(isValidTemplateString('<View :color="$c" />'), true)
  })

  test('returns true for event handler', () => {
    assert.equal(isValidTemplateString('<View @click="$fn" />'), true)
  })

  test('returns true for comment-only string', () => {
    assert.equal(isValidTemplateString('<!-- comment -->'), true)
  })

  test('returns false for plain string', () => {
    assert.equal(isValidTemplateString('hello world'), false)
  })

  test('returns false for empty string', () => {
    assert.equal(isValidTemplateString(''), false)
  })

  test('returns false for null', () => {
    assert.equal(isValidTemplateString(null), false)
  })

  test('returns false for non-string', () => {
    assert.equal(isValidTemplateString(42), false)
  })

  test('returns false for SQL-like string with angle brackets', () => {
    // text before first < → not a template
    assert.equal(isValidTemplateString('value < 10'), false)
  })
})
