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
const prettier = require('prettier')
const plugin = require('../src/index.js')

const format = (code, opts = {}) =>
  prettier.format(code, { parser: 'babel', plugins: [plugin], printWidth: 80, ...opts })

const formatTs = (code, opts = {}) =>
  prettier.format(code, { parser: 'babel-ts', plugins: [plugin], printWidth: 80, ...opts })

describe('format: self-closing elements', () => {
  test('short tag stays on one line', async () => {
    const input = "Blits.Component('X', { template: `<Element x=\"10\" y=\"20\" />` })"
    const output = await format(input)
    assert.ok(output.includes('<Element x="10" y="20" />'))
  })

  test('long tag breaks attributes across lines', async () => {
    const input =
      "Blits.Component('X', { template: `<Element color=\"red\" w=\"1920\" h=\"1080\" alpha=\"0.5\" mountX=\"0.5\" mountY=\"0.5\" />` })"
    const output = await format(input)
    assert.ok(output.includes('color="red"'))
    // when broken, /> appears on its own line with no attribute on the same line
    assert.match(output, /\n\s+\/>/)
    assert.doesNotMatch(output, /[a-z0-9"'] \/>/)
  })
})

describe('format: nested elements', () => {
  test('parent with single child', async () => {
    const input = "Blits.Component('X', { template: `<Element><Text /></Element>` })"
    const output = await format(input)
    assert.ok(output.includes('<Element>'))
    assert.ok(output.includes('<Text />'))
    assert.ok(output.includes('</Element>'))
  })

  test('deeply nested', async () => {
    const input =
      "Blits.Component('X', { template: `<Element><Layout><Text content=\"hello\" /></Layout></Element>` })"
    const output = await format(input)
    assert.ok(output.includes('<Layout>'))
    assert.ok(output.includes('</Layout>'))
    assert.ok(output.includes('<Text content="hello" />'))
  })
})

describe('format: reactive and event attributes', () => {
  test('reactive binding preserved', async () => {
    const input = "Blits.Component('X', { template: `<Element :color=\"$myColor\" />` })"
    const output = await format(input)
    assert.ok(output.includes(':color="$myColor"'))
  })

  test('event handler preserved', async () => {
    const input = "Blits.Component('X', { template: `<Element @loaded=\"$onLoaded\" />` })"
    const output = await format(input)
    assert.ok(output.includes('@loaded="$onLoaded"'))
  })

  test(':for with key preserved', async () => {
    const input =
      "Blits.Component('X', { template: `<Element :for=\"item in $items\" :key=\"item.id\" />` })"
    const output = await format(input)
    assert.ok(output.includes(':for="item in $items"'))
    assert.ok(output.includes(':key="item.id"'))
  })
})

describe('format: empty fragment', () => {
  test('empty fragment renders as <></>', async () => {
    const input = "Blits.Component('X', { template: `<><Text /></>` })"
    const output = await format(input)
    assert.ok(output.includes('<>'))
    assert.ok(output.includes('</>'))
  })
})

describe('format: comments', () => {
  test('HTML comment preserved', async () => {
    const input = "Blits.Component('X', { template: `<!-- title --><Element />` })"
    const output = await format(input)
    assert.ok(output.includes('<!-- title -->'))
  })
})

describe('format: string literal template', () => {
  test('single-quoted string formats inline', async () => {
    const input = "Blits.Component('X', { template: '<Element x=\"10\" />' })"
    const output = await format(input)
    assert.ok(output.includes('<Element x="10" />'))
  })
})

describe('format: TypeScript parser', () => {
  test('formats template in .ts file', async () => {
    const input = "Blits.Component('X', { template: `<Element x=\"10\" y=\"20\" />` })"
    const output = await formatTs(input)
    assert.ok(output.includes('<Element x="10" y="20" />'))
  })
})

describe('format: Blits.Application', () => {
  test('formats template inside Blits.Application', async () => {
    const input = "Blits.Application({ template: `<Element />` })"
    const output = await format(input)
    assert.ok(output.includes('<Element />'))
  })
})

describe('format: blitsClosingBacktick option', () => {
  const nested = "Blits.Component('X', { template: `<Element><Text content=\"hello\" /></Element>` })"

  test('newline (default) — closing backtick on its own line', async () => {
    const output = await format(nested, { blitsClosingBacktick: 'newline' })
    assert.match(output, /\n\s*`/)
  })

  test('inline — closing backtick at end of last content line', async () => {
    const output = await format(nested, { blitsClosingBacktick: 'inline' })
    assert.match(output, />\`/)
    assert.doesNotMatch(output, /\n`/)
  })
})

describe('format: blitsWrapAttributes option', () => {
  // template long enough to exceed printWidth when indented
  const longTag =
    "Blits.Component('X', { template: `<Element color=\"red\" w=\"1920\" h=\"1080\" alpha=\"0.5\" mountX=\"0.5\" mountY=\"0.5\" />` })"

  test('false — attributes stay on one line regardless of printWidth', async () => {
    const output = await format(longTag, { blitsWrapAttributes: false })
    assert.ok(output.includes('color="red"'))
    assert.doesNotMatch(output, /\n\s+color/)
    assert.ok(output.includes(' />'))
  })

  test('true (default) — attributes wrap when tag exceeds printWidth', async () => {
    const output = await format(longTag, { blitsWrapAttributes: true })
    assert.match(output, /\n\s+color/)
  })
})

describe('format: blitsSelfClosingTags option', () => {
  const emptyTag = "Blits.Component('X', { template: `<Element w=\"100\"></Element>` })"

  test('false (default) — empty open/close tag preserved', async () => {
    const output = await format(emptyTag)
    assert.ok(output.includes('<Element w="100"></Element>'))
  })

  test('true — empty open/close tag collapsed to self-closing', async () => {
    const output = await format(emptyTag, { blitsSelfClosingTags: true })
    assert.ok(output.includes('<Element w="100" />'))
  })
})

describe('format: idempotency', () => {
  test('formatting twice gives the same result', async () => {
    const input =
      "Blits.Component('X', { template: `<Element color=\"red\" w=\"1920\" h=\"1080\"><Text content=\"hello\" /></Element>` })"
    const first = await format(input)
    const second = await format(first)
    assert.equal(first, second)
  })
})

describe('format: non-template strings not touched', () => {
  test('plain object template is not formatted as Blits', async () => {
    const input = "const obj = { template: `<Element />` }"
    // should not throw — default printer handles it
    const output = await format(input)
    assert.equal(typeof output, 'string')
    assert.ok(output.length > 0)
  })
})
