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
    const input = 'Blits.Component(\'X\', { template: `<Element x="10" y="20" />` })'
    const output = await format(input)
    assert.ok(output.includes('<Element x="10" y="20" />'))
  })

  test('long tag breaks attributes across lines', async () => {
    const input =
      'Blits.Component(\'X\', { template: `<Element color="red" w="1920" h="1080" alpha="0.5" mountX="0.5" mountY="0.5" />` })'
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
    const input = 'Blits.Component(\'X\', { template: `<Element><Layout><Text content="hello" /></Layout></Element>` })'
    const output = await format(input)
    assert.ok(output.includes('<Layout>'))
    assert.ok(output.includes('</Layout>'))
    assert.ok(output.includes('<Text content="hello" />'))
  })
})

describe('format: reactive and event attributes', () => {
  test('reactive binding preserved', async () => {
    const input = 'Blits.Component(\'X\', { template: `<Element :color="$myColor" />` })'
    const output = await format(input)
    assert.ok(output.includes(':color="$myColor"'))
  })

  test('event handler preserved', async () => {
    const input = 'Blits.Component(\'X\', { template: `<Element @loaded="$onLoaded" />` })'
    const output = await format(input)
    assert.ok(output.includes('@loaded="$onLoaded"'))
  })

  test(':for with key preserved', async () => {
    const input = 'Blits.Component(\'X\', { template: `<Element :for="item in $items" :key="item.id" />` })'
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

describe('format: blitsClosingBracketSameLine option', () => {
  const longTag =
    'Blits.Component(\'X\', { template: `<Element color="red" w="1920" h="1080" alpha="0.5" mountX="0.5" mountY="0.5"><Text /></Element>` })'

  test('false (default) — closing > on its own line', async () => {
    const output = await format(longTag, { blitsClosingBracketSameLine: false })
    assert.match(output, /mountY="0\.5"\n\s+>/)
  })

  test('true — closing > on last attribute line', async () => {
    const output = await format(longTag, { blitsClosingBracketSameLine: true })
    assert.match(output, /mountY="0\.5">/)
    assert.doesNotMatch(output, /mountY="0\.5"\n/)
  })

  test('false — already multiline input, closing > stays on its own line', async () => {
    const multilineTag =
      'Blits.Component(\'X\', { template: `\n  <Element\n    color="red"\n    w="1920"\n    h="1080"\n    alpha="0.5"\n    mountX="0.5"\n    mountY="0.5"\n  >\n    <Text />\n  </Element>\n` })'
    const output = await format(multilineTag, { blitsClosingBracketSameLine: false })
    assert.match(output, /mountY="0\.5"\n\s+>/)
  })

  test('true — already multiline input, closing > moves to last attribute line', async () => {
    const multilineTag =
      'Blits.Component(\'X\', { template: `\n  <Element\n    color="red"\n    w="1920"\n    h="1080"\n    alpha="0.5"\n    mountX="0.5"\n    mountY="0.5"\n  >\n    <Text />\n  </Element>\n` })'
    const output = await format(multilineTag, { blitsClosingBracketSameLine: true })
    assert.match(output, /mountY="0\.5">/)
    assert.doesNotMatch(output, /mountY="0\.5"\n/)
  })

  test('self-closing tags unaffected', async () => {
    const output = await format(longTag, { blitsClosingBracketSameLine: true })
    assert.match(output, /<Text \/>/)
  })

  test('inline tag unaffected — short tag stays on one line', async () => {
    const shortTag = 'Blits.Component(\'X\', { template: `<Element w="100"><Text /></Element>` })'
    const output = await format(shortTag, { blitsClosingBracketSameLine: true })
    assert.match(output, /<Element w="100">/)
  })
})

describe('format: blitsPreserveBlankLines option', () => {
  test('blank line between siblings is preserved', async () => {
    const input = "Blits.Component('X', { template: `<Element><Text />\n\n<Image /></Element>` })"
    const output = await format(input)
    assert.match(output, /Text \/>[\s\S]*\n\n[\s\S]*<Image/)
  })

  test('multiple blank lines between siblings collapsed to one', async () => {
    const input = "Blits.Component('X', { template: `<Element><Text />\n\n\n\n<Image /></Element>` })"
    const output = await format(input)
    assert.match(output, /Text \/>[\s\S]*\n\n[\s\S]*<Image/)
    assert.doesNotMatch(output, /Text \/>[\s\S]*\n\n\n[\s\S]*<Image/)
  })

  test('whitespace-only line between siblings treated as blank', async () => {
    const input = "Blits.Component('X', { template: `<Element><Text />\n   \n<Image /></Element>` })"
    const output = await format(input)
    assert.match(output, /Text \/>[\s\S]*\n\n[\s\S]*<Image/)
  })

  test('no blank line — siblings stay compact', async () => {
    const input = "Blits.Component('X', { template: `<Element><Text /><Image /></Element>` })"
    const output = await format(input)
    assert.doesNotMatch(output, /Text \/>[\s\S]*\n\n[\s\S]*<Image/)
  })

  test('false — blank lines collapsed', async () => {
    const input = "Blits.Component('X', { template: `<Element><Text />\n\n<Image /></Element>` })"
    const output = await format(input, { blitsPreserveBlankLines: false })
    assert.doesNotMatch(output, /Text \/>[\s\S]*\n\n[\s\S]*<Image/)
  })
})

describe('format: blitsTrimAttributeValues option', () => {
  test('true (default) — whitespace padding around value is trimmed', async () => {
    const input = 'Blits.Component(\'X\', { template: `<Element :w=" 354 -14 " />` })'
    const output = await format(input)
    assert.ok(output.includes(':w="354 -14"'))
  })

  test('false — value is passed through unchanged', async () => {
    const input = 'Blits.Component(\'X\', { template: `<Element :w=" 354 -14 " />` })'
    const output = await format(input, { blitsTrimAttributeValues: false })
    assert.ok(output.includes(':w=" 354 -14 "'))
  })

  test('multiline object value — internal newlines and indentation preserved', async () => {
    const input =
      "Blits.Component('X', { template: `<Element :transition=\"{\n  prop: 'x',\n  duration: 300\n}\" />` })"
    const output = await format(input)
    assert.ok(output.includes('prop:'))
    assert.ok(output.includes('duration:'))
    assert.match(output, /prop:.*\n.*duration:/s)
  })
})

describe('format: blitsNormalizeComments option', () => {
  test('missing leading space is added', async () => {
    const input = "Blits.Component('X', { template: `<!--Title --><Element />` })"
    const output = await format(input)
    assert.ok(output.includes('<!-- Title -->'))
  })

  test('triple-dash comment is normalized', async () => {
    const input = "Blits.Component('X', { template: `<!--- positioning ---><Element />` })"
    const output = await format(input)
    assert.ok(output.includes('<!-- positioning -->'))
  })

  test('already-correct comment is unchanged', async () => {
    const input = "Blits.Component('X', { template: `<!-- correct --><Element />` })"
    const output = await format(input)
    assert.ok(output.includes('<!-- correct -->'))
  })

  test('empty comment normalizes to single space on each side', async () => {
    const input = "Blits.Component('X', { template: `<!-- --><Element />` })"
    const output = await format(input)
    assert.ok(output.includes('<!-- -->'))
    assert.ok(!output.includes('<!--  -->'))
  })

  test('false — comment passed through raw', async () => {
    const input = "Blits.Component('X', { template: `<!--Title --><Element />` })"
    const output = await format(input, { blitsNormalizeComments: false })
    assert.ok(output.includes('<!--Title -->'))
  })
})

describe('format: text content', () => {
  test('inline text content stays inline', async () => {
    const input =
      'Blits.Component(\'X\', { template: `<Text x="400" y="400" alpha="0.2">Text with alpha applied directly</Text>` })'
    const output = await format(input)
    assert.ok(output.includes('<Text x="400" y="400" alpha="0.2">Text with alpha applied directly</Text>'))
  })

  test('multiline text content is preserved exactly', async () => {
    const input = "Blits.Component('X', { template: `<Text>\n  Line one\n  Line two\n</Text>` })"
    const output = await format(input)
    assert.ok(output.includes('<Text>\n  Line one\n  Line two\n</Text>'))
  })

  test('text content with internal spacing is not touched', async () => {
    const input = "Blits.Component('X', { template: `<Text>  spaced   content  </Text>` })"
    const output = await format(input)
    assert.ok(output.includes('<Text>  spaced   content  </Text>'))
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
    const input = 'Blits.Component(\'X\', { template: `<Element x="10" y="20" />` })'
    const output = await formatTs(input)
    assert.ok(output.includes('<Element x="10" y="20" />'))
  })
})

describe('format: Blits.Application', () => {
  test('formats template inside Blits.Application', async () => {
    const input = 'Blits.Application({ template: `<Element />` })'
    const output = await format(input)
    assert.ok(output.includes('<Element />'))
  })
})

describe('format: blitsClosingBacktick option', () => {
  const nested = 'Blits.Component(\'X\', { template: `<Element><Text content="hello" /></Element>` })'

  test('newline (default) — closing backtick on its own line', async () => {
    const output = await format(nested, { blitsClosingBacktick: 'newline' })
    assert.match(output, /\n\s*`/)
  })

  test('inline — closing backtick at end of last content line', async () => {
    const output = await format(nested, { blitsClosingBacktick: 'inline' })
    assert.match(output, />`/)
    assert.doesNotMatch(output, /\n`/)
  })
})

describe('format: blitsWrapAttributes option', () => {
  // template long enough to exceed printWidth when indented
  const longTag =
    'Blits.Component(\'X\', { template: `<Element color="red" w="1920" h="1080" alpha="0.5" mountX="0.5" mountY="0.5" />` })'

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
  const emptyTag = 'Blits.Component(\'X\', { template: `<Element w="100"></Element>` })'

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
      'Blits.Component(\'X\', { template: `<Element color="red" w="1920" h="1080"><Text content="hello" /></Element>` })'
    const first = await format(input)
    const second = await format(first)
    assert.equal(first, second)
  })
})

describe('format: non-template strings not touched', () => {
  test('plain object template is not formatted as Blits', async () => {
    const input = 'const obj = { template: `<Element />` }'
    // should not throw — default printer handles it
    const output = await format(input)
    assert.equal(typeof output, 'string')
    assert.ok(output.length > 0)
  })
})

describe('format: multi-line template preservation', () => {
  test('multi-line template stays multi-line by default', async () => {
    const input = 'Blits.Component(\'X\', { template: `\n  <Element w="100" />\n` })'
    const output = await format(input)
    assert.match(output, /`\n\s+<Element/)
  })

  test('single-line template stays single-line by default', async () => {
    const input = 'Blits.Component(\'X\', { template: `<Element w="100" />` })'
    const output = await format(input)
    assert.doesNotMatch(output, /`\n/)
    assert.ok(output.includes('<Element w="100" />'))
  })

  test('blitsCollapseSingleElement: true — multi-line template collapsed when it fits in printWidth', async () => {
    const input = 'Blits.Component(\'X\', { template: `\n  <Element w="100" />\n` })'
    const output = await format(input, { blitsCollapseSingleElement: true })
    assert.doesNotMatch(output, /`\n\s+<Element/)
    assert.ok(output.includes('<Element w="100" />'))
  })

  test('blitsCollapseSingleElement: true — does not collapse when template exceeds printWidth', async () => {
    const input =
      'Blits.Component(\'X\', { template: `\n  <Element color="red" w="1920" h="1080" alpha="0.5" mountX="0.5" mountY="0.5" />\n` })'
    const output = await format(input, { blitsCollapseSingleElement: true })
    assert.match(output, /`\n/)
  })

  test('single-quoted string template unaffected by blitsCollapseSingleElement', async () => {
    const input = "Blits.Component('X', { template: '<Element w=\"100\" />' })"
    const output = await format(input, { blitsCollapseSingleElement: true })
    assert.ok(output.includes('<Element w="100" />'))
    assert.doesNotMatch(output, /`/)
  })
})

describe('format: escape sequences in attribute values', () => {
  test('\\n in attribute value is preserved as two characters, not a literal newline', async () => {
    const input = "Blits.Component('X', { template: `<Element :content=\"$status.join('\\n')\" />` })"
    const output = await format(input)
    assert.ok(output.includes(':content="$status.join(\'\\n\')"'), 'escape sequence must be preserved')
    assert.doesNotMatch(output, /:content="[^"]*\n[^"]*"/, 'literal newline must not appear inside attribute value')
  })

  test('\\t in attribute value is preserved as two characters', async () => {
    const input = "Blits.Component('X', { template: `<Element :content=\"'label:\\t' + $value\" />` })"
    const output = await format(input)
    assert.ok(output.includes(':content="\'label:\\t\' + $value"'), 'tab escape sequence must be preserved')
    assert.doesNotMatch(output, /:content="[^"]*\t[^"]*"/, 'literal tab must not appear inside attribute value')
  })

  test('multiple escape sequences in same attribute are all preserved', async () => {
    const input = "Blits.Component('X', { template: `<Element :content=\"'line1:\\n' + 'line2:\\n' + $val\" />` })"
    const output = await format(input)
    assert.ok(output.includes(":content=\"'line1:\\n' + 'line2:\\n' + $val\""))
    assert.doesNotMatch(output, /:content="[^"]*\n[^"]*"/)
  })
})
