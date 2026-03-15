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
const { RuleTester } = require('eslint')
const rule = require('../../lib/rules/only-valid-attributes-for-tags')

const tester = new RuleTester({ languageOptions: { ecmaVersion: 2022 } })

// Helper to build a Blits.Component template string
const tmpl = (t) => `Blits.Component('Foo', { template: '${t}' })`

describe('only-valid-attributes-for-tags: universal attributes', () => {
  test('x and y are valid on all built-in tags', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [
        { code: tmpl('<Element x="10" y="20" />') },
        { code: tmpl('<Text x="10" y="20" />') },
        { code: tmpl('<Layout x="10" y="20" />') },
        { code: tmpl('<RouterView x="10" y="20" />') },
        { code: tmpl('<Component x="10" y="20" />') },
      ],
      invalid: [],
    })
  })

  test('alpha is valid on all built-in tags', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [
        { code: tmpl('<Element alpha="1" />') },
        { code: tmpl('<Text alpha="0.5" />') },
        { code: tmpl('<Layout alpha="0" />') },
        { code: tmpl('<RouterView alpha="1" />') },
        { code: tmpl('<Component alpha="0.5" />') },
      ],
      invalid: [],
    })
  })

  test('ref is valid on all built-in tags', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [
        { code: tmpl('<Element ref="el" />') },
        { code: tmpl('<Text ref="txt" />') },
        { code: tmpl('<Layout ref="lay" />') },
        { code: tmpl('<RouterView ref="rv" />') },
        { code: tmpl('<Component ref="comp" />') },
      ],
      invalid: [],
    })
  })

  test('show is valid on all built-in tags', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [
        { code: tmpl('<Element show="true" />') },
        { code: tmpl('<Text show="false" />') },
        { code: tmpl('<Layout show="true" />') },
        { code: tmpl('<RouterView show="true" />') },
        { code: tmpl('<Component show="false" />') },
      ],
      invalid: [],
    })
  })

  test('for, key, range are valid on all built-in tags', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [
        { code: tmpl('<Element :for="item in $list" key="$item.id" />') },
        { code: tmpl('<Text :for="item in $list" key="$item.id" />') },
        { code: tmpl('<Layout :for="item in $list" key="$item.id" />') },
        { code: tmpl('<Component :for="item in $list" key="$item.id" />') },
      ],
      invalid: [],
    })
  })

  test('scale, rotation, mount, pivot are valid on all built-in tags except Component', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [
        { code: tmpl('<Element scale="2" rotation="45" />') },
        { code: tmpl('<Text scale="0.5" />') },
        { code: tmpl('<Layout rotation="90" />') },
        { code: tmpl('<RouterView mount="0.5" />') },
      ],
      invalid: [
        {
          code: tmpl('<Component rotation="45" />'),
          errors: [{ messageId: 'invalidAttr' }],
        },
        {
          code: tmpl('<Component mount="0.5" />'),
          errors: [{ messageId: 'invalidAttr' }],
        },
      ],
    })
  })
})

describe('only-valid-attributes-for-tags: Element-only attributes', () => {
  test('src is valid only on Element', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [
        { code: tmpl('<Element src="img.png" />') },
        { code: tmpl('<Element :src="$url" />') },
      ],
      invalid: [
        { code: tmpl('<Text src="img.png" />'), errors: [{ messageId: 'invalidAttr' }] },
        { code: tmpl('<Layout src="img.png" />'), errors: [{ messageId: 'invalidAttr' }] },
        { code: tmpl('<RouterView src="img.png" />'), errors: [{ messageId: 'invalidAttr' }] },
        { code: tmpl('<Component src="img.png" />'), errors: [{ messageId: 'invalidAttr' }] },
      ],
    })
  })

  test('fit is valid only on Element', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [{ code: tmpl('<Element fit="cover" />') }],
      invalid: [
        { code: tmpl('<Text fit="cover" />'), errors: [{ messageId: 'invalidAttr' }] },
        { code: tmpl('<Layout fit="cover" />'), errors: [{ messageId: 'invalidAttr' }] },
      ],
    })
  })

  test('rtt is valid only on Element', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [{ code: tmpl('<Element rtt="true" />') }],
      invalid: [
        { code: tmpl('<Text rtt="true" />'), errors: [{ messageId: 'invalidAttr' }] },
        { code: tmpl('<Layout rtt="true" />'), errors: [{ messageId: 'invalidAttr' }] },
      ],
    })
  })

  test('effects is valid only on Element', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [{ code: tmpl('<Element effects="{}" />') }],
      invalid: [
        { code: tmpl('<Text effects="{}" />'), errors: [{ messageId: 'invalidAttr' }] },
        { code: tmpl('<Layout effects="{}" />'), errors: [{ messageId: 'invalidAttr' }] },
      ],
    })
  })

  test('@loaded and @error are valid only on Element and Text', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [
        { code: tmpl('<Element @loaded="$onLoad" />') },
        { code: tmpl('<Text @loaded="$onLoad" />') },
        { code: tmpl('<Element @error="$onErr" />') },
        { code: tmpl('<Text @error="$onErr" />') },
      ],
      invalid: [
        { code: tmpl('<Layout @loaded="$onLoad" />'), errors: [{ messageId: 'invalidAttr' }] },
        { code: tmpl('<Component @loaded="$onLoad" />'), errors: [{ messageId: 'invalidAttr' }] },
        { code: tmpl('<Layout @error="$onErr" />'), errors: [{ messageId: 'invalidAttr' }] },
      ],
    })
  })
})

describe('only-valid-attributes-for-tags: Text-only attributes', () => {
  test('content is valid only on Text', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [{ code: tmpl('<Text content="hello" />') }],
      invalid: [
        { code: tmpl('<Element content="hello" />'), errors: [{ messageId: 'invalidAttr' }] },
        { code: tmpl('<Layout content="hello" />'), errors: [{ messageId: 'invalidAttr' }] },
      ],
    })
  })

  test('font is valid only on Text', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [{ code: tmpl('<Text font="sans-serif" />') }],
      invalid: [
        { code: tmpl('<Element font="sans-serif" />'), errors: [{ messageId: 'invalidAttr' }] },
      ],
    })
  })

  test('size is valid only on Text', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [{ code: tmpl('<Text size="32" />') }],
      invalid: [
        { code: tmpl('<Element size="32" />'), errors: [{ messageId: 'invalidAttr' }] },
        { code: tmpl('<Layout size="32" />'), errors: [{ messageId: 'invalidAttr' }] },
      ],
    })
  })

  test('align is valid only on Text', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [{ code: tmpl('<Text align="center" />') }],
      invalid: [
        { code: tmpl('<Element align="center" />'), errors: [{ messageId: 'invalidAttr' }] },
        { code: tmpl('<Layout align="center" />'), errors: [{ messageId: 'invalidAttr' }] },
      ],
    })
  })

  test('maxwidth, maxlines, maxheight, lineheight are valid only on Text', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [
        { code: tmpl('<Text maxwidth="300" maxlines="2" maxheight="100" lineheight="24" />') },
      ],
      invalid: [
        { code: tmpl('<Element maxwidth="300" />'), errors: [{ messageId: 'invalidAttr' }] },
        { code: tmpl('<Layout maxlines="2" />'), errors: [{ messageId: 'invalidAttr' }] },
      ],
    })
  })

  test('contain and letterspacing are valid only on Text', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [
        { code: tmpl('<Text contain="both" letterspacing="2" />') },
      ],
      invalid: [
        { code: tmpl('<Element contain="both" />'), errors: [{ messageId: 'invalidAttr' }] },
        { code: tmpl('<Element letterspacing="2" />'), errors: [{ messageId: 'invalidAttr' }] },
      ],
    })
  })
})

describe('only-valid-attributes-for-tags: Layout-only attributes', () => {
  test('direction is valid only on Layout', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [{ code: tmpl('<Layout direction="horizontal" />') }],
      invalid: [
        { code: tmpl('<Element direction="horizontal" />'), errors: [{ messageId: 'invalidAttr' }] },
        { code: tmpl('<Text direction="horizontal" />'), errors: [{ messageId: 'invalidAttr' }] },
      ],
    })
  })

  test('gap is valid only on Layout', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [{ code: tmpl('<Layout gap="10" />') }],
      invalid: [
        { code: tmpl('<Element gap="10" />'), errors: [{ messageId: 'invalidAttr' }] },
        { code: tmpl('<Text gap="10" />'), errors: [{ messageId: 'invalidAttr' }] },
      ],
    })
  })

  test('align-items is valid only on Layout', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [{ code: tmpl('<Layout align-items="center" />') }],
      invalid: [
        { code: tmpl('<Element align-items="center" />'), errors: [{ messageId: 'invalidAttr' }] },
        { code: tmpl('<Text align-items="center" />'), errors: [{ messageId: 'invalidAttr' }] },
      ],
    })
  })

  test('padding is valid only on Layout', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [{ code: tmpl('<Layout padding="20" />') }],
      invalid: [
        { code: tmpl('<Element padding="20" />'), errors: [{ messageId: 'invalidAttr' }] },
        { code: tmpl('<Text padding="20" />'), errors: [{ messageId: 'invalidAttr' }] },
      ],
    })
  })

  test('@updated is valid only on Layout', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [{ code: tmpl('<Layout @updated="$onUpdate" />') }],
      invalid: [
        { code: tmpl('<Element @updated="$onUpdate" />'), errors: [{ messageId: 'invalidAttr' }] },
        { code: tmpl('<Text @updated="$onUpdate" />'), errors: [{ messageId: 'invalidAttr' }] },
        { code: tmpl('<Component @updated="$onUpdate" />'), errors: [{ messageId: 'invalidAttr' }] },
      ],
    })
  })
})

describe('only-valid-attributes-for-tags: Component-only attributes', () => {
  test('is is valid only on the built-in Component tag', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [{ code: tmpl('<Component is="$comp" />') }],
      invalid: [
        { code: tmpl('<Element is="$comp" />'), errors: [{ messageId: 'invalidAttr' }] },
        { code: tmpl('<Text is="$comp" />'), errors: [{ messageId: 'invalidAttr' }] },
        { code: tmpl('<Layout is="$comp" />'), errors: [{ messageId: 'invalidAttr' }] },
      ],
    })
  })
})

describe('only-valid-attributes-for-tags: general behaviour', () => {
  test('user-defined PascalCase tags are not validated', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [
        { code: tmpl('<Card src="img.png" content="text" direction="custom" is="$comp" />') },
        { code: tmpl('<MyPoster align-items="start" />') },
      ],
      invalid: [],
    })
  })

  test('attributes not in the schema are ignored', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [
        { code: tmpl('<Element @tap="$onTap" />') },
        { code: tmpl('<Element .transition="{alpha: {value: 1}}" />') },
      ],
      invalid: [],
    })
  })

  test('reports in Blits.Application', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [],
      invalid: [
        {
          code: `Blits.Application({ template: '<Element direction="horizontal" />' })`,
          errors: [{ messageId: 'invalidAttr' }],
        },
      ],
    })
  })

  test('reports on nested elements', () => {
    tester.run('only-valid-attributes-for-tags', rule, {
      valid: [],
      invalid: [
        {
          code: tmpl('<Element><Text src="img.png" /></Element>'),
          errors: [{ messageId: 'invalidAttr' }],
        },
      ],
    })
  })
})
