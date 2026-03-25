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
const parseTemplate = require('../lib/parser')

describe('parser: valid templates', () => {
  test('self-closing element', () => {
    const result = parseTemplate('<Element />')
    assert.equal(result.status, true)
    assert.equal(result.error, null)
  })

  test('open/close pair', () => {
    const result = parseTemplate('<Element></Element>')
    assert.equal(result.status, true)
  })

  test('nested elements', () => {
    const result = parseTemplate('<Element><Text /></Element>')
    assert.equal(result.status, true)
  })

  test('deeply nested elements', () => {
    const result = parseTemplate('<Element><Layout><Text /></Layout></Element>')
    assert.equal(result.status, true)
  })

  test('element with string attribute', () => {
    const result = parseTemplate('<Element color="red" />')
    assert.equal(result.status, true)
  })

  test('element with multiple attributes', () => {
    const result = parseTemplate('<Element w="100" h="200" color="red" />')
    assert.equal(result.status, true)
  })

  test('element with reactive attribute', () => {
    const result = parseTemplate('<Element:color="$myColor" />')
    assert.equal(result.status, true)
  })

  test('element with event handler', () => {
    const result = parseTemplate('<Element@click="$handleClick" />')
    assert.equal(result.status, true)
  })

  test('empty fragment tag', () => {
    const result = parseTemplate('<><Text /></>')
    assert.equal(result.status, true)
  })

  test('comment before root element', () => {
    const result = parseTemplate('<!-- this is a comment --><Element />')
    assert.equal(result.status, true)
  })

  test('whitespace around template', () => {
    const result = parseTemplate('\n  <Element />\n')
    assert.equal(result.status, true)
  })

  test('empty template string', () => {
    const result = parseTemplate('')
    assert.equal(result.status, true)
  })
})

describe('parser: multiple root elements', () => {
  test('two self-closing elements', () => {
    const result = parseTemplate('<Element /><Text />')
    assert.equal(result.status, false)
    assert.equal(result.error.type, 'MultipleRootElements')
    assert.equal(result.error.info, 'Templates must have exactly one root element.')
  })

  test('self-closing followed by open/close', () => {
    const result = parseTemplate('<Element /><Layout></Layout>')
    assert.equal(result.status, false)
    assert.equal(result.error.type, 'MultipleRootElements')
  })
})

describe('parser: mismatched tags', () => {
  test('wrong closing tag name', () => {
    const result = parseTemplate('<Element></Text>')
    assert.equal(result.status, false)
    assert.equal(result.error.type, 'MismatchedTagPair')
    assert.match(result.error.info, /Expected closing tag for <Element>/)
  })

  test('unmatched closing tag', () => {
    const result = parseTemplate('</Element>')
    assert.equal(result.status, false)
    assert.equal(result.error.type, 'UnmatchedClosingTag')
    assert.equal(result.error.info, 'No matching opening tag found for this closing tag.')
  })

  test('self-closing closing tag', () => {
    const result = parseTemplate('<Element></Element />')
    assert.equal(result.status, false)
    assert.equal(result.error.type, 'InvalidClosingTag')
    assert.equal(result.error.info, 'Closing tags cannot be self-closing. Remove the "/" at the end.')
  })
})

describe('parser: attributes', () => {
  test('redundant attribute', () => {
    const result = parseTemplate('<Element color="red" color="blue" />')
    assert.equal(result.status, false)
    assert.equal(result.error.type, 'RedundantAttribute')
    assert.match(result.error.info, /Attribute "color" is already defined/)
  })

  test('attribute without value', () => {
    const result = parseTemplate('<Element color />')
    assert.equal(result.status, false)
    assert.equal(result.error.type, 'MissingAttributeValue')
  })

  test('unclosed attribute value', () => {
    const result = parseTemplate('<Element color="red />')
    assert.equal(result.status, false)
    assert.equal(result.error.type, 'UnclosedAttributeValue')
    assert.equal(result.error.info, 'Attribute value is not properly closed. Add a matching closing quote.')
  })

  test('attributes on closing tag', () => {
    const result = parseTemplate('<Element></Element color="red">')
    assert.equal(result.status, false)
    assert.equal(result.error.type, 'AttributesInClosingTag')
  })

  test('missing whitespace between attributes', () => {
    const result = parseTemplate('<Element color="red"w="100" />')
    assert.equal(result.status, false)
    assert.equal(result.error.type, 'MissingWhitespace')
  })
})

describe('parser: error shape', () => {
  test('error has ranges array', () => {
    const result = parseTemplate('<Element /><Text />')
    assert.equal(result.status, false)
    assert.ok(Array.isArray(result.error.ranges))
    assert.ok(result.error.ranges.length > 0)
  })

  test('range has start and end', () => {
    const result = parseTemplate('<Element /><Text />')
    const range = result.error.ranges[0]
    assert.ok(typeof range.start === 'number')
    assert.ok(typeof range.end === 'number')
    assert.ok(range.start <= range.end)
  })
})
