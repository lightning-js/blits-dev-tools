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
const { parse } = require('../src/blitsParser.js')

describe('parse: AST shape', () => {
  test('returns root node', () => {
    const ast = parse('<Element />')
    assert.equal(ast.type, 'root')
    assert.ok(Array.isArray(ast.children))
    assert.equal(ast.start, 0)
  })

  test('single self-closing element', () => {
    const ast = parse('<Element />')
    assert.equal(ast.children.length, 1)
    const el = ast.children[0]
    assert.equal(el.type, 'element')
    assert.equal(el.tag, 'Element')
    assert.equal(el.selfClosing, true)
    assert.deepEqual(el.attrs, [])
    assert.deepEqual(el.children, [])
  })

  test('element with attributes', () => {
    const ast = parse('<Element x="10" y="20" />')
    const el = ast.children[0]
    assert.deepEqual(el.attrs, [
      { name: 'x', value: '10' },
      { name: 'y', value: '20' },
    ])
  })

  test('reactive and event attributes', () => {
    const ast = parse('<Element :color="$myColor" @click="$handleClick" />')
    const el = ast.children[0]
    assert.equal(el.attrs[0].name, ':color')
    assert.equal(el.attrs[0].value, '$myColor')
    assert.equal(el.attrs[1].name, '@click')
    assert.equal(el.attrs[1].value, '$handleClick')
  })

  test('open/close element with no children', () => {
    const ast = parse('<Element></Element>')
    const el = ast.children[0]
    assert.equal(el.selfClosing, false)
    assert.deepEqual(el.children, [])
  })

  test('nested elements', () => {
    const ast = parse('<Element><Text /></Element>')
    const el = ast.children[0]
    assert.equal(el.children.length, 1)
    assert.equal(el.children[0].tag, 'Text')
  })

  test('comment node', () => {
    const ast = parse('<!-- a comment --><Element />')
    assert.equal(ast.children[0].type, 'comment')
    assert.ok(ast.children[0].text.includes('a comment'))
  })

  test('end position equals text length', () => {
    const text = '<Element />'
    const ast = parse(text)
    assert.equal(ast.end, text.length)
  })
})

describe('parse: errors', () => {
  test('throws on invalid template', () => {
    assert.throws(() => parse('<Element /><Text />'), Error)
  })
})
